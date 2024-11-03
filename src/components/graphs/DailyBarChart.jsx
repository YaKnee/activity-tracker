import React from "react";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Creates an array of active times per for a specific task in a specific time range
// (Very excessive but works so don't touch it...)
function getActiveTimesInTimeRange(task, timeRange) {

  const start = dayjs(timeRange.start).startOf("day");
  const end = dayjs(timeRange.end).endOf("day");

  const lastType0TimestampBeforeStart = task.timestamps.reduceRight((acc, curr) => {
    return acc || (curr.type === 0 && dayjs(curr.time).isBefore(start) ? curr : null);
  }, null);

  const dayEntries = []; 
  let isCounting = lastType0TimestampBeforeStart !== null; 
  let startTime = null;

  // Loop through each day in the time range
  for (let day = start; day.isBefore(end); day = day.add(1, "day")) {
    let totalTime = 0;
    
    // Filter timestamps that belong to the current day in loop
    const dayTimestamps = task.timestamps.filter(ts => {
      const tsTime = dayjs(ts.time);
      return tsTime.isSame(day, "day");
    });

    // Process timestamps for current day in loop if exist
    if (dayTimestamps) {
      dayTimestamps.forEach((ts) => {
        const tsTime = dayjs(ts.time);

        // If the timestamp is of type 0, start counting time if not already started
        if (ts.type === 0) {
          if (startTime === null) {
            startTime = tsTime;
            isCounting = true;
          }
        } else if (ts.type === 1 && isCounting) {
          // If the timestamp is of type 1 and counting is active, calculate time
          totalTime += tsTime.diff(startTime, "minute");
          isCounting = false;
          startTime = null;
        }
      });

      // Special handling for the current day if the last timestamp is of type 1.
      if (day.isSame(dayjs(), "day") && startTime === null) {
        const lastTimestampToday = dayTimestamps[dayTimestamps.length - 1];
        if (dayTimestamps.length === 1 && lastTimestampToday.type === 1) {
          totalTime = dayjs(lastTimestampToday.time).diff(day.startOf("day"), "minute");
        }
      }

      // Handle the case when the last timestamp of the day is type 0.
      if (isCounting && startTime) {
        if (day.isSame(dayjs(), "day")) {
          totalTime += dayjs().diff(startTime, "minute"); // Count time up to the current moment for today.
        } else {
          totalTime += day.endOf("day").diff(startTime, "minute"); // Count time up to the end of the day for past days.
        }
      }
    } else if (isCounting) {
      // If there are no timestamps but counting was active from the previous day.
      if (day.isSame(dayjs(), "day")) {
        // If it's today, calculate up to the current time.
        totalTime = dayjs().diff(day, "minute");
      } else {
        totalTime = 1440; // Full day for past days (1440 minutes).
        startTime = day; // Continue counting from the start of the day.
      }
    }

    // Add the daily entry to the results with formatted date and total time.
    dayEntries.push({
      date: day.format("DD-MM-YYYY"), // Format the date for output.
      totalTime: Math.min(totalTime, 1440), // Ensure total time does not exceed 1440 minutes (1 day).
    });

    // If the last timestamp of the day is type 0, continue counting into the next day.
    if (dayTimestamps.length > 0 && dayTimestamps[dayTimestamps.length - 1].type === 0) {
      isCounting = true; // Mark counting as active for the next day.
      startTime = day.endOf("day").add(1, "minute").startOf("day"); // Set start time to the next day.
    } else if (dayTimestamps.length === 0 && isCounting) {
      // If there are no timestamps but we are still counting, continue counting into the next day.
      startTime = day.endOf("day").add(1, "minute"); // Continue from the end of the current day.
    } else {
      // Reset counting if the last timestamp of the day was of type 1 or no timestamps at all.
      isCounting = false;
      startTime = null;
    }
  }

  return dayEntries; // Return the array of daily entries.
}



const DailyActivityChart = ({ chosenTask, timeRange }) => {
  if (!chosenTask || !chosenTask.timestamps) {
    return <h2>Select a task to view activity</h2>;
  }

  const dayEntries = getActiveTimesInTimeRange(chosenTask, timeRange);

  const data = {
    labels: dayEntries.map(activity => activity.date),
    datasets: [
      {
        label: "Daily Active Time (minutes)",
        data: dayEntries.map(activity => activity.totalTime), 
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return (
    <div>
      <h2>Daily Active Times for "{chosenTask.name}"</h2>
      <Bar
        data={data}
        options={{
          responsive: true,
          scales: {
            y: {
              title: {
                display: true,
                text: "Time (minutes)",
              },
            },
            x: {
              title: {
                display: true,
                text: "Date",
              },
              ticks: {
                autoSkip: true,
                // maxRotation: 90,
                // minRotation: 90
                //maxTicksLimit: 10,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default DailyActivityChart;
