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
    const isLowPerformance = () => {
      // Check for low-end device indicators
      const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
      const isSlowConnection = (navigator as any).connection && (navigator as any).connection.effectiveType === 'slow-2g';
      const isLowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      
      return isLowMemory || isSlowConnection || isLowCores;
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
