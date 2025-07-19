'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import TeamProfileComponent from '@/components/TeamProfile';
import Link from 'next/link';

function TeamProfileContent() {
  const searchParams = useSearchParams();
  const teamName = searchParams.get('team');
  const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : 2025;

  // Scroll to top when component mounts or team changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [teamName, year]);

  if (!teamName) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Team Not Found</h1>
          <p className="text-gray-600 mb-6">No team specified in the URL parameters.</p>
          <Link 
            href="/team-analysis"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Team Analysis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <Link 
          href="/team-analysis"
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Team Analysis
        </Link>
      </div>
      
      <TeamProfileComponent teamName={teamName} year={year} />
      
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link 
            href={`/team-analysis?team1=${encodeURIComponent(teamName)}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Compare with Another Team
          </Link>
          <Link 
            href={`/?team=${encodeURIComponent(teamName)}`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Get Tournament Prediction
          </Link>
          <Link 
            href="/march-madness"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            View March Madness Analysis
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TeamProfilePage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <TeamProfileContent />
    </Suspense>
  );
} 