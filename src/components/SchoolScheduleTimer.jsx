
// school_schedule_timer.jsx
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Los_Angeles");

// Helper to find the Nth weekday in a month
function getNthWeekdayOfMonth(year, month, weekday, nth) {
  let date = dayjs(`${year}-${month}-01`);
  let count = 0;
  while (date.month() + 1 === month) {
    if (date.day() === weekday) {
      count++;
      if (count === nth) return date;
    }
    date = date.add(1, "day");
  }
  return null;
}

// Helper to find the last weekday in a month
function getLastWeekdayOfMonth(year, month, weekday) {
  let date = dayjs(`${year}-${month}-01`).endOf("month");
  while (date.day() !== weekday) {
    date = date.subtract(1, "day");
  }
  return date;
}

// Wrapper: is today between 2nd Wed of Sept and last Wed of May?
function isWednesdayScheduleActive(now) {
  const year = now.year();
  const secondWedInSept = getNthWeekdayOfMonth(year, 9, 3, 2); // Sept, Wed, 2nd
  const lastWedInMay = getLastWeekdayOfMonth(year, 5, 3);      // May, Wed

  return now.isSame(secondWedInSept, 'day') || now.isSame(lastWedInMay, 'day') ||
    (now.isAfter(secondWedInSept) && now.isBefore(lastWedInMay));
}


const schedule = {
  default: [
    { period: "Period 1", start: "08:30", end: "09:18" },
    { period: "Period 2", start: "09:23", end: "10:15" },
    { period: "Period 3", start: "10:20", end: "11:08" },
    { period: "Period 4", start: "11:13", end: "12:01" },
    { period: "Lunch",    start: "12:01", end: "12:36" },
    { period: "Period 5", start: "12:41", end: "13:39" },
    { period: "Period 6", start: "13:44", end: "14:32" },
    { period: "Period 7", start: "14:37", end: "15:25" },
  ],
  wednesday: [
    { period: "Period 1", start: "09:40", end: "10:18" },
    { period: "Period 2", start: "10:23", end: "11:05" },
    { period: "Period 3", start: "11:10", end: "11:48" },
    { period: "Period 4", start: "11:53", end: "12:31" },
    { period: "Lunch",    start: "12:31", end: "13:06" },
    { period: "Period 5", start: "13:11", end: "13:59" },
    { period: "Period 6", start: "14:04", end: "14:42" },
    { period: "Period 7", start: "14:47", end: "15:25" },
  ]
};

export default function SchoolScheduleTimer() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs();
      setCurrentTime(now);

      const isWednesday = now.day() === 3;
      const useWednesdaySchedule = isWednesday && isWednesdayScheduleActive(now);
      const todaySchedule = useWednesdaySchedule ? schedule.wednesday : schedule.default;
      let found = false;

      for (let i = 0; i < todaySchedule.length; i++) {
        const period = todaySchedule[i];
        const start = dayjs.tz(now.format("YYYY-MM-DD") + "T" + period.start, "America/Los_Angeles");
        const end = dayjs.tz(now.format("YYYY-MM-DD") + "T" + period.end, "America/Los_Angeles");
        if (now.isAfter(start) && now.isBefore(end)) {
          setCurrentPeriod(period.period);
          setTimeRemaining(end.diff(now));
          found = true;
          break;
        }
      }

      if (!found) {
        const schoolStart = dayjs.tz(now.format("YYYY-MM-DD") + "T08:00", "America/Los_Angeles");
        const schoolEnd = dayjs.tz(now.format("YYYY-MM-DD") + "T16:00", "America/Los_Angeles");

        if (now.isBefore(schoolStart) || now.isAfter(schoolEnd)) {
          setCurrentPeriod("School Closed");
          setTimeRemaining(null);
        } else {
          for (let i = 0; i < todaySchedule.length - 1; i++) {
            const prevEnd = dayjs.tz(now.format("YYYY-MM-DD") + "T" + todaySchedule[i].end, "America/Los_Angeles");
            const nextStart = dayjs.tz(now.format("YYYY-MM-DD") + "T" + todaySchedule[i + 1].start, "America/Los_Angeles");
            if (now.isAfter(prevEnd) && now.isBefore(nextStart)) {
              setCurrentPeriod("Passing Time");
              setTimeRemaining(nextStart.diff(now));
              return;
            }
          }
          setCurrentPeriod("Passing Time");
          setTimeRemaining(null);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms) => {
    if (ms == null) return "--:--";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white text-center space-y-8">
      <div className="text-6xl font-bold">{currentTime.format("hh:mm A")}</div>
      <div className="text-xl tracking-wider">CURRENT TIME</div>

      <div className="text-4xl font-semibold">{currentPeriod}</div>
      <div className="text-xl tracking-wider">CURRENT PERIOD</div>

      <div className="text-6xl font-bold">{formatTime(timeRemaining)}</div>
      <div className="text-xl tracking-wider">TIME REMAINING</div>
    </div>
  );
}
