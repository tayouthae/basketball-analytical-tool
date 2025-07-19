/* eslint-disable @typescript-eslint/no-explicit-any */
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

export default function TeamComparison() {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [year, setYear] = useState(2025);
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
        setError('One or both teams not found. Please check team names.');
      } else {
        setError('Error comparing teams. Please try again.');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        ⚔️ Head-to-Head Team Comparison
      </h2>

      {/* Input Form */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <TeamSelector
          value={team1}
          onChange={setTeam1}
          placeholder="Search and select first team..."
          label="Team 1"
        />

        <TeamSelector
          value={team2}
          onChange={setTeam2}
          placeholder="Search and select second team..."
          label="Team 2"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
            <option value={2021}>2021</option>
            <option value={2019}>2019</option>
          </select>
        </div>
      </div>

      <button
        onClick={compareTeams}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mb-6"
      >
        {loading ? 'Comparing Teams...' : 'Compare Teams'}
      </button>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Comparison Results */}
      {comparison && (
        <div className="border-t pt-6">
          {/* Winner Prediction */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Predicted Winner
              </h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {comparison.winner_prediction}
              </div>
              <div className="text-lg text-gray-600">
                {(comparison.win_probability * 100).toFixed(1)}% win probability
              </div>
              
              {/* Win Probability Bar */}
              <div className="mt-4 max-w-md mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${comparison.win_probability * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Matchup Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Team Advantages */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">Team Advantages</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium">Offensive Advantage</span>
                  <span className="font-semibold text-orange-700">
                    {comparison.key_differences.offensive_advantage}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Defensive Advantage</span>
                  <span className="font-semibold text-green-700">
                    {comparison.key_differences.defensive_advantage}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">Experience Edge</span>
                  <span className="font-semibold text-purple-700">
                    {comparison.key_differences.experience_edge}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">Key Differences</h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Efficiency Gap</span>
                    <span className={`font-semibold ${
                      comparison.key_differences.efficiency_gap > 0 
                        ? 'text-green-600' 
                        : comparison.key_differences.efficiency_gap < 0 
                        ? 'text-red-600' 
                        : 'text-gray-600'
                    }`}>
                      {comparison.key_differences.efficiency_gap > 0 ? '+' : ''}
                      {comparison.key_differences.efficiency_gap}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {comparison.team1} vs {comparison.team2}
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pace Difference</span>
                    <span className={`font-semibold ${
                      Math.abs(comparison.key_differences.pace_difference) > 3 
                        ? 'text-blue-600' 
                        : 'text-gray-600'
                    }`}>
                      {comparison.key_differences.pace_difference > 0 ? '+' : ''}
                      {comparison.key_differences.pace_difference}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Possessions per game difference
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Matchup Insights */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Matchup Insights</h4>
            <div className="text-sm text-blue-700 space-y-1">
              {/* Always show at least one insight based on win probability */}
              {comparison.win_probability > 0.7 ? (
                <p>• <strong>{comparison.winner_prediction}</strong> has a strong statistical advantage</p>
              ) : comparison.win_probability < 0.55 ? (
                <p>• Very close matchup - could go either way</p>
              ) : (
                <p>• <strong>{comparison.winner_prediction}</strong> has a slight edge in this matchup</p>
              )}

              {/* Efficiency gap insights */}
              {Math.abs(comparison.key_differences.efficiency_gap) > 8 ? (
                <p>• {Math.abs(comparison.key_differences.efficiency_gap) > 15 ? 'Large' : 'Notable'} efficiency gap favors {comparison.key_differences.efficiency_gap > 0 ? comparison.team1 : comparison.team2}</p>
              ) : (
                <p>• Teams are well-matched in overall efficiency</p>
              )}
              
              {/* Pace difference insights */}
              {Math.abs(comparison.key_differences.pace_difference) > 4 ? (
                <p>• {Math.abs(comparison.key_differences.pace_difference) > 8 ? 'Major' : 'Significant'} pace difference could create style clash</p>
              ) : (
                <p>• Similar playing styles should lead to a balanced game</p>
              )}

              {/* Advantage insights */}
              {comparison.key_differences.offensive_advantage === comparison.key_differences.defensive_advantage ? (
                <p>• <strong>{comparison.key_differences.offensive_advantage}</strong> has advantages on both ends of the court</p>
              ) : (
                <p>• Contrasting strengths: {comparison.key_differences.offensive_advantage} offense vs {comparison.key_differences.defensive_advantage} defense</p>
              )}

              {/* Experience factor */}
              {comparison.key_differences.experience_edge && (
                <p>• Experience could be a factor with <strong>{comparison.key_differences.experience_edge}</strong> having the veteran edge</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}