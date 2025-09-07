'use client';

import { ProgressProvider, useProgress } from '@/context/ProgressContext';
import { PerformanceProvider } from '@/context/PerformanceContext';
import { DarkModeProvider } from '@/context/DarkModeContext';
import { ProgressOverview } from '@/components/ProgressOverview';
import { PhaseCard } from '@/components/PhaseCard';

function MainContent() {
  const { progressData, updateDayCompletion, updateDayRemarks } = useProgress();

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-6xl">
        <ProgressOverview progressData={progressData} />
        
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {progressData.phases.map((phase) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              onToggleDayComplete={updateDayCompletion}
              onUpdateDayRemarks={updateDayRemarks}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <DarkModeProvider>
      <PerformanceProvider>
        <ProgressProvider>
          <MainContent />
        </ProgressProvider>
      </PerformanceProvider>
    </DarkModeProvider>
  );
}