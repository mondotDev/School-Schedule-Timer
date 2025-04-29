import React from "react";
import dayjs from "dayjs";

export default function CurrentDateCard() {
  const today = dayjs();
  const formatted = today.format("dddd, MMMM D, YYYY");

  return (
    <div className="w-72 bg-white dark:bg-gray-800 rounded-2xl shadow p-4 text-center">
      <h2 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-1">
        Today is
      </h2>
      <div className="text-xl font-bold text-black dark:text-white">
        {formatted}
      </div>
    </div>
  );
}
