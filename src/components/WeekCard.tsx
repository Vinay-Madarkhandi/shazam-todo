'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { Week, Day } from '@/types';
import { DayCard } from './DayCard';
import { ChevronDown, ChevronRight, Calendar, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { GlowingEffect } from '@/components/ui/glowing-effect';

interface WeekCardProps {
  week: Week;
  onToggleDayComplete: (dayId: string, isCompleted: boolean) => void;
  onUpdateDayRemarks: (dayId: string, remarks: string) => void;
}

export const WeekCard: React.FC<WeekCardProps> = React.memo(({ 
  week, 
  onToggleDayComplete, 
  onUpdateDayRemarks 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const completedDays = week.days.filter(day => day.isCompleted).length;
  const totalDays = week.days.length;

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
              key={`button-${week.id}-${id}`}
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
              layoutId={`card-${week.id}-${id}`}
              ref={ref}
              className="w-full max-w-3xl h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl"
            >
              <motion.div 
                layoutId={`header-${week.id}-${id}`}
                className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-light text-gray-900 dark:text-white tracking-tight">
                        {week.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light mt-1">{week.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6">
                    <div className="text-left sm:text-right">
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light">
                        {completedDays}/{totalDays} days completed
                      </div>
                      <div className="w-full sm:w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-gray-900 dark:bg-white h-1.5 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${week.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium ${
                      week.isCompleted 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}>
                      {Math.round(week.progress)}%
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
                className="flex-1 overflow-auto p-4 sm:p-6"
              >
                <div className="space-y-4">
                  {week.days.map((day) => (
                    <DayCard
                      key={day.id}
                      day={day}
                      onToggleComplete={onToggleDayComplete}
                      onUpdateRemarks={onUpdateDayRemarks}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <motion.div
        layoutId={`card-${week.id}-${id}`}
        onClick={handleCardClick}
        className="relative bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 hover:shadow-sm transition-all duration-200 cursor-pointer"
      >
        <GlowingEffect
          spread={30}
          glow={true}
          disabled={false}
          proximity={50}
          inactiveZone={0.3}
          borderWidth={1}
        />
        <motion.div 
          layoutId={`header-${week.id}-${id}`}
          className="relative p-4 sm:p-6 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex-shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-light text-gray-900 dark:text-white tracking-tight">
                  {week.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light mt-1">{week.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6">
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light">
                  {completedDays}/{totalDays} days completed
                </div>
                <div className="w-full sm:w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-1 mt-2">
                  <div 
                    className="bg-gray-900 dark:bg-white h-1 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${week.progress}%` }}
                  />
                </div>
              </div>
              <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium ${
                week.isCompleted 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}>
                {Math.round(week.progress)}%
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
});
