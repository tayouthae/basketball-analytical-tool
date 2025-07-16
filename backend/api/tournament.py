from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
from utils.data_loader import load_data, load_model, prepare_features, get_team_stats

router = APIRouter()

class TournamentPrediction(BaseModel):
    team: str
    year: int
    tournament_probability: float
    efficiency_score: float
    prediction_confidence: str
    key_factors: List[str]
    current_record: str

class BubbleTeam(BaseModel):
    team: str
    conference: str
    tournament_probability: float
    efficiency: float
    wins: int
    record: str

@router.get("/predict/{team_name}", response_model=TournamentPrediction)
async def predict_tournament_chance(team_name: str, year: int = 2024):
    """Predict tournament chances for a specific team"""
    try:
        team_data = get_team_stats(team_name, year)
        if team_data is None:
            raise HTTPException(status_code=404, detail=f"Team '{team_name}' not found for year {year}")
        
        # Try to load model, if not available, use rule-based prediction
        try:
            model = load_model('tournament_qualification_model.pkl')
            X = prepare_features(team_data)
            probability = float(model.predict_proba(X)[0][1])
        except FileNotFoundError:
            # Fallback to rule-based prediction
            efficiency = team_data.get('net_efficiency', 0)
            readiness = team_data.get('tournament_readiness', 0)
            probability = min(max((efficiency + 10) / 40 + readiness, 0), 1)
        
        # Determine confidence and key factors
        confidence = "High" if probability > 0.8 or probability < 0.2 else "Medium"
        
        key_factors = []
        if team_data.get('net_efficiency', 0) > 15:
            key_factors.append("Strong efficiency metrics")
        if team_data.get('tournament_readiness', 0) > 0.7:
            key_factors.append("High tournament readiness")
        if team_data.get('player_BPM_max', 0) > 10:
            key_factors.append("Elite player talent")
        if team_data.get('wins', 0) > 25:
            key_factors.append("Strong win record")
        if not key_factors:
            key_factors.append("Standard performance metrics")
            
        return TournamentPrediction(
            team=team_data['Team'],
            year=year,
            tournament_probability=round(probability, 3),
            efficiency_score=round(team_data.get('net_efficiency', 0), 1),
            prediction_confidence=confidence,
            key_factors=key_factors,
            current_record=str(team_data.get('Rec', 'N/A'))
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@router.get("/bubble-teams", response_model=List[BubbleTeam])
async def get_bubble_teams(year: int = 2024):
    """Get teams on the tournament bubble"""
    try:
        data = load_data()
        year_data = data[data['Year'] == year].copy()
        
        if year_data.empty:
            raise HTTPException(status_code=404, detail=f"No data found for year {year}")
        
        # Try to use model, fallback to efficiency-based ranking
        try:
            model = load_model('tournament_qualification_model.pkl')
            X = year_data[['net_efficiency', 'AdjOE', 'AdjDE', 'Barthag',
                          'tournament_readiness', 'rank_efficiency_gap',
                          'wins', 'win_percentage', 'talent_boost', 
                          'player_BPM_max', 'player_BPM_mean',
                          'Adj T.', '3P Rate - 3PR', 'Turnover% - TOR', 
                          'Turnover% - TORD', 'conf_adjustment']].fillna(0)
            probabilities = model.predict_proba(X)[:, 1]
        except FileNotFoundError:
            # Fallback calculation
            efficiency = year_data['net_efficiency'].fillna(0)
            readiness = year_data['tournament_readiness'].fillna(0)
            probabilities = ((efficiency + 10) / 40 + readiness).clip(0, 1)
        
        year_data['tournament_probability'] = probabilities
        
        # Find bubble teams (probability between 0.3 and 0.7)
        bubble_teams = year_data[
            (year_data['tournament_probability'] >= 0.3) & 
            (year_data['tournament_probability'] <= 0.7)
        ].sort_values('tournament_probability', ascending=False)
        
        result = []
        for _, team in bubble_teams.head(20).iterrows():
            result.append(BubbleTeam(
                team=team['Team'],
                conference=team['Conf'],
                tournament_probability=round(team['tournament_probability'], 3),
                efficiency=round(team.get('net_efficiency', 0), 1),
                wins=int(team.get('wins', 0)) if pd.notna(team.get('wins')) else 0,
                record=str(team.get('Rec', 'N/A'))
            ))
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting bubble teams: {str(e)}")

@router.get("/top-teams")
async def get_top_teams(year: int = 2024, limit: int = 25):
    """Get top tournament candidates"""
    try:
        data = load_data()
        year_data = data[data['Year'] == year].copy()
        
        # Sort by efficiency and tournament readiness
        top_teams = year_data.nlargest(limit, 'net_efficiency')
        
        result = []
        for _, team in top_teams.iterrows():
            result.append({
                "team": team['Team'],
                "conference": team['Conf'],
                "efficiency": round(team.get('net_efficiency', 0), 1),
                "wins": int(team.get('wins', 0)) if pd.notna(team.get('wins')) else 0,
                "record": str(team.get('Rec', 'N/A')),
                "tournament_readiness": round(team.get('tournament_readiness', 0), 3)
            })
            
        return {"top_teams": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))