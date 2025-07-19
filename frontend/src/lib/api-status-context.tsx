'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { testConnection } from './api';

type ApiStatus = 'loading' | 'connected' | 'error';

interface ApiStatusContextType {
  apiStatus: ApiStatus;
  loadingPhase: number;
  startTime: number;
  retryConnection: () => void;
}

const ApiStatusContext = createContext<ApiStatusContextType | undefined>(undefined);

export function ApiStatusProvider({ children }: { children: ReactNode }) {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('loading');
  const [loadingPhase, setLoadingPhase] = useState(1);
  const [startTime] = useState(Date.now());

  const checkConnection = async () => {
    try {
      await testConnection();
      setApiStatus('connected');
    } catch {
      setApiStatus('error');
    }
  };

  const retryConnection = async () => {
    setLoadingPhase(1);
    setApiStatus('loading');
    await checkConnection();
  };

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    if (apiStatus !== 'loading') return;

    const phase2Timer = setTimeout(() => setLoadingPhase(2), 5000);
    const phase3Timer = setTimeout(() => setLoadingPhase(3), 15000);
    const phase4Timer = setTimeout(() => setLoadingPhase(4), 30000);

    return () => {
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
      clearTimeout(phase4Timer);
    };
  }, [apiStatus]);

  return (
    <ApiStatusContext.Provider value={{
      apiStatus,
      loadingPhase,
      startTime,
      retryConnection
    }}>
      {children}
    </ApiStatusContext.Provider>
  );
}

export function useApiStatus() {
  const context = useContext(ApiStatusContext);
  if (context === undefined) {
    throw new Error('useApiStatus must be used within an ApiStatusProvider');
  }
  return context;
} 