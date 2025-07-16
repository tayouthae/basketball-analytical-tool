from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
from utils.data_loader import load_data, load_model

router = APIRouter()

class UpsetAlert(BaseModel):
    team: str
    seed: Optional[int]
    upset_risk: float
    risk_level: str
    efficiency: float
    reasons: List[str]

class CinderellaCandidate(BaseModel):
    team: str
    seed: Optional[int]
    deep_run_probability: float
    efficiency: float
    potential_level: str
    strengths: List[str]

@router.get("/alerts", response_model=List[UpsetAlert])
async def get_upset_alerts(year: int = 2024):
    """Get upset alerts for tournament teams"""
    try:
        data = load_data()
        tournament_teams = data[
            (data['Year'] == year) & 
            (data['made_tournament'] == True)
        ].copy()
        
        if tournament_teams.empty:
            # If no tournament data, simulate with top teams
            tournament_teams = data[data['Year'] == year].nlargest(68, 'net_efficiency')
            tournament_teams['seed_numeric'] = list(range(1, len(tournament_teams) + 1))
        
        # Try to load upset model, fallback to rule-based
        try:
            model = load_model('upset_prediction_model.pkl')
            upset_features = ['seed_efficiency_gap', 'seed_rank_gap', 'net_efficiency',
                            'three_point_reliance', 'pace_factor', 'defensive_intensity',
                            'upset_resistance', 'momentum_indicator', 'tournament_readiness',
                            'AdjOE', 'AdjDE', 'win_percentage']
            X = tournament_teams[upset_features].fillna(0)
            upset_probs = model.predict_proba(X)[:, 1]
        except (FileNotFoundError, KeyError):
            # Fallback: high seeds with low efficiency
            if 'seed_numeric' not in tournament_teams.columns:
                tournament_teams['seed_numeric'] = list(range(1, len(tournament_teams) + 1))
            seeds = tournament_teams['seed_numeric']
            efficiency = tournament_teams['net_efficiency'].fillna(0)
            upset_probs = ((seeds <= 6) & (efficiency < 15)).astype(float) * 0.8
        
        tournament_teams['upset_risk'] = upset_probs
        
        # Focus on high seeds with upset risk
        high_seeds = tournament_teams[
            tournament_teams.get('seed_numeric', 99) <= 8
        ].sort_values('upset_risk', ascending=False)
        
        alerts = []
        for _, team in high_seeds.head(10).iterrows():
            risk_level = "High" if team['upset_risk'] > 0.7 else "Medium" if team['upset_risk'] > 0.4 else "Low"
            
            reasons = []
            if team.get('net_efficiency', 0) < 15:
                reasons.append("Below-average efficiency")
            if team.get('win_percentage', 1) < 0.8:
                reasons.append("Inconsistent record")
            if team.get('tournament_readiness', 1) < 0.6:
                reasons.append("Low tournament readiness")
            if not reasons:
                reasons.append("Standard performance indicators")
            
            alerts.append(UpsetAlert(
                team=team['Team'],
                seed=int(team.get('seed_numeric', 0)) if pd.notna(team.get('seed_numeric')) else None,
                upset_risk=round(team['upset_risk'], 3),
                risk_level=risk_level,
                efficiency=round(team.get('net_efficiency', 0), 1),
                reasons=reasons
            ))
            
        return alerts
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/cinderella", response_model=List[CinderellaCandidate])
async def get_cinderella_candidates(year: int = 2024):
    """Get Cinderella (deep run) candidates using the trained model"""
    try:
        data = load_data()
        tournament_teams = data[
            (data['Year'] == year) & 
            (data['made_tournament'] == True)
        ].copy()
        
        if tournament_teams.empty:
            # Simulate with lower-ranked high-efficiency teams
            all_teams = data[data['Year'] == year]
            tournament_teams = all_teams[
                (all_teams['net_efficiency'] > 5) & 
                (all_teams.get('Rk_ranking', 999) > 50)
            ]
            tournament_teams['seed_numeric'] = list(range(9, len(tournament_teams) + 9))
        
        # Focus on lower seeds (potential Cinderellas)
        if 'seed_numeric' in tournament_teams.columns:
            lower_seeds = tournament_teams[
                tournament_teams['seed_numeric'] >= 8
            ].copy()
        else:
            # If no seed column, use all teams
            lower_seeds = tournament_teams.copy()
        
        # 🔧 FIX: Actually use the deep_run_model.pkl
        try:
            deep_run_model = load_model('deep_run_model.pkl')
            
            # Use same features as training
            deep_run_features = [
                'seed_efficiency_gap', 'seed_rank_gap', 'net_efficiency',
                'three_point_reliance', 'pace_factor', 'defensive_intensity',
                'upset_resistance', 'momentum_indicator', 'tournament_readiness',
                'AdjOE', 'AdjDE', 'win_percentage'
            ]
            
            X = lower_seeds[deep_run_features].fillna(0)
            deep_run_probabilities = deep_run_model.predict_proba(X)[:, 1]
            lower_seeds['deep_run_probability'] = deep_run_probabilities
            
            print("✅ Using trained deep_run_model.pkl")
            
        except (FileNotFoundError, KeyError):
            print("⚠️  deep_run_model.pkl not found or missing features, using fallback calculation")
            # Fallback: efficiency-based calculation
            efficiency = lower_seeds['net_efficiency'].fillna(0)
            deep_run_prob = ((efficiency - 5) / 20).clip(0, 1)
            lower_seeds['deep_run_probability'] = deep_run_prob
        
        # Sort by deep run potential
        candidates = lower_seeds.sort_values('deep_run_probability', ascending=False)
        
        result = []
        for _, team in candidates.head(10).iterrows():
            potential = "High" if team['deep_run_probability'] > 0.6 else "Medium" if team['deep_run_probability'] > 0.3 else "Low"
            
            strengths = []
            if team.get('net_efficiency', 0) > 15:
                strengths.append("Strong efficiency")
            if team.get('player_BPM_max', 0) > 8:
                strengths.append("Star player")
            if team.get('AdjDE', 110) < 95:
                strengths.append("Elite defense")
            if not strengths:
                strengths.append("Solid fundamentals")
            
            result.append(CinderellaCandidate(
                team=team['Team'],
                seed=int(team.get('seed_numeric', 0)) if 'seed_numeric' in team.index and pd.notna(team.get('seed_numeric')) else None,
                deep_run_probability=round(team['deep_run_probability'], 3),
                efficiency=round(team.get('net_efficiency', 0), 1),
                potential_level=potential,
                strengths=strengths
            ))
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))