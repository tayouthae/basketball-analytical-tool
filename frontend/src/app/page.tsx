'use client';

import { useState, useEffect } from 'react';
import { testConnection } from '@/lib/api';
import TournamentSearch from '@/components/TournamentSearch';
import BubbleTeams from '@/components/BubbleTeams';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await testConnection();
        setApiStatus('connected');
      } catch (error) {
        setApiStatus('error');
      }
    };
    checkConnection();
  }, []);

  if (apiStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Connecting to API...</p>
        </div>
      </div>
    );
  }

  if (apiStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Connection Error</h1>
          <p className="text-gray-600">Make sure your FastAPI backend is running on http://localhost:8000</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🏀 Basketball Analytics Dashboard
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <TournamentSearch />
          <BubbleTeams />
        </div>
      </div>
    </main>
  );
}