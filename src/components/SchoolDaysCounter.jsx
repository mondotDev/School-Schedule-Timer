import React from 'react';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

import instructionalDays from '../utils/schoolDays';

export default function SchoolDaysCounter() {
  const today = dayjs().startOf('day');

  const totalDays = instructionalDays.length;
  const daysCompleted = instructionalDays.filter(dateStr =>
    dayjs(dateStr).isSameOrBefore(today)
  ).length;

  const daysRemaining = totalDays - daysCompleted;
  const progressPercent = Math.round((daysCompleted / totalDays) * 100);

  return (
    <div className="w-72 bg-white dark:bg-gray-800 rounded-2xl shadow p-4 text-center">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
        📅 <span>School Year Progress</span>
      </h2>

      <div className="text-sm text-gray-700 dark:text-gray-300 mb-3 space-y-1">
        <div>Days Completed: <strong>{daysCompleted}</strong></div>
        <div>Days Remaining: <strong>{daysRemaining}</strong></div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className="bg-blue-500 h-4 transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="mt-2 text-right text-xs text-gray-500 dark:text-gray-400">
        {progressPercent}% of the year completed
      </p>
    </div>
  );
}
