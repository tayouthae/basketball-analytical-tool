from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import pandas as pd
from utils.data_loader import load_data

router = APIRouter()


class TeamComparison(BaseModel):
    team1: str
    team2: str
    winner_prediction: str
    win_probability: float
    key_differences: Dict[str, Any]


class ConferenceStats(BaseModel):
    conference: str
    avg_efficiency: float
    tournament_rate: float
    top_team: str
    teams_count: int


@router.get("/compare/{team1}/{team2}")
async def compare_teams(team1: str, team2: str, year: int = 2024):
    """Compare two teams head-to-head"""
    try:
        data = load_data()

        team1_data = data[
            (data['Team'].str.contains(team1, case=False, na=False)) &
            (data['Year'] == year)
        ]
        team2_data = data[
            (data['Team'].str.contains(team2, case=False, na=False)) &
            (data['Year'] == year)
        ]

        if team1_data.empty or team2_data.empty:
            raise HTTPException(
                status_code=404, detail="One or both teams not found")

        t1 = team1_data.iloc[0]
        t2 = team2_data.iloc[0]

        # Simple win prediction based on efficiency
        eff_diff = t1.get('net_efficiency', 0) - t2.get('net_efficiency', 0)
        win_prob = 0.5 + (eff_diff / 40)  # Normalize efficiency difference
        win_prob = max(0.1, min(0.9, win_prob))  # Keep between 10-90%

        winner = t1['Team'] if eff_diff > 0 else t2['Team']

        key_differences = {
            "efficiency_gap": round(eff_diff, 1),
            "offensive_advantage": t1['Team'] if t1.get('AdjOE', 0) > t2.get('AdjOE', 0) else t2['Team'],
            "defensive_advantage": t1['Team'] if t1.get('AdjDE', 110) < t2.get('AdjDE', 110) else t2['Team'],
            "pace_difference": round(t1.get('Adj T.', 67) - t2.get('Adj T.', 67), 1),
            "experience_edge": t1['Team'] if t1.get('experience_factor', 0) > t2.get('experience_factor', 0) else t2['Team']
        }

        return TeamComparison(
            team1=t1['Team'],
            team2=t2['Team'],
            winner_prediction=winner,
            win_probability=round(win_prob if winner ==
                                  t1['Team'] else 1-win_prob, 3),
            key_differences=key_differences
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/conferences", response_model=List[ConferenceStats])
async def get_conference_analysis(year: int = 2024):
    """Analyze conference strength"""
    try:
        data = load_data()
        year_data = data[data['Year'] == year]

        conf_stats = year_data.groupby('Conf').agg({
            'net_efficiency': 'mean',
            'made_tournament': ['sum', 'count', 'mean'],
            'Team': 'first'
        }).round(3)

        conf_stats.columns = ['avg_efficiency', 'tournament_teams',
                              'total_teams', 'tournament_rate', 'sample_team']
        conf_stats = conf_stats.reset_index()

        # Get top team per conference
        conf_tops = year_data.loc[year_data.groupby(
            'Conf')['net_efficiency'].idxmax()]
        conf_top_map = dict(zip(conf_tops['Conf'], conf_tops['Team']))

        result = []
        for _, conf in conf_stats.iterrows():
            if conf['total_teams'] >= 3:  # Only include conferences with 3+ teams
                result.append(ConferenceStats(
                    conference=conf['Conf'],
                    avg_efficiency=round(conf['avg_efficiency'], 1),
                    tournament_rate=round(conf['tournament_rate'], 3),
                    top_team=conf_top_map.get(conf['Conf'], 'Unknown'),
                    teams_count=int(conf['total_teams'])
                ))

        return sorted(result, key=lambda x: x.avg_efficiency, reverse=True)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/team-profile/{team_name}")
async def get_team_profile(team_name: str, year: int = 2024):
    """Get comprehensive team profile"""
    try:
        data = load_data()
        team_data = data[
            (data['Team'].str.contains(team_name, case=False, na=False)) &
            (data['Year'] == year)
        ]

        if team_data.empty:
            raise HTTPException(status_code=404, detail="Team not found")

        team = team_data.iloc[0]

        # Calculate percentiles for key stats
        year_data = data[data['Year'] == year]
        percentiles = {}
        key_stats = ['net_efficiency', 'AdjOE', 'AdjDE', 'win_percentage']

        for stat in key_stats:
            if stat in year_data.columns:
                percentile = (year_data[stat] <=
                              team.get(stat, 0)).mean() * 100
                percentiles[stat] = round(percentile, 1)

        profile = {
            "team": team['Team'],
            "conference": team['Conf'],
            "year": year,
            "record": str(team.get('Rec', 'N/A')),
            "efficiency_metrics": {
                "net_efficiency": round(team.get('net_efficiency', 0), 1),
                "offensive_efficiency": round(team.get('AdjOE', 0), 1),
                "defensive_efficiency": round(team.get('AdjDE', 0), 1),
                "pace": round(team.get('Adj T.', 0), 1)
            },
            "percentiles": percentiles,
            "strengths": [],
            "weaknesses": [],
            "tournament_outlook": {
                "probability": round(team.get('tournament_readiness', 0.5), 3),
                "readiness_score": round(team.get('tournament_readiness', 0.5), 3)
            }
        }

        # Identify strengths and weaknesses
        if percentiles.get('AdjOE', 50) > 75:
            profile["strengths"].append("Elite offense")
        if percentiles.get('AdjDE', 50) > 75:
            profile["strengths"].append("Strong defense")
        if team.get('win_percentage', 0.5) > 0.8:
            profile["strengths"].append("Consistent wins")

        if percentiles.get('net_efficiency', 50) < 25:
            profile["weaknesses"].append("Below-average efficiency")
        if team.get('win_percentage', 0.5) < 0.6:
            profile["weaknesses"].append("Inconsistent record")

        return profile

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/teams")
async def get_unique_teams():
    """Get list of all unique team names from the dataset"""
    try:
        data = load_data()
        unique_teams = data['Team'].dropna().unique().tolist()
        return {"teams": sorted(unique_teams)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
