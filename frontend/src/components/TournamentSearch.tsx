/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { TournamentPrediction } from '@/types/basketball';
import TeamSelector from './TeamSelector';

export default function TournamentSearch() {
  const [teamName, setTeamName] = useState('');
  const [year, setYear] = useState(2024);
  const [prediction, setPrediction] = useState<TournamentPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchTeam = async () => {
    if (!teamName.trim()) {
      setError('Please enter a team name');
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await api.get(`/api/tournament/predict/${teamName}?year=${year}`);
      setPrediction(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(`Team "${teamName}" not found for year ${year}`);
      } else {
        setError('Error fetching prediction. Please try again.');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🎯 Tournament Prediction
      </h2>

      {/* Search Form */}
      <div className="space-y-4 mb-6">
        <TeamSelector
          value={teamName}
          onChange={setTeamName}
          placeholder="Search and select team..."
          label="Team Name"
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
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
            <option value={2021}>2021</option>
            <option value={2019}>2019</option>
          </select>
        </div>

        <button
          onClick={searchTeam}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Searching...' : 'Get Tournament Prediction'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Prediction Results */}
      {prediction && (
        <div className="border-t pt-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {prediction.team} ({prediction.year})
            </h3>

            {/* Tournament Probability */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Tournament Probability</span>
                <span className="text-lg font-bold text-blue-600">
                  {(prediction.tournament_probability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${prediction.tournament_probability * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {prediction.efficiency_score}
                </div>
                <div className="text-sm text-gray-600">Net Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {prediction.current_record}
                </div>
                <div className="text-sm text-gray-600">Record</div>
              </div>
            </div>

            {/* Confidence & Factors */}
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Confidence: </span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  prediction.prediction_confidence === 'High' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {prediction.prediction_confidence}
                </span>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Key Factors:</div>
                <div className="flex flex-wrap gap-2">
                  {prediction.key_factors.map((factor, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}