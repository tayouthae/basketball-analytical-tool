'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { TopTeamsResponse, TopTeam } from '@/types/basketball';
import Link from 'next/link';

interface TopTeamsProps {
  year?: number;
  limit?: number;
  showYearSelector?: boolean;
}

export default function TopTeams({ year: propYear, limit = 25, showYearSelector = true }: TopTeamsProps) {
  const [topTeams, setTopTeams] = useState<TopTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [internalYear, setInternalYear] = useState(2025);
  
  const year = propYear || internalYear;

  const fetchTopTeams = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get<TopTeamsResponse>(`/api/tournament/top-teams?year=${year}&limit=${limit}`);
      setTopTeams(response.data.top_teams);
    } catch (err: unknown) {
      setError('Error fetching top teams. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [year, limit]);

  useEffect(() => {
    fetchTopTeams();
  }, [year, limit, fetchTopTeams]);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 20) return 'text-green-600 bg-green-50';
    if (efficiency >= 10) return 'text-blue-600 bg-blue-50';
    if (efficiency >= 0) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 0.8) return 'text-green-600';
    if (readiness >= 0.6) return 'text-blue-600';
    if (readiness >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          🏆 Top Tournament Candidates
        </h2>
        
        {showYearSelector && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Year:</label>
            <select
              value={year}
              onChange={(e) => setInternalYear(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
                          <option value={2025}>2025</option>
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
            <option value={2021}>2021</option>
            <option value={2019}>2019</option>
            </select>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading top teams...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && topTeams.length > 0 && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {topTeams.map((team, index) => (
              <div key={team.team} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    
                    <div>
                      <Link 
                        href={`/team-profile?team=${encodeURIComponent(team.team)}&year=${year}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {team.team}
                      </Link>
                      <div className="text-sm text-gray-500">
                        {team.conference} • {team.record} ({team.wins}W)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className={`text-sm font-semibold px-2 py-1 rounded ${getEfficiencyColor(team.efficiency)}`}>
                        {team.efficiency > 0 ? '+' : ''}{team.efficiency.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Efficiency</div>
                    </div>

                    <div className="text-center">
                      <div className={`text-sm font-semibold ${getReadinessColor(team.tournament_readiness)}`}>
                        {(team.tournament_readiness * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Readiness</div>
                    </div>

                    <Link 
                      href={`/team-profile?team=${encodeURIComponent(team.team)}&year=${year}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {topTeams.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No teams found for {year}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 