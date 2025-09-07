'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface PerformanceContextType {
  reducedMotion: boolean;
  lowPerformanceMode: boolean;
  setLowPerformanceMode: (enabled: boolean) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowPerformanceMode, setLowPerformanceMode] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Auto-detect low performance devices
    const isLowPerformance = (): boolean => {
      // Check for low-end device indicators
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
      const cores = navigator.hardwareConcurrency;
      
      const isLowMemory = memory && memory < 4;
      const isSlowConnection = connection && connection.effectiveType && ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
      const isLowCores = cores && cores < 4;
      
      return Boolean(isLowMemory || isSlowConnection || isLowCores);
    };

    setLowPerformanceMode(isLowPerformance());
  }, []);

  const value: PerformanceContextType = {
    reducedMotion,
    lowPerformanceMode,
    setLowPerformanceMode,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};
