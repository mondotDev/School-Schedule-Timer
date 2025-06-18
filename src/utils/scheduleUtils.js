import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import scheduleData from "./scheduleData.json";
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
  const { instructionalYear } = scheduleData;
  const startYear = dayjs(instructionalYear.firstDay).year();
  const endYear = dayjs(instructionalYear.lastDay).year();
  const start = dayjs(`${startYear}-09-01`);
  const end = dayjs(`${endYear}-05-31`);
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

export function isSchoolYearOver(date) {
  const last = dayjs(scheduleData.instructionalYear.lastDay);
  return date.isAfter(last, "day");
}



const { holidays, instructionalYear } = scheduleData;
const firstDay = dayjs(instructionalYear.firstDay);
const lastDay = dayjs(instructionalYear.lastDay);

export const instructionalDays = [];

for (let date = firstDay; date.isSameOrBefore(lastDay); date = date.add(1, "day")) {
  const isWeekend = date.day() === 0 || date.day() === 6; // Sunday = 0, Saturday = 6
  const isHoliday = holidays.includes(date.format("YYYY-MM-DD"));
  if (!isWeekend && !isHoliday) {
    instructionalDays.push(date.format("YYYY-MM-DD"));
  }
}
