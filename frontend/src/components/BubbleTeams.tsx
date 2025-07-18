/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { BubbleTeam } from '@/types/basketball';
import EfficiencyChart from './charts/EfficiencyChart';

interface BubbleTeamsProps {
  year?: number;
  showYearSelector?: boolean;
}

export default function BubbleTeams({ year: propYear, showYearSelector = true }: BubbleTeamsProps) {
  const [bubbleTeams, setBubbleTeams] = useState<BubbleTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [internalYear, setInternalYear] = useState(2024);
  
  const year = propYear || internalYear;

  const fetchBubbleTeams = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get(`/api/tournament/bubble-teams?year=${year}`);
      setBubbleTeams(response.data);
    } catch (err: unknown) {
      setError('Error fetching bubble teams. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchBubbleTeams();
  }, [year, fetchBubbleTeams]);

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.6) return 'text-green-600 bg-green-50';
    if (probability >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getProbabilityBarColor = (probability: number) => {
    if (probability >= 0.6) return 'bg-green-500';
    if (probability >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          🎭 Tournament Bubble Teams
        </h2>
        
        {showYearSelector && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Year:</label>
            <select
              value={year}
              onChange={(e) => setInternalYear(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
              <option value={2021}>2021</option>
              <option value={2019}>2019</option>
            </select>
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4">
        Teams with tournament probability between 30-70% (the &quot;bubble&quot;)
      </p>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading bubble teams...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && bubbleTeams.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No bubble teams found for {year}
        </div>
      )}

      {!loading && !error && bubbleTeams.length > 0 && (
        <div className="space-y-6">
          <EfficiencyChart data={bubbleTeams} />
          
          <div className="space-y-3">
            {bubbleTeams.map((team, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {team.team}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {team.conference} • {team.record} ({team.wins} wins)
                  </p>
                </div>
                
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getProbabilityColor(team.tournament_probability)}`}>
                    {(team.tournament_probability * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Tournament Chance
                  </div>
                </div>
              </div>

              {/* Probability Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Tournament Probability</span>
                  <span>Efficiency: {team.efficiency}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProbabilityBarColor(team.tournament_probability)}`}
                    style={{ width: `${team.tournament_probability * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold text-gray-800">{team.efficiency}</div>
                  <div className="text-gray-500">Net Efficiency</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{team.wins}</div>
                  <div className="text-gray-500">Wins</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{team.conference}</div>
                  <div className="text-gray-500">Conference</div>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Probability Legend:</h4>
        <div className="flex space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span>60%+ (Likely In)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span>40-60% (True Bubble)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span>30-40% (Need Help)</span>
          </div>
        </div>
      </div>
    </div>
  );
}