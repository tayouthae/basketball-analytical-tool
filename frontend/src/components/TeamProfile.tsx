'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { TeamProfile } from '@/types/basketball';

interface TeamProfileProps {
  teamName: string;
  year?: number;
}

export default function TeamProfileComponent({ teamName, year = 2024 }: TeamProfileProps) {
  const [profile, setProfile] = useState<TeamProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTeamProfile = useCallback(async () => {
    if (!teamName.trim()) return;
    
    setLoading(true);
    setError('');
    setProfile(null);
    
    try {
      const response = await api.get<TeamProfile>(`/api/analytics/team-profile/${teamName}?year=${year}`);
      setProfile(response.data);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const errorWithResponse = err as { response?: { status?: number } };
        if (errorWithResponse.response?.status === 404) {
          setError(`Team "${teamName}" not found for year ${year}`);
        } else {
          setError('Error fetching team profile. Please try again.');
        }
      } else {
        setError('Error fetching team profile. Please try again.');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [teamName, year]);

  useEffect(() => {
    fetchTeamProfile();
  }, [teamName, year, fetchTeamProfile]);

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return 'text-green-600 bg-green-50';
    if (percentile >= 75) return 'text-blue-600 bg-blue-50';
    if (percentile >= 50) return 'text-yellow-600 bg-yellow-50';
    if (percentile >= 25) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getPercentileDescription = (percentile: number) => {
    if (percentile >= 90) return 'Elite';
    if (percentile >= 75) return 'Very Good';
    if (percentile >= 50) return 'Above Average';
    if (percentile >= 25) return 'Below Average';
    return 'Poor';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return 'text-green-600';
    if (probability >= 0.6) return 'text-blue-600';
    if (probability >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading team profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {profile.team}
            </h1>
            <div className="flex items-center space-x-4 text-blue-100">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-300 rounded-full mr-2"></span>
                {profile.conference}
              </span>
              <span>•</span>
              <span>{profile.year} Season</span>
              <span>•</span>
              <span className="font-semibold bg-blue-500 px-3 py-1 rounded-full">
                {profile.record}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-2">🏀</div>
            <div className="text-sm text-blue-200">Team Profile</div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                📊
              </span>
              Efficiency Metrics
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm">
                <span className="text-gray-700 font-medium">Net Efficiency</span>
                <span className={`font-bold text-lg px-3 py-1 rounded-full ${
                  profile.efficiency_metrics.net_efficiency > 0 
                    ? 'text-green-700 bg-green-100' 
                    : 'text-red-700 bg-red-100'
                }`}>
                  {profile.efficiency_metrics.net_efficiency > 0 ? '+' : ''}
                  {profile.efficiency_metrics.net_efficiency.toFixed(1)}
                </span>
              </div>
              <div className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm">
                <span className="text-gray-700 font-medium">Offensive Efficiency</span>
                <span className="font-semibold text-blue-600">{profile.efficiency_metrics.offensive_efficiency.toFixed(1)}</span>
              </div>
              <div className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm">
                <span className="text-gray-700 font-medium">Defensive Efficiency</span>
                <span className="font-semibold text-green-600">{profile.efficiency_metrics.defensive_efficiency.toFixed(1)}</span>
              </div>
              <div className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm">
                <span className="text-gray-700 font-medium">Pace</span>
                <span className="font-semibold text-purple-600">{profile.efficiency_metrics.pace.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                📈
              </span>
              National Percentiles
            </h3>
            <div className="space-y-4">
              {Object.entries(profile.percentiles).map(([stat, percentile]) => (
                <div key={stat} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium capitalize">
                      {stat.replace(/_/g, ' ')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPercentileColor(percentile)}`}>
                        {percentile.toFixed(0)}th
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        ({getPercentileDescription(percentile)})
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${
                        percentile >= 90 ? 'bg-green-500' :
                        percentile >= 75 ? 'bg-blue-500' :
                        percentile >= 50 ? 'bg-yellow-500' :
                        percentile >= 25 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentile}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                🎯
              </span>
              Tournament Outlook
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700 font-medium">Tournament Probability</span>
                  <span className={`text-2xl font-bold px-4 py-2 rounded-full ${
                    profile.tournament_outlook.probability >= 0.8 ? 'text-green-700 bg-green-100' :
                    profile.tournament_outlook.probability >= 0.6 ? 'text-blue-700 bg-blue-100' :
                    profile.tournament_outlook.probability >= 0.4 ? 'text-yellow-700 bg-yellow-100' :
                    'text-red-700 bg-red-100'
                  }`}>
                    {(profile.tournament_outlook.probability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ${
                      profile.tournament_outlook.probability >= 0.8 ? 'bg-green-500' :
                      profile.tournament_outlook.probability >= 0.6 ? 'bg-blue-500' :
                      profile.tournament_outlook.probability >= 0.4 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${profile.tournament_outlook.probability * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Readiness Score</span>
                  <span className={`text-lg font-bold px-3 py-1 rounded-full ${
                    profile.tournament_outlook.readiness_score >= 0.8 ? 'text-green-700 bg-green-100' :
                    profile.tournament_outlook.readiness_score >= 0.6 ? 'text-blue-700 bg-blue-100' :
                    profile.tournament_outlook.readiness_score >= 0.4 ? 'text-yellow-700 bg-yellow-100' :
                    'text-red-700 bg-red-100'
                  }`}>
                    {(profile.tournament_outlook.readiness_score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                💪
              </span>
              Key Strengths
            </h3>
            {profile.strengths.length > 0 ? (
              <div className="space-y-3">
                {profile.strengths.map((strength, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm flex items-center space-x-3">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </span>
                    <span className="text-gray-700 font-medium">{strength}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 shadow-sm text-gray-500 italic text-center">
                No specific strengths identified
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                ⚠️
              </span>
              Areas for Improvement
            </h3>
            {profile.weaknesses.length > 0 ? (
              <div className="space-y-3">
                {profile.weaknesses.map((weakness, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm flex items-center space-x-3">
                    <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-sm">⚠</span>
                    </span>
                    <span className="text-gray-700 font-medium">{weakness}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 shadow-sm text-gray-500 italic text-center">
                No significant weaknesses identified
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
} 