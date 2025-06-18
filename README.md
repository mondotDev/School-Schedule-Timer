# Holmes Countdown

Holmes Countdown is a lightweight web app built for Holmes Junior High School.  
It displays the current class period, the time remaining in the period, and special messages for passing times and non-school hours.

This app helps students and teachers easily keep track of the school day at a glance.

## Features
- 📅 Automatically adjusts for regular and Wednesday (shortened) schedules
- 📆 Late Start Wednesdays run from September through May
- ⏰ Displays current time and active period
- 🔔 Countdown to end of the current period
- 🚪 Displays "Passing Time" or "School Closed" when applicable
- 🎨 Dark mode for easy visibility

## Technology
- React
- Tailwind CSS
- Vercel hosting

## Demo
[Visit Holmes Countdown](https://holmes-countdown.vercel.app)

## Contact
Interested in a custom countdown app for your own school?
📧 Email [melissa.mondot@gmail.com](mailto:melissa.mondot@gmail.com)

## Updating Holidays and Instructional Days
The list of non-school days and the start/end dates of the school year are stored
in `src/utils/scheduleData.json`. Edit this file each summer to reflect the new
calendar:

1. Replace the `holidays` array with the official holidays and breaks for the
   upcoming year.
2. Update `instructionalYear.firstDay` and `instructionalYear.lastDay` with the
   first and last days of school.

The app will automatically recalculate the instructional days on the next build.
