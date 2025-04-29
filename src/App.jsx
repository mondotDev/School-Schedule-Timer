import React from "react";
import SchoolScheduleTimer from "./components/SchoolScheduleTimer";
import SchoolDaysCounter from "./components/SchoolDaysCounter";
import CurrentDateCard from "./components/CurrentDateCard";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-900 p-4">
      <h1 className="text-4xl font-bold text-white mb-6">Holmes Junior High</h1>
      <CurrentDateCard />
      <SchoolScheduleTimer />
      <SchoolDaysCounter />
    </div>
  );
}

export default App;
