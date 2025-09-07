'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { Phase } from '@/types';
import { WeekCard } from './WeekCard';
import { Target, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { GlowingEffect } from '@/components/ui/glowing-effect';

interface PhaseCardProps {
  phase: Phase;
  onToggleDayComplete: (dayId: string, isCompleted: boolean) => void;
  onUpdateDayRemarks: (dayId: string, remarks: string) => void;
}

export const PhaseCard: React.FC<PhaseCardProps> = React.memo(({ 
  phase, 
  onToggleDayComplete, 
  onUpdateDayRemarks 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const completedWeeks = phase.weeks.filter(week => week.isCompleted).length;
  const totalWeeks = phase.weeks.length;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    }

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen]);

  useOutsideClick(ref, () => setIsModalOpen(false));

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isModalOpen ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${phase.id}-${id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex absolute top-4 right-4 lg:hidden items-center justify-center bg-white rounded-full h-8 w-8 shadow-sm"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-4 h-4 text-gray-600" />
            </motion.button>
            <motion.div
              layoutId={`card-${phase.id}-${id}`}
              ref={ref}
              className="w-full max-w-4xl h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl"
            >
              <motion.div 
                layoutId={`header-${phase.id}-${id}`}
                className="p-4 sm:p-6 lg:p-8 border-b border-gray-100 dark:border-gray-700"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4 sm:space-x-6">
                    <div className="flex-shrink-0">
                      <Target className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-900 dark:text-white tracking-tight">
                          Phase {phase.phaseNumber}: {phase.title}
                        </h1>
                        {phase.isCompleted && (
                          <div className="px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full self-start">
                            COMPLETED
                          </div>
                        )}
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-lg font-light mb-3">{phase.description}</p>
                      <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                        <p className="text-xs sm:text-sm font-light">{phase.goal}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-left lg:text-right flex-shrink-0 lg:ml-4">
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 font-light">
                      {completedWeeks}/{totalWeeks} weeks completed
                    </div>
                    <div className="w-full sm:w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2 sm:mb-3">
                      <div 
                        className="bg-gray-900 dark:bg-white h-2 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                    <div className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium inline-block ${
                      phase.isCompleted 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {Math.round(phase.progress)}%
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
                className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8"
              >
                <div className="space-y-6">
                  {phase.weeks.map((week) => (
                    <WeekCard
                      key={week.id}
                      week={week}
                      onToggleDayComplete={onToggleDayComplete}
                      onUpdateDayRemarks={onUpdateDayRemarks}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <motion.div
        layoutId={`card-${phase.id}-${id}`}
        onClick={handleCardClick}
        className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      >
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={60}
          inactiveZone={0.2}
          borderWidth={1}
        />
        <motion.div 
          layoutId={`header-${phase.id}-${id}`}
          className="relative p-4 sm:p-6 lg:p-8 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-start space-x-4 sm:space-x-6">
              <div className="flex-shrink-0">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-light text-gray-900 dark:text-white tracking-tight">
                    Phase {phase.phaseNumber}: {phase.title}
                  </h1>
                  {phase.isCompleted && (
                    <div className="px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full self-start">
                      COMPLETED
                    </div>
                  )}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-lg font-light mb-3">{phase.description}</p>
                <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                  <p className="text-xs sm:text-sm font-light">{phase.goal}</p>
                </div>
              </div>
            </div>
            <div className="text-left lg:text-right flex-shrink-0 lg:ml-4">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 font-light">
                {completedWeeks}/{totalWeeks} weeks completed
              </div>
              <div className="w-full sm:w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-2 sm:mb-3">
                <div 
                  className="bg-gray-900 dark:bg-white h-1.5 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${phase.progress}%` }}
                />
              </div>
              <div className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium inline-block ${
                phase.isCompleted 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}>
                {Math.round(phase.progress)}%
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
});

PhaseCard.displayName = 'PhaseCard';
