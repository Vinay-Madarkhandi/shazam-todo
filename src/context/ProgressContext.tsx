'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Phase, Day, Week, ProgressData } from '@/types';
import { curriculumData } from '@/data/curriculum';

interface ProgressContextType {
  progressData: ProgressData;
  updateDayCompletion: (dayId: string, isCompleted: boolean) => void;
  updateDayRemarks: (dayId: string, remarks: string) => void;
  getDayById: (dayId: string) => Day | null;
  getPhaseById: (phaseId: string) => Phase | null;
  getWeekById: (weekId: string) => Week | null;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phases, setPhases] = useState<Phase[]>(curriculumData);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('shazam-progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setPhases(parsed);
      } catch (error) {
        console.error('Error loading progress from localStorage:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever phases change
  useEffect(() => {
    localStorage.setItem('shazam-progress', JSON.stringify(phases));
  }, [phases]);

  const calculateProgress = (phases: Phase[]): ProgressData => {
    let totalDays = 0;
    let completedDays = 0;

    const updatedPhases = phases.map(phase => {
      let phaseCompletedDays = 0;
      let phaseTotalDays = 0;

      const updatedWeeks = phase.weeks.map(week => {
        let weekCompletedDays = 0;
        const weekTotalDays = week.days.length;
        phaseTotalDays += weekTotalDays;

        const updatedDays = week.days.map(day => {
          if (day.isCompleted) {
            weekCompletedDays++;
            phaseCompletedDays++;
            completedDays++;
          }
          totalDays++;
          return day;
        });

        const weekProgress = weekTotalDays > 0 ? (weekCompletedDays / weekTotalDays) * 100 : 0;
        const isWeekCompleted = weekCompletedDays === weekTotalDays;

        return {
          ...week,
          days: updatedDays,
          progress: weekProgress,
          isCompleted: isWeekCompleted,
        };
      });

      phaseTotalDays = phase.weeks.reduce((sum, week) => sum + week.days.length, 0);
      const phaseProgress = phaseTotalDays > 0 ? (phaseCompletedDays / phaseTotalDays) * 100 : 0;
      const isPhaseCompleted = phaseCompletedDays === phaseTotalDays;

      return {
        ...phase,
        weeks: updatedWeeks,
        progress: phaseProgress,
        isCompleted: isPhaseCompleted,
      };
    });

    const overallProgress = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

    return {
      phases: updatedPhases,
      totalDays,
      completedDays,
      overallProgress,
    };
  };

  const progressData = calculateProgress(phases);

  const updateDayCompletion = (dayId: string, isCompleted: boolean) => {
    setPhases(prevPhases => 
      prevPhases.map(phase => ({
        ...phase,
        weeks: phase.weeks.map(week => ({
          ...week,
          days: week.days.map(day => 
            day.id === dayId 
              ? { 
                  ...day, 
                  isCompleted, 
                  completedAt: isCompleted ? new Date() : undefined 
                }
              : day
          ),
        })),
      }))
    );
  };

  const updateDayRemarks = (dayId: string, remarks: string) => {
    setPhases(prevPhases => 
      prevPhases.map(phase => ({
        ...phase,
        weeks: phase.weeks.map(week => ({
          ...week,
          days: week.days.map(day => 
            day.id === dayId 
              ? { ...day, remarks }
              : day
          ),
        })),
      }))
    );
  };

  const getDayById = (dayId: string): Day | null => {
    for (const phase of phases) {
      for (const week of phase.weeks) {
        const day = week.days.find(d => d.id === dayId);
        if (day) return day;
      }
    }
    return null;
  };

  const getPhaseById = (phaseId: string): Phase | null => {
    return phases.find(phase => phase.id === phaseId) || null;
  };

  const getWeekById = (weekId: string) => {
    for (const phase of phases) {
      const week = phase.weeks.find(w => w.id === weekId);
      if (week) return week;
    }
    return null;
  };

  const value: ProgressContextType = {
    progressData,
    updateDayCompletion,
    updateDayRemarks,
    getDayById,
    getPhaseById,
    getWeekById,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
