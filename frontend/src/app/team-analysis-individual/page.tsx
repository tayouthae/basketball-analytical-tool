'use client';

import { useState } from 'react';
import TeamSelector from '@/components/TeamSelector';
import TeamProfileComponent from '@/components/TeamProfile';

export default function IndividualTeamAnalysisPage() {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [year, setYear] = useState(2025);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Individual Team Analysis
          </h1>
          <p className="text-gray-600">
            Select a team to view comprehensive analytics and insights
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Select Team for Analysis
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <TeamSelector
              value={selectedTeam}
              onChange={setSelectedTeam}
              placeholder="Search and select a team..."
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
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
                <option value={2021}>2021</option>
                <option value={2019}>2019</option>
              </select>
            </div>
          </div>
        </div>

        {selectedTeam && (
          <TeamProfileComponent teamName={selectedTeam} year={year} />
        )}

        {!selectedTeam && (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-gray-400">🏀</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Select a Team to Begin Analysis
            </h3>
            <p className="text-gray-500">
              Choose a team from the dropdown above to view detailed analytics, efficiency metrics, and tournament insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 