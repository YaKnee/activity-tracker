import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LineController 
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LineController
);

const DailyBarChart = ({ chosenTask, dayEntries, unit, darkMode }) => {
  if (!chosenTask || !chosenTask.timestamps) {
    return <h2>Select a task to view activity</h2>;
  }

  const averageTotalTime = useMemo(() => {
    const total = dayEntries.reduce((sum, activity) => sum + activity.totalTime, 0);
    return (total / dayEntries.length).toFixed(2) || 0; // Prevent division by zero
  }, [dayEntries]);
  const averageLineData = new Array(dayEntries.length).fill(averageTotalTime);

  const barColour = darkMode ? "rgb(102, 100, 255)" : "rgb(1, 196, 231)";
  const lineColour = darkMode ? "rgb(183, 153, 0)" : "rgb(255, 99, 132)";

  const data = {
    labels: dayEntries.map(activity => activity.date),
    datasets: [
      {
        label: "Daily Active Time",
        data: dayEntries.map(activity => activity.totalTime),
        backgroundColor: barColour,
      },
      {
        label: "Average Total Time",
        data: averageLineData,
        borderColor: lineColour,
        type: "line",
        borderWidth: 2,
        pointStyle:false,
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3>Daily Active Times for "{chosenTask.name}"</h3>
      <Bar
        data={data}
        id="daily-bar-chart"
        options={{
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            y: {
              title: {
                display: true,
                text: `Time (${unit})`,
                color: darkMode ? '#fff' : '#000'
              },
              grid: {
                color: darkMode ? "#444" : "#ccc"
              },
              ticks: {
                color: darkMode ? "#fff" : "#000"
              }
            },
            x: {
              title: {
                display: true,
                text: "Date",
                color: darkMode ? '#fff' : '#000'
              },
              grid: {
                color: darkMode ? "#444" : "#ccc"
              },
              ticks: {
                autoSkip: true,
                color: darkMode ? "#fff" : "#000"
                // Uncomment again if ya wanna have labels vertical 
                // maxRotation: 90,
                // minRotation: 90
              },
            },
          },
        }}
      />
      <h5>Average total time: {averageTotalTime} {unit}</h5>
    </div>
  );
};

export default DailyBarChart;
