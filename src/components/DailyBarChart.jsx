import React, { useState, useEffect } from "react";
import TimeIntervalForm from "./forms/TimeIntervalForm";
import TaskTable from "./TaskTable";

function DailyBarChart({ taskStates }) {
  const [timeRange, setTimeRange] = useState({ start: null, end: null });
  const [chosenTask, setChosenTask] = useState(1)

  useEffect(() => {

  }, [chosenTask]);

  return (
    <>
      <TimeIntervalForm timeRange={timeRange} setTimeRange={setTimeRange}/>
      <TaskTable taskStates={taskStates} chosenTask={chosenTask} setChosenTask={setChosenTask} />
    </>
  )
};

export default DailyBarChart;