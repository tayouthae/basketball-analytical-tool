'use client';

import { useState, useEffect } from 'react';
import { testConnection } from '@/lib/api';
import TournamentSearch from '@/components/TournamentSearch';
import CompactTeamComparison from '@/components/CompactTeamComparison';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await testConnection();
        setApiStatus('connected');
      } catch {
        setApiStatus('error');
      }
    };
    checkConnection();
  }, []);

  if (apiStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-600 text-lg">Loading Analytics Platform...</p>
        </div>
      </div>
    );
  }

  if (apiStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Connection Error</h1>
          <p className="text-slate-600 mb-4">Unable to connect to analytics backend</p>
          <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
            Ensure FastAPI server is running on port 8000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Machine Learning Analytics Platform
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Basketball
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Analytics</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Advanced tournament predictions powered by machine learning models and comprehensive statistical analysis
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Tournament Search - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">🎯 Tournament Predictor</h2>
                <p className="text-blue-100">Get instant ML-powered tournament qualification analysis</p>
              </div>
              <div className="p-6">
                <TournamentSearch />
                <CompactTeamComparison />
              </div>
            </div>
          </div>
          
          {/* Side Panel */}
          <div className="space-y-6">
            {/* Technical Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white text-xl">⚙️</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Technical Stack</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="font-semibold text-slate-800 mb-1">Machine Learning Models</div>
                  <div className="text-slate-600 text-sm">3 trained models for comprehensive analysis</div>
                </div>
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                  <div className="font-semibold text-slate-800 mb-1">Data Sources</div>
                  <div className="text-slate-600 text-sm">BartTorvik efficiency metrics & team statistics</div>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="font-semibold text-slate-800 mb-1">Feature Engineering</div>
                  <div className="text-slate-600 text-sm">15+ statistical indicators per team</div>
                </div>
              </div>
            </div>

            {/* Model Performance */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Model Architecture</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-700 font-medium">Tournament Qualification</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Random Forest</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-700 font-medium">Upset Detection</span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">Decision Tree</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-700 font-medium">Deep Run Prediction</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Ensemble</span>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Training Dataset</span>
                    <span className="font-bold text-slate-900">350+ Teams • 2019-2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Tournament Prediction</h3>
              <p className="text-blue-100 leading-relaxed">
                ML algorithms analyze team efficiency, player performance, and historical data to predict tournament qualification probability
              </p>
            </div>
            <div className="p-6">
              <a href="/team-analysis" 
                 className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                Analyze Teams
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
              </a>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-8 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Upset Detection</h3>
              <p className="text-red-100 leading-relaxed">
                Advanced risk assessment identifies high-seeded teams vulnerable to early tournament exits and bracket-busting upsets
              </p>
            </div>
            <div className="p-6">
              <a href="/tournament-analysis" 
                 className="inline-flex items-center justify-center w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                View Alerts
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
              </a>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🏀</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Cinderella Analysis</h3>
              <p className="text-purple-100 leading-relaxed">
                Deep learning models identify lower-seeded teams with championship potential and unexpected deep run capabilities
              </p>
            </div>
                         <div className="p-6">
               <a href="/tournament-analysis?tab=cinderella" 
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                 Find Cinderellas
                 <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
               </a>
             </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Explore Analytics Tools</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <a href="/team-analysis" className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                  <span className="text-blue-600 text-lg">📈</span>
                </div>
                <div className="font-bold text-blue-900">Team Analysis</div>
              </div>
              <div className="text-sm text-blue-700">Individual predictions, head-to-head comparisons, and conference analytics</div>
            </a>
            
                         <a href="/tournament-analysis" className="group p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200 hover:border-red-300 hover:shadow-lg transition-all duration-300">
               <div className="flex items-center mb-3">
                 <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors duration-200">
                   <span className="text-red-600 text-lg">🎭</span>
                 </div>
                 <div className="font-bold text-red-900">Tournament Analysis</div>
               </div>
               <div className="text-sm text-red-700">Upset alerts, Cinderella candidates, and bracket vulnerability assessment</div>
             </a>
            
            <a href="/tournament-archive" className="group p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-slate-200 transition-colors duration-200">
                  <span className="text-slate-600 text-lg">📚</span>
                </div>
                <div className="font-bold text-slate-900">Historical Archive</div>
              </div>
              <div className="text-sm text-slate-700">Multi-year analysis, trends, and model validation across tournament cycles</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}