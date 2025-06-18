import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import {
  isInWednesdayRange,
  getTodaySchedule,
  getTimeLeft,
  isSchoolYearOver,
} from './scheduleUtils';
import scheduleData from './scheduleData.json';

describe('schedule utils', () => {
  it('checks if date is in Wednesday range', () => {
    const { instructionalYear } = scheduleData;
    const startYear = dayjs(instructionalYear.firstDay).year();
    const endYear = dayjs(instructionalYear.lastDay).year();
    const inRange = dayjs(`${startYear}-10-01`);
    const outOfRange = dayjs(`${endYear}-07-01`);
    expect(isInWednesdayRange(inRange)).toBe(true);
    expect(isInWednesdayRange(outOfRange)).toBe(false);
  });

  it('returns Wednesday schedule when applicable', () => {
    const { instructionalYear } = scheduleData;
    const startYear = dayjs(instructionalYear.firstDay).year();
    const wednesday = dayjs(`${startYear}-10-01`); // Wednesday
    const monday = dayjs(`${startYear}-09-29`); // Monday
    expect(getTodaySchedule(wednesday)[0].start).not.toBe(
      getTodaySchedule(monday)[0].start
    );
  });

  it('computes time left correctly', () => {
    const { instructionalYear } = scheduleData;
    const startYear = dayjs(instructionalYear.firstDay).year();
    const now = dayjs(`${startYear}-09-01T08:00:00`);
    expect(getTimeLeft('08:05', now)).toBe('5 min left');
  });

  it('detects when the school year is over or not yet started', () => {
    const { instructionalYear } = scheduleData;
    const firstDay = dayjs(instructionalYear.firstDay);
    const lastDay = dayjs(instructionalYear.lastDay);
    const beforeFirstDay = firstDay.subtract(1, 'day');
    const afterLastDay = lastDay.add(1, 'day');

    expect(isSchoolYearOver(beforeFirstDay)).toBe(true);
    expect(isSchoolYearOver(afterLastDay)).toBe(true);
    expect(isSchoolYearOver(firstDay)).toBe(false);
    expect(isSchoolYearOver(lastDay)).toBe(false);
  });
});
