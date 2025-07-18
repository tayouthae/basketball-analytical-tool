export interface TournamentPrediction {
    team: string;
    year: number;
    tournament_probability: number;
    efficiency_score: number;
    prediction_confidence: string;
    key_factors: string[];
    current_record: string;
}

export interface BubbleTeam {
    team: string;
    conference: string;
    tournament_probability: number;
    efficiency: number;
    wins: number;
    record: string;
  }
  
  export interface UpsetAlert {
    team: string;
    seed?: number;
    upset_risk: number;
    risk_level: string;
    efficiency: number;
    reasons: string[];
  }
  
  export interface CinderellaCandidate {
    team: string;
    seed?: number;
    deep_run_probability: number;
    efficiency: number;
    potential_level: string;
    strengths: string[];
  }