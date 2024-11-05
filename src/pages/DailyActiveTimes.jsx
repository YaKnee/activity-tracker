import React, { useState, useEffect, useMemo } from "react";

import dayjs from "dayjs";


import Table from "react-bootstrap/Table";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';

import DateRangePicker from "../components/time-range/DateRangePicker";
import SelectTaskForm from "../components/forms/SelectTaskForm";
import DailyBarChart from "../components/graphs/DailyBarChart";
import { getActiveTimesInTimeRange } from "../utils/apiDataManipulation";

function DailyActiveTimes({ taskStates, chosenTask, setChosenTask, darkMode }) {

  const [timeRange, setTimeRange] = useState({ 
    start: dayjs().subtract(7, "day"), 
    end: dayjs()
  });

  const [dailyTimes, setDailyTimes] = useState([]);
  const [unit, setUnit] = useState("minutes");

  // Calculate dayEntries whenever chosenTask or timeRange changes
  const dayEntries = useMemo(() => {
    if (chosenTask) {
      return getActiveTimesInTimeRange(chosenTask, timeRange, unit);
    }
    return [];
  }, [chosenTask, timeRange, unit]);
  // Set dailyTimes based on dayEntries
  useEffect(() => {
    setDailyTimes(dayEntries);
  }, [dayEntries]);

  const handleChange = (event) => {
    setUnit(event.target.value);
  };

  if (!taskStates || taskStates.length === 0) {
    return (
      <>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
          <h1>No tasks added to database yet.</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Stack direction={{xs: "column", sm: "row"}} spacing={{ xs: 1, sm: 2, md: 4}} className="mb-5"> 
        <DateRangePicker timeRange={timeRange} setTimeRange={setTimeRange}/>
        <Stack direction={{xs: "row"}} spacing={{xs: 1}} style={{marginTop: "16px", width: "100%"}}>
          <SelectTaskForm taskStates={taskStates} chosenTask={chosenTask} setChosenTask={setChosenTask} />
          <FormControl style={{minWidth: "150px"}}>
            <InputLabel id="select-unit-label">Unit</InputLabel>
            <Select
              labelId="select-unit-label"
              id="select-unit"
              value={unit}
              label="Unit"
              onChange={handleChange}
            >
              <MenuItem value={"seconds"}>Seconds</MenuItem>
              <MenuItem value={"minutes"}>Minutes</MenuItem>
              <MenuItem value={"hours"}>Hours</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <DailyBarChart chosenTask={chosenTask} dayEntries={dayEntries} unit={unit} darkMode={darkMode} />

      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        <Table striped bordered hover variant="dark">
          <thead style={{position: "sticky", top: 0, backgroundColor: "#343a40" }}>
            <tr>
              <th>Date</th>
              <th>Total Time ({unit})</th>
            </tr>
          </thead>
          <tbody>
            {dailyTimes.length > 0 ? (
              dailyTimes.map(day => (
                <tr key={day.date}>
                  <td>{day.date}</td>
                  <td>{day.totalTime}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>No data available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default DailyActiveTimes;