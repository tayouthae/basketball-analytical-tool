'use client';

import { Suspense } from 'react';
import UpsetAlerts from '@/components/UpsetAlerts';
import BubbleTeams from '@/components/BubbleTeams';

function UpsetAlertsWrapper() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <UpsetAlerts />
    </Suspense>
  );
}

export default function MarchMadnessPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            March Madness
          </h1>
          <p className="text-gray-600">
            Upset predictions and Cinderella candidate identification
          </p>
        </div>

        <div className="space-y-8">
          <UpsetAlertsWrapper />
          <BubbleTeams />
        </div>
      </div>
    </div>
  );
} 