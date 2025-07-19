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

  export interface ConferenceStats {
    conference: string;
    avg_efficiency: number;
    tournament_rate: number;
    top_team: string;
    teams_count: number;
  }

  export interface TopTeam {
    team: string;
    conference: string;
    efficiency: number;
    wins: number;
    record: string;
    tournament_readiness: number;
  }

  export interface TopTeamsResponse {
    top_teams: TopTeam[];
  }

  export interface TeamProfile {
    team: string;
    conference: string;
    year: number;
    record: string;
    efficiency_metrics: {
      net_efficiency: number;
      offensive_efficiency: number;
      defensive_efficiency: number;
      pace: number;
    };
    percentiles: {
      [key: string]: number;
    };
    strengths: string[];
    weaknesses: string[];
    tournament_outlook: {
      probability: number;
      readiness_score: number;
    };
  }