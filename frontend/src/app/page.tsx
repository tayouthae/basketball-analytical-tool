'use client';

import { useState, useEffect } from 'react';
import { testConnection } from '@/lib/api';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testConnection();
        console.log('API Response:', result);
        setApiStatus('connected');
      } catch (error) {
        console.error('Connection error:', error);
        setApiStatus('error');
        setErrorMessage('Could not connect to FastAPI backend. Make sure it\'s running on http://localhost:8000');
      }
    };

    checkConnection();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🏀 Basketball Analytics Dashboard
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">API Connection Status</h2>
          
          <div className="flex items-center space-x-3">
            {apiStatus === 'loading' && (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>Testing connection...</span>
              </>
            )}
            
            {apiStatus === 'connected' && (
              <>
                <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-green-600 font-semibold">Connected to FastAPI Backend!</span>
              </>
            )}
            
            {apiStatus === 'error' && (
              <>
                <div className="h-6 w-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✗</span>
                </div>
                <div>
                  <span className="text-red-600 font-semibold">Connection Failed</span>
                  <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {apiStatus === 'connected' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Tournament Predictions</h3>
              <p className="text-gray-600">Predict which teams will make March Madness</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Upset Alerts</h3>
              <p className="text-gray-600">Identify potential bracket busters</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Team Analytics</h3>
              <p className="text-gray-600">Deep dive into team performance</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}