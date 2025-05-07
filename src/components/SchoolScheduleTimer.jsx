import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  getTodaySchedule,
  getActivePeriods,
  getTimeLeft,
} from "../utils/scheduleUtils";

function SchoolScheduleTimer() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [activePeriods, setActivePeriods] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      setCurrentTime(now);

      const schedule = getTodaySchedule(now);
      const periods = getActivePeriods(now, schedule);

      setActivePeriods(periods);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center pt-2 px-4 text-white flex flex-col items-center gap-6">
      {/* Time Box */}
      <div className="bg-white text-black rounded-2xl px-6 py-4 w-72 shadow-lg">
        <h1 className="text-4xl font-bold leading-tight">
          {currentTime.format("hh:mm A")}
        </h1>
      </div>

      {/* Active Period Card */}
      {activePeriods.length > 0 ? (
        activePeriods.map((period, index) => (
          <div
            key={`${period.period}-${index}`}
            className="bg-white text-black rounded-2xl px-6 py-4 w-72 shadow-lg"
          >
            <div className="text-sm uppercase text-gray-500 font-semibold mb-1">
              Period
            </div>
            <div
              className={
                period.period.includes("Passing Time")
                  ? "text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis"
                  : "text-xl font-bold"
              }
            >
              {period.period}
            </div>
            <div className="text-md">
              {typeof period.end === "string"
                ? getTimeLeft(period.end, currentTime)
                : "Unknown time"}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white text-black rounded-2xl px-6 py-4 w-72 shadow-lg text-xl">
          {currentTime.hour() < 8 || currentTime.hour() >= 16
            ? "School Closed"
            : "Passing Time"}
        </div>
      )}
    </div>
  );
}

export default SchoolScheduleTimer;
