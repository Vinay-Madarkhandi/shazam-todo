'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { Day } from '@/types';
import { CheckCircle, Circle, Edit3, Save, X, BookOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { GlowingEffect } from '@/components/ui/glowing-effect';

interface DayCardProps {
  day: Day;
  onToggleComplete: (dayId: string, isCompleted: boolean) => void;
  onUpdateRemarks: (dayId: string, remarks: string) => void;
}

export const DayCard: React.FC<DayCardProps> = React.memo(({ day, onToggleComplete, onUpdateRemarks }) => {
  const [isEditingRemarks, setIsEditingRemarks] = useState(false);
  const [remarks, setRemarks] = useState(day.remarks || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

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

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(day.id, !day.isCompleted);
  };

  const handleSaveRemarks = () => {
    onUpdateRemarks(day.id, remarks);
    setIsEditingRemarks(false);
  };

  const handleCancelEdit = () => {
    setRemarks(day.remarks || '');
    setIsEditingRemarks(false);
  };

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
              key={`button-${day.id}-${id}`}
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
              layoutId={`card-${day.id}-${id}`}
              ref={ref}
              className="w-full max-w-2xl h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl"
            >
              <motion.div 
                layoutId={`header-${day.id}-${id}`}
                className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={handleToggleComplete}
                      className="transition-all duration-200 hover:scale-105 mt-1"
                    >
                      {day.isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300 hover:text-gray-500" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-light text-xl sm:text-2xl tracking-tight ${
                        day.isCompleted ? 'text-green-700 dark:text-green-400 line-through' : 'text-gray-900 dark:text-white'
                      }`}>
                        Day {day.dayNumber}: {day.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-lg font-light mt-2">{day.description}</p>
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
                <div className="space-y-6">
                  {(day.mathContent || day.codeContent) && (
                    <div className="space-y-4">
                      {day.mathContent && (
                        <div className="bg-gray-50 dark:bg-gray-700 border-l-4 border-gray-300 dark:border-gray-500 p-4 sm:p-6 rounded-r-lg">
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 text-base sm:text-lg mb-3 flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Math Content</span>
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-light leading-relaxed">{day.mathContent}</p>
                        </div>
                      )}
                      {day.codeContent && (
                        <div className="bg-gray-50 dark:bg-gray-700 border-l-4 border-gray-300 dark:border-gray-500 p-4 sm:p-6 rounded-r-lg">
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 text-base sm:text-lg mb-3 flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Code Content</span>
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-light leading-relaxed">{day.codeContent}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t border-gray-100 dark:border-gray-600 pt-4 sm:pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-light">
                        {day.isCompleted && day.completedAt && (
                          `Completed on ${new Date(day.completedAt).toLocaleDateString()}`
                        )}
                      </span>
                      <button
                        onClick={() => setIsEditingRemarks(true)}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2"
                      >
                        <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    {isEditingRemarks ? (
                      <div className="space-y-4">
                        <textarea
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Add your remarks, notes, or progress..."
                          className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-sm resize-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 focus:border-transparent font-light bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          rows={4}
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={handleSaveRemarks}
                            className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      day.remarks && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Remarks:</span> {day.remarks}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <motion.div
        layoutId={`card-${day.id}-${id}`}
        onClick={handleCardClick}
        className={`relative bg-white dark:bg-gray-800 rounded-xl border p-4 sm:p-5 transition-all duration-200 hover:shadow-sm cursor-pointer ${
          day.isCompleted 
            ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/20' 
            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
        }`}
      >
        <GlowingEffect
          spread={20}
          glow={true}
          disabled={false}
          proximity={40}
          inactiveZone={0.4}
          borderWidth={1}
        />
        <motion.div 
          layoutId={`header-${day.id}-${id}`}
          className="relative flex items-start justify-between mb-4"
        >
          <div className="flex items-start space-x-4">
            <button
              onClick={handleToggleComplete}
              className="transition-all duration-200 hover:scale-105 mt-1"
            >
              {day.isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 hover:text-gray-500" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h3 className={`font-light text-base sm:text-lg tracking-tight ${
                day.isCompleted ? 'text-green-700 dark:text-green-400 line-through' : 'text-gray-900 dark:text-white'
              }`}>
                Day {day.dayNumber}: {day.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-light mt-1">{day.description}</p>
            </div>
          </div>
        </motion.div>

        {(day.mathContent || day.codeContent) && (
          <div className="mb-4 space-y-3">
            {day.mathContent && (
              <div className="bg-gray-50 dark:bg-gray-700 border-l-2 border-gray-300 dark:border-gray-500 p-3 sm:p-4 rounded-r-lg">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-2">Math Content</h4>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-light leading-relaxed">{day.mathContent}</p>
              </div>
            )}
            {day.codeContent && (
              <div className="bg-gray-50 dark:bg-gray-700 border-l-2 border-gray-300 dark:border-gray-500 p-3 sm:p-4 rounded-r-lg">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-2">Code Content</h4>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-light leading-relaxed">{day.codeContent}</p>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-gray-100 dark:border-gray-600 pt-3 sm:pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-light">
              {day.isCompleted && day.completedAt && (
                `Completed on ${new Date(day.completedAt).toLocaleDateString()}`
              )}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingRemarks(true);
              }}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
            >
              <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          {isEditingRemarks ? (
            <div className="mt-3 space-y-3">
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add your remarks, notes, or progress..."
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg text-xs sm:text-sm resize-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 focus:border-transparent font-light bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows={3}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveRemarks();
                  }}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs sm:text-sm rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
                >
                  <Save className="w-3 h-3" />
                  <span>Save</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelEdit();
                  }}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs sm:text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
                >
                  <X className="w-3 h-3" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            day.remarks && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Remarks:</span> {day.remarks}
                </p>
              </div>
            )
          )}
        </div>
      </motion.div>
    </>
  );
});
