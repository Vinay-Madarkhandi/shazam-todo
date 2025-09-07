'use client';

import React from 'react';
import { ProgressData } from '@/types';
import { Trophy, Calendar, Target, CheckCircle, Settings } from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { usePerformance } from '@/context/PerformanceContext';

interface ProgressOverviewProps {
  progressData: ProgressData;
}

export const ProgressOverview: React.FC<ProgressOverviewProps> = ({ progressData }) => {
  const { phases, totalDays, completedDays, overallProgress } = progressData;
  const { lowPerformanceMode, setLowPerformanceMode } = usePerformance();

  const completedPhases = phases.filter(phase => phase.isCompleted).length;
  const totalPhases = phases.length;

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
      <GlowingEffect
        spread={50}
        glow={true}
        disabled={false}
        proximity={80}
        inactiveZone={0.2}
        borderWidth={1}
      />
      <div className="relative text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight">
          Shazam Learning Journey
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-lg font-light max-w-2xl mx-auto px-4">
          Master audio signal processing and build your own music recognition system
        </p>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setLowPerformanceMode(!lowPerformanceMode)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              lowPerformanceMode 
                ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/30' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title={lowPerformanceMode ? 'Disable performance mode' : 'Enable performance mode'}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">{lowPerformanceMode ? 'Performance Mode' : 'Normal Mode'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="relative bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 border border-gray-100 dark:border-gray-600 hover:shadow-sm transition-all duration-200">
          <GlowingEffect
            spread={15}
            glow={true}
            disabled={false}
            proximity={30}
            inactiveZone={0.3}
            borderWidth={1}
          />
          <div className="relative flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-gray-900 dark:bg-gray-600 rounded-xl">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Overall Progress</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-900 dark:text-white mt-1">
                {Math.round(overallProgress)}%
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-3 sm:mt-4">
            <div 
              className="bg-gray-900 dark:bg-white h-1.5 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <div className="relative bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 border border-gray-100 dark:border-gray-600 hover:shadow-sm transition-all duration-200">
          <GlowingEffect
            spread={15}
            glow={true}
            disabled={false}
            proximity={30}
            inactiveZone={0.3}
            borderWidth={1}
          />
          <div className="relative flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-green-500 rounded-xl">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Days Completed</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-900 dark:text-white mt-1">
                {completedDays}/{totalDays}
              </p>
            </div>
          </div>
        </div>

        <div className="relative bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 border border-gray-100 dark:border-gray-600 hover:shadow-sm transition-all duration-200">
          <GlowingEffect
            spread={15}
            glow={true}
            disabled={false}
            proximity={30}
            inactiveZone={0.3}
            borderWidth={1}
          />
          <div className="relative flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-blue-500 rounded-xl">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Phases Completed</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-900 dark:text-white mt-1">
                {completedPhases}/{totalPhases}
              </p>
            </div>
          </div>
        </div>

        <div className="relative bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 border border-gray-100 dark:border-gray-600 hover:shadow-sm transition-all duration-200">
          <GlowingEffect
            spread={15}
            glow={true}
            disabled={false}
            proximity={30}
            inactiveZone={0.3}
            borderWidth={1}
          />
          <div className="relative flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-orange-500 rounded-xl">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Days Remaining</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-900 dark:text-white mt-1">
                {totalDays - completedDays}
              </p>
            </div>
          </div>
        </div>
      </div>

      {overallProgress > 0 && (
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-light px-4">
            {overallProgress === 100 
              ? "Congratulations! You've completed the entire Shazam learning journey!"
              : `Keep going! You're ${Math.round(100 - overallProgress)}% away from completing your journey.`
            }
          </p>
        </div>
      )}
    </div>
  );
};
