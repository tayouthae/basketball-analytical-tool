import pandas as pd
import joblib
import os
from typing import Optional
import numpy as np

def load_data(file_name: str = "master_dataset_enhanced.csv") -> pd.DataFrame:
    """Load the basketball dataset"""
    data_path = os.path.join("data", file_name)
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Data file not found: {data_path}")
    return pd.read_csv(data_path)

def load_model(model_name: str):
    """Load a trained model"""
    model_path = os.path.join("models", model_name)
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found: {model_path}. Please train the model first.")
    return joblib.load(model_path)

def prepare_features(team_data: pd.Series) -> np.ndarray:
    """Prepare features for model prediction"""
    feature_columns = [
        'net_efficiency', 'AdjOE', 'AdjDE', 'Barthag',
        'tournament_readiness', 'rank_efficiency_gap',
        'wins', 'win_percentage', 'talent_boost', 
        'player_BPM_max', 'player_BPM_mean',
        'Adj T.', '3P Rate - 3PR', 'Turnover% - TOR', 
        'Turnover% - TORD', 'conf_adjustment'
    ]
    return team_data[feature_columns].fillna(0).values.reshape(1, -1)

def get_team_stats(team_name: str, year: int = 2024) -> Optional[pd.Series]:
    """Get stats for a specific team and year"""
    data = load_data()
    team_data = data[
        (data['Team'].str.contains(team_name, case=False, na=False)) & 
        (data['Year'] == year)
    ]
    
    if team_data.empty:
        return None
    return team_data.iloc[0]