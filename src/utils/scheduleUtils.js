import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

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

export function isInWednesdayRange(date) {
  const start = dayjs("2024-09-01");
  const end = dayjs("2025-05-31");
  return (
    date.isSameOrAfter(start, "day") &&
    date.isSameOrBefore(end, "day")
  );
}


export function getTodaySchedule(now) {
  const isWednesday = now.day() === 3; // 3 = Wednesday
  return isWednesday && isInWednesdayRange(now)
    ? wednesdaySchedule
    : regularSchedule;
}


export function getActivePeriods(now, schedule) {
  const current = schedule.filter((p) => {
    const [startH, startM] = p.start.split(":").map(Number);
    const [endH, endM] = p.end.split(":").map(Number);
    const start = dayjs(now).hour(startH).minute(startM).second(0);
    const end = dayjs(now).hour(endH).minute(endM).second(0);
    return now.isSameOrAfter(start) && now.isBefore(end);
  });

  if (current.length === 0) {
    const upcoming = schedule.find((p) => {
      const [startH, startM] = p.start.split(":").map(Number);
      const start = dayjs(now).hour(startH).minute(startM).second(0);
      return now.isBefore(start);
    });

    if (upcoming) {
      current.push({
        period: `Passing Time → Period ${upcoming.period}`,
        end: upcoming.start,
      });
    }
  }

  return current;
}


export function getTimeLeft(endTime, now) {
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const end = now.set("hour", endHour).set("minute", endMinute).set("second", 0);
  const diff = end.diff(now, "minute");
  return diff > 0 ? `${diff} min left` : "0 min";
}


// List of holidays and non-instructional days
const holidays = [
  "2024-09-02", // Labor Day
  "2024-10-14", // Indigenous Peoples' Day
  "2024-11-11", // Veterans Day
  "2024-11-25", // Thanksgiving Break Start
  "2024-11-26",
  "2024-11-27",
  "2024-11-28",
  "2024-11-29", // Thanksgiving Break End
  "2024-12-23", // Winter Break Start
  "2024-12-24",
  "2024-12-25",
  "2024-12-26",
  "2024-12-27",
  "2024-12-30",
  "2024-12-31",
  "2025-01-01",
  "2025-01-02",
  "2025-01-03", // Winter Break End
  "2025-01-06", // Teacher Workday
  "2025-01-20", // Martin Luther King Jr. Day
  "2025-02-17", // Presidents' Week Start
  "2025-02-18",
  "2025-02-19",
  "2025-02-20",
  "2025-02-21", // Presidents' Week End
  "2025-03-31", // Spring Break Start
  "2025-04-01",
  "2025-04-02",
  "2025-04-03",
  "2025-04-04", // Spring Break End
  "2025-04-25", // Local Holiday
  "2025-05-26"  // Memorial Day
];

// Start and end dates of the instructional year
const firstDay = dayjs("2024-08-26");
const lastDay = dayjs("2025-06-12");

export const instructionalDays = [];

for (let date = firstDay; date.isSameOrBefore(lastDay); date = date.add(1, "day")) {
  const isWeekend = date.day() === 0 || date.day() === 6; // Sunday = 0, Saturday = 6
  const isHoliday = holidays.includes(date.format("YYYY-MM-DD"));
  if (!isWeekend && !isHoliday) {
    instructionalDays.push(date.format("YYYY-MM-DD"));
  }
}
