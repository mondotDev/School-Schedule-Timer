import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import {
  isInWednesdayRange,
  getTodaySchedule,
  getTimeLeft,
} from './scheduleUtils';

describe('schedule utils', () => {
  it('checks if date is in Wednesday range', () => {
    const inRange = dayjs('2024-10-02');
    const outOfRange = dayjs('2025-07-01');
    expect(isInWednesdayRange(inRange)).toBe(true);
    expect(isInWednesdayRange(outOfRange)).toBe(false);
  });

  it('returns Wednesday schedule when applicable', () => {
    const wednesday = dayjs('2024-10-02'); // Wednesday
    const monday = dayjs('2024-09-30'); // Monday
    expect(getTodaySchedule(wednesday)[0].start).not.toBe(
      getTodaySchedule(monday)[0].start
    );
  });

  it('computes time left correctly', () => {
    const now = dayjs('2024-09-01T08:00:00');
    expect(getTimeLeft('08:05', now)).toBe('5 min left');
  });
});
