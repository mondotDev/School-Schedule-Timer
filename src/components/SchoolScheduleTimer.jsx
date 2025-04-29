import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

const regularSchedule = [
  { period: "9th Gr. Co-Enrolled", start: "08:15", end: "09:05" },
  { period: "1", start: "08:30", end: "09:18" },
  { period: "2", start: "09:23", end: "10:15" },
  { period: "3", start: "10:20", end: "11:08" },
  { period: "4", start: "11:13", end: "12:01" },
  { period: "Lunch", start: "12:01", end: "12:36" },
  { period: "5", start: "12:41", end: "13:39" },
  { period: "6", start: "13:44", end: "14:32" },
  { period: "7", start: "14:37", end: "15:25" },
];

const wednesdaySchedule = [
  { period: "9th Gr. Co-Enrolled", start: "09:10", end: "09:50" },
  { period: "1", start: "09:40", end: "10:18" },
  { period: "2", start: "10:23", end: "11:05" },
  { period: "3", start: "11:10", end: "11:48" },
  { period: "4", start: "11:53", end: "12:31" },
  { period: "Lunch", start: "12:31", end: "13:06" },
  { period: "5", start: "13:11", end: "13:59" },
  { period: "6", start: "14:04", end: "14:42" },
  { period: "7", start: "14:47", end: "15:25" },
];

function SchoolScheduleTimer() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [activePeriods, setActivePeriods] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      setCurrentTime(now);
      const day = now.day();
      const isWednesday = day === 3 && isInWednesdayRange(now);
      const schedule = isWednesday ? wednesdaySchedule : regularSchedule;
      const time = now.format("HH:mm");

      const current = schedule.filter(
        (p) => time >= p.start && time < p.end
      );

      // If no active periods, check for passing time
      if (current.length === 0) {
        const upcoming = schedule.find((p) => time < p.start);
        if (upcoming) {
          current.push({
            period: `Passing Time → Period ${upcoming.period}`,
            end: upcoming.start,
          });
        }
      }

      setActivePeriods(current);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function isInWednesdayRange(date) {
    const month = date.month();
    const dateOfMonth = date.date();
    if (month < 8 || month > 4) return false; // Sep–May only
    const firstOfMonth = dayjs(new Date(date.year(), month, 1));
    let wednesdays = [];
    for (let i = 0; i < 31; i++) {
      const d = firstOfMonth.add(i, "day");
      if (d.day() === 3) wednesdays.push(d.date());
    }
    return (
      dateOfMonth >= wednesdays[1] &&
      dateOfMonth <= wednesdays[wednesdays.length - 1]
    );
  }

  function getTimeLeft(endTime, now) {
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const end = now.set("hour", endHour).set("minute", endMinute);
    const diff = end.diff(now, "minute");
    return diff > 0 ? `${diff} min left` : "0 min";
  }

  return (
    <div className="w-72 bg-white dark:bg-gray-800 rounded-2xl shadow p-4 text-center">
      <h1 className="text-5xl font-bold text-black dark:text-white mb-4">
        {currentTime.format("hh:mm A")}
      </h1>

      {activePeriods.length > 0 ? (
        activePeriods.map((period) => (
          <div key={period.period}>
            <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">
              Period
            </div>
            <div className="text-2xl font-bold text-black dark:text-white mb-1">
              {period.period}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {getTimeLeft(period.end, currentTime)}
            </div>
          </div>
        ))
      ) : (
        <div className="text-md text-gray-500 dark:text-gray-300">
          {currentTime.hour() < 8 || currentTime.hour() >= 16
            ? "School Closed"
            : "Passing Time"}
        </div>
      )}
    </div>
  );
}

export default SchoolScheduleTimer;
