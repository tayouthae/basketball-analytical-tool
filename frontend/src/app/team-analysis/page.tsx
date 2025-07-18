'use client';

import TeamComparison from '@/components/TeamComparison';
import TournamentSearch from '@/components/TournamentSearch';
import ConferenceAnalysis from '@/components/ConferenceAnalysis';

export default function TeamAnalysisPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Team Analysis
          </h1>
          <p className="text-gray-600">
            Individual team predictions and head-to-head comparisons
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <TournamentSearch />
            <TeamComparison />
          </div>

          <ConferenceAnalysis />
        </div>
      </div>
    </div>
  );
} 