import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DayRangeForm from "../components/forms/DayRangeForm";
import DailyActivityChart from "../components/graphs/DailyBarChart";

function DailyActiveTimes({ taskStates }) {

  const [timeRange, setTimeRange] = useState({ 
    start: dayjs().subtract(7, "day"), 
    end: dayjs()
  });
  const [chosenTask, setChosenTask] = useState({});
  const [dailyTimes, setDailyTimes] = useState([]); //////////////////////////USE FOR TABLE REPRESENTATION OF ACTIVE TIMES

  useEffect(() => {
    setChosenTask(taskStates.length > 0 ? taskStates[0] : {})
  }, [taskStates])

  const taskOptions = taskStates.map((task) => {
    const firstLetter = task.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...task,
    };
  });

  const handleTaskChange = (event, newValue) => {
    setChosenTask(newValue);
  };

  if (!taskStates || taskStates.length === 0) {
    return <h1>No tasks available</h1>;
  }

  return (
    <>
      <DayRangeForm timeRange={timeRange} setTimeRange={setTimeRange}/>

      <Autocomplete
        value={chosenTask}
        onChange={handleTaskChange}
        disableClearable
        options={taskOptions.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
        getOptionLabel={(option) => `${option.name} (id: ${option.id}) `}
        groupBy={(option) => option.firstLetter}
        renderInput={(params) => (
          <TextField {...params} label="Select Task" variant="standard" />
        )}
        autoComplete
        autoHighlight
        ListboxProps={{
          style: {
            maxHeight: 48 * 5,
          },
        }}
      />

      <DailyActivityChart chosenTask={chosenTask} timeRange={timeRange} />
    </>
  )
};

export default DailyActiveTimes;