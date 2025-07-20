'use client';

import { useState } from 'react';
import BubbleTeams from '@/components/BubbleTeams';

export default function TournamentArchivePage() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tournament Archive
          </h1>
          <p className="text-gray-600">
            Historical tournament data from 2019-2025
          </p>
        </div>

        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Year</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`text-center p-3 rounded-lg border transition-all w-full ${
                    selectedYear === year 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{year}</div>
                  {year === 2020 && (
                    <div className="text-xs text-red-600 mt-1">Cancelled</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedYear} Bubble Teams
          </h2>
          <BubbleTeams year={selectedYear} showYearSelector={false} />
        </div>
      </div>
    </div>
  );
} 