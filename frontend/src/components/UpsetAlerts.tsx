/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { UpsetAlert, CinderellaCandidate } from '@/types/basketball';
import Link from 'next/link';

export default function UpsetAlerts() {
  const searchParams = useSearchParams();
  const [upsetAlerts, setUpsetAlerts] = useState<UpsetAlert[]>([]);
  const [cinderellas, setCinderellas] = useState<CinderellaCandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [year, setYear] = useState(2024);
  
  // Check URL params to determine initial tab
  const initialTab = searchParams.get('tab') === 'cinderella' ? 'cinderella' : 'upsets';
  const [activeTab, setActiveTab] = useState<'upsets' | 'cinderella'>(initialTab);

  const fetchUpsetData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const [upsetResponse, cinderellaResponse] = await Promise.all([
        api.get(`/api/upsets/alerts?year=${year}`),
        api.get(`/api/upsets/cinderella?year=${year}`)
      ]);
      
      setUpsetAlerts(upsetResponse.data);
      setCinderellas(cinderellaResponse.data);
    } catch (err: unknown) {
      setError('Error fetching upset data. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchUpsetData();
  }, [year, fetchUpsetData]);

  // Update active tab when URL params change
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'cinderella') {
      setActiveTab('cinderella');
    } else if (tabParam === 'upsets') {
      setActiveTab('upsets');
    }
  }, [searchParams]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPotentialColor = (potentialLevel: string) => {
    switch (potentialLevel) {
      case 'High': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          ⚡ March Madness Alerts
        </h2>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Year:</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
            <option value={2021}>2021</option>
            <option value={2019}>2019</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('upsets')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'upsets'
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🚨 Upset Alerts ({upsetAlerts.length})
        </button>
        <button
          onClick={() => setActiveTab('cinderella')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'cinderella'
              ? 'bg-purple-100 text-purple-700 border border-purple-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏀 Cinderella Candidates ({cinderellas.length})
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading upset data...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Upset Alerts Tab */}
      {!loading && !error && activeTab === 'upsets' && (
        <div>
          <p className="text-gray-600 mb-4">
            High-seeded teams with elevated risk of early tournament exit
          </p>
          
          {upsetAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No upset alerts found for {year}
            </div>
          ) : (
            <div className="space-y-4">
              {upsetAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Link 
                          href={`/team-profile?team=${encodeURIComponent(alert.team)}&year=${year}`}
                          className="font-semibold text-lg text-gray-800 hover:text-blue-600 transition-colors"
                        >
                          {alert.team}
                        </Link>
                        {alert.seed && (
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            #{alert.seed} seed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Efficiency: {alert.efficiency}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(alert.risk_level)}`}>
                        {alert.risk_level} Risk
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {(alert.upset_risk * 100).toFixed(1)}% upset probability
                      </div>
                    </div>
                  </div>

                  {/* Risk Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${alert.upset_risk * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Risk Reasons */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700 mb-2">Risk Factors:</div>
                      <div className="flex flex-wrap gap-2">
                        {alert.reasons.map((reason, idx) => (
                          <span
                            key={idx}
                            className="bg-red-50 text-red-700 px-2 py-1 rounded text-sm border border-red-200"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link 
                      href={`/team-profile?team=${encodeURIComponent(alert.team)}&year=${year}`}
                      className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cinderella Candidates Tab */}
      {!loading && !error && activeTab === 'cinderella' && (
        <div>
          <p className="text-gray-600 mb-4">
            Lower-seeded teams with potential for deep tournament runs
          </p>
          
          {cinderellas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No Cinderella candidates found for {year}
            </div>
          ) : (
            <div className="space-y-4">
              {cinderellas.map((candidate, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Link 
                          href={`/team-profile?team=${encodeURIComponent(candidate.team)}&year=${year}`}
                          className="font-semibold text-lg text-gray-800 hover:text-blue-600 transition-colors"
                        >
                          {candidate.team}
                        </Link>
                        {candidate.seed && (
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            #{candidate.seed} seed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Efficiency: {candidate.efficiency}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getPotentialColor(candidate.potential_level)}`}>
                        {candidate.potential_level} Potential
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {(candidate.deep_run_probability * 100).toFixed(1)}% deep run chance
                      </div>
                    </div>
                  </div>

                  {/* Potential Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${candidate.deep_run_probability * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700 mb-2">Key Strengths:</div>
                      <div className="flex flex-wrap gap-2">
                        {candidate.strengths.map((strength, idx) => (
                          <span
                            key={idx}
                            className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-sm border border-purple-200"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link 
                      href={`/team-profile?team=${encodeURIComponent(candidate.team)}&year=${year}`}
                      className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}