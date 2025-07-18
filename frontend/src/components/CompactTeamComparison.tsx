'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import TeamSelector from './TeamSelector';

interface TeamComparison {
  team1: string;
  team2: string;
  winner_prediction: string;
  win_probability: number;
  key_differences: {
    efficiency_gap: number;
    offensive_advantage: string;
    defensive_advantage: string;
    pace_difference: number;
    experience_edge: string;
  };
}

export default function CompactTeamComparison() {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [year, setYear] = useState(2024);
  const [comparison, setComparison] = useState<TeamComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const compareTeams = async () => {
    if (!team1.trim() || !team2.trim()) {
      setError('Please enter both team names');
      return;
    }

    setLoading(true);
    setError('');
    setComparison(null);

    try {
      const response = await api.get(`/api/analytics/compare/${team1}/${team2}?year=${year}`);
      setComparison(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('One or both teams not found');
      } else {
        setError('Error comparing teams');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        ⚔️ Head-to-Head Analysis
      </h2>
      
      <div className="space-y-4 mb-6">
        <TeamSelector
          value={team1}
          onChange={setTeam1}
          placeholder="Search and select team..."
          label="Team 1"
        />
        
        <TeamSelector
          value={team2}
          onChange={setTeam2}
          placeholder="Search and select team..."
          label="Team 2"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
            <option value={2021}>2021</option>
            <option value={2019}>2019</option>
          </select>
        </div>

        <button
          onClick={compareTeams}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Comparing...' : 'Compare Teams'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Results */}
      {comparison && (
        <div className="border-t pt-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {comparison.team1} vs {comparison.team2} ({year})
            </h3>

            {/* Winner Prediction */}
            <div className="text-center mb-6">
              <div className="text-lg font-semibold text-gray-700 mb-2">Predicted Winner</div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{comparison.winner_prediction}</div>
              <div className="text-gray-600">
                Win Probability: <span className="font-bold text-blue-600">{(comparison.win_probability * 100).toFixed(1)}%</span>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {comparison.key_differences.efficiency_gap > 0 ? '+' : ''}{comparison.key_differences.efficiency_gap}
                </div>
                <div className="text-sm text-gray-600">Efficiency Gap</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {comparison.key_differences.pace_difference > 0 ? '+' : ''}{comparison.key_differences.pace_difference}
                </div>
                <div className="text-sm text-gray-600">Pace Difference</div>
              </div>
            </div>

            {/* Key Factors */}
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Offensive Advantage: </span>
                <span className="px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                  {comparison.key_differences.offensive_advantage}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Defensive Advantage: </span>
                <span className="px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                  {comparison.key_differences.defensive_advantage}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 