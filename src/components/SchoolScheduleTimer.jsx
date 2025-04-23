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
  { period: "7", start: "14:37", end: "15:25" }
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
  { period: "7", start: "14:47", end: "15:25" }
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

      setActivePeriods(current);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function isInWednesdayRange(date) {
    const month = date.month();
    const dateOfMonth = date.date();
    if (month < 8 || month > 4) return false;
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

  function getTimeLeft(endTime) {
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const end = dayjs().hour(endHour).minute(endMinute);
    const diff = end.diff(currentTime, "minute");
    return diff > 0 ? `${diff} min left` : "0 min";
  }

  return (
  <div className="text-center p-4 text-white min-h-screen flex flex-col items-center justify-center bg-black">
    <h1 className="text-5xl font-bold mb-6">{currentTime.format("hh:mm:ss A")}</h1>

    {activePeriods.length > 0 ? (
      activePeriods.map((period) => (
        <div
          key={period.period}
          className="bg-white text-black rounded-xl px-6 py-4 mb-4 w-72 shadow-lg"
        >
          <div className="text-sm uppercase text-gray-500 font-semibold mb-1">
            Period
          </div>
          <div className="text-xl font-bold">
            {period.period}
          </div>
          <div className="text-md">
            {getTimeLeft(period.end)}
          </div>
        </div>
      ))
    ) : (
      <div className="text-xl text-gray-400">
        {currentTime.hour() < 8 || currentTime.hour() >= 16 ? "School Closed" : "Passing Time"}
      </div>
    )}
  </div>
);

}

export default SchoolScheduleTimer;
