// src/utils/schoolDays.js

console.log('🧠 schoolDays.js vFINAL DEBUG');

const nonInstructionalDates = new Set([
  '2024-09-02', // Labor Day
  '2024-10-11', // Staff Development Day
  '2024-10-14', // Indigenous Peoples' Day
  '2024-11-11', // Veterans Day
  '2024-11-25', '2024-11-26', '2024-11-27', '2024-11-28', '2024-11-29', // Thanksgiving Week
  '2024-12-23', '2024-12-24', '2024-12-25', '2024-12-26', '2024-12-27',
  '2024-12-30', '2024-12-31', '2025-01-01', '2025-01-02', '2025-01-03', // Winter Break
  '2025-01-20', // MLK Jr. Day
  '2025-02-17', // Presidents' Day
  '2025-03-24', '2025-03-25', '2025-03-26', '2025-03-27', '2025-03-28', // Spring Break
  '2025-04-25', // Staff Development Day
  '2025-05-23', // Non-student day
  '2025-05-26', // Memorial Day
]);



function generateInstructionalDays() {
  const start = new Date('2024-08-26T00:00:00');
  const end = new Date('2025-06-12');
  const days = [];

  for (let d = new Date(start); d <= end; ) {
    const day = d.getDay();
    const iso = d.toISOString().split('T')[0];
    if (day !== 0 && day !== 6) {
      if (nonInstructionalDates.has(iso)) {
        console.log('⛔ Skipping non-instructional day:', iso);
      } else {
        console.log('✅ Adding instructional day:', iso);
        days.push(iso);
      }
    } else {
      console.log('📅 Skipping weekend:', iso);
    }
    d = new Date(d.getTime() + 86400000); // advance by one full day
  }

  return days;
}

const instructionalDays = generateInstructionalDays();

console.log('✅ Total instructional days:', instructionalDays.length);
console.log('🟢 First day:', instructionalDays[0]);
console.log('🔴 Last day:', instructionalDays[instructionalDays.length - 1]);

export default instructionalDays;