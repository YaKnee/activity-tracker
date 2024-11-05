import React, { useState, useEffect } from "react"

import dayjs from "dayjs";

import Table from "react-bootstrap/Table";

import Stack  from "@mui/material/Stack";
import Button from "@mui/material/Button";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import DateTimeRangePicker from "../components/time-range/DateTimeRangePicker";
import SelectTaskForm from "../components/forms/SelectTaskForm";
import { getActivityIntervals } from "../utils/apiDataManipulation";
import { addTimestamp, deleteTimestamp } from "../utils/api";

function ActivityTimeline({ taskStates, setTaskStates, timestamps, setTimestamps, chosenTask, setChosenTask, showSnackbar, darkMode}) {

  const [timeRange, setTimeRange] = useState({ 
    start: dayjs().startOf("day"), 
    end: dayjs()
  });
  const [singleMode, setSingleMode] = useState(true);
  const [activityIntervals, setActivityIntervals] = useState({})
  //const [isEditing, setIsEditing] = useState(false);
  const [newInterval, setNewInterval] = useState({ start: '', end: '' });


  // const handleSwitch = () => {
  //   setSingleMode(!singleMode)
  // }

  useEffect(() => {
    if (chosenTask && timeRange) {
      const intervals = getActivityIntervals(chosenTask, timeRange);
      setActivityIntervals(intervals);
    }
  }, [chosenTask, timeRange, timestamps]);

  const handleNewInterval = async () => {
    try {
      const newTimestampsData = [
        { timestamp: timeRange.start.format("YYYY-MM-DD HH:mm:ss.SSS"), task: chosenTask.id, type: 0 },
        { timestamp: timeRange.end.format("YYYY-MM-DD HH:mm:ss.SSS"), task: chosenTask.id, type: 1 }
      ]
      
      const newTimestampObjects = await Promise.all(
        newTimestampsData.map(ts => addTimestamp(ts))
      );
  
      const cleanedTimestamps = newTimestampObjects.map(ts => {
        const { id, timestamp, task, type  } = ts;
        return { id, time: timestamp, type};
      });

      // Combine old timestamps with new cleaned timestamps
      const allTimestamps = [...chosenTask.timestamps, ...cleanedTimestamps];

      const { firstLetter, ...cleanedTask} = chosenTask;
      // Update the chosen task with the sorted timestamps
      const updatedTask = {
        ...cleanedTask,
        timestamps: allTimestamps.sort((a, b) => dayjs(a.time) - dayjs(b.time))
      };
      setTimestamps(prev => [...prev, newTimestampObjects]);
      setTaskStates(prevTaskStates => 
        prevTaskStates.map(state => 
          state.id === chosenTask.id ? updatedTask : state
        )
      );
      console.log(updatedTask);
      // console.log(allTimestamps)
      // console.log(newTimestampObjects);
      //setActivityIntervals(getActivityIntervals(updatedTask, timeRange));
      setNewInterval({ start: '', end: '' });
      showSnackbar(`Interval added to "${chosenTask.name}".`, "success");
    } catch (error) {
      showSnackbar("Failed to add interval. Please try again.", "error");
      console.error("Error adding timestamps:", error);
    }
  }

  // const handleDeleteInterval = async (id) => {
  //   await deleteTimestamp({ id });
  //   setActivityIntervals(prev => prev.filter(interval => interval.id !== id));
  // };

  // const handleEditInterval = (id, field, value) => {
  //   setActivityIntervals(prev => 
  //     prev.map(interval => 
  //       interval.id === id ? { ...interval, [field]: value } : interval
  //     )
  //   );
  // };

  // const checkForOverlaps = (intervals) => {
  //   return intervals.map(interval => {
  //     const overlaps = intervals.some(other => {
  //       if (other.id === interval.id) return false;
  //       return (
  //         dayjs(interval.start).isBefore(dayjs(other.end)) &&
  //         dayjs(interval.end).isAfter(dayjs(other.start))
  //       );
  //     });
  //     return { ...interval, hasOverlap: overlaps };
  //   });
  // };

  // const intervalsWithOverlaps = checkForOverlaps(activityIntervals);

  return (
    <>
    <Stack direction={{xs: "column", sm: "row"}} spacing={{ xs: 1, sm: 2, md: 4}} className="my-4">
      <div style={{display: "flex", justifyContent: "space-evenly", minWidth: "50%"}}>
        <DateTimeRangePicker timeRange={timeRange} setTimeRange={setTimeRange} />
        {/* <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleNewInterval}>Add Interval</Button> */}
      </div>

      <SelectTaskForm taskStates={taskStates} chosenTask={chosenTask} setChosenTask={setChosenTask} />
    </Stack>

      {/* {
        singleMode
        ? <SelectTaskForm taskStates={taskStates} chosenTask={chosenTask} setChosenTask={setChosenTask} />
        : <h1> K </h1>
      } */}
      {/* <FormControlLabel control={<Switch defaultChecked onChange={handleSwitch} />} label={singleMode ? "Single Task" : "All Tasks"} />*/}
      <div style={{ maxHeight: "500px", overflowY: "auto", marginTop: "20px" }}>
        <Table striped bordered hover variant="dark">
          <thead style={{position: "sticky", top: 0, backgroundColor: "#343a40" }}>
            <tr>
              <th>Start</th>
              <th>End</th>
              <th>Total Active Time</th>
            </tr>
          </thead>
          <tbody>
          {/* {intervalsWithOverlaps.length > 0 ? (
              intervalsWithOverlaps.map(interval => (
                <tr key={interval.id} style={{ backgroundColor: interval.hasOverlap ? '#ffcccb' : 'transparent' }}>
                  <td>
                    <Form.Control 
                      type="text" 
                      value={interval.start} 
                      onChange={(e) => handleEditInterval(interval.id, 'start', e.target.value)} 
                    />
                  </td>
                  <td>
                    <Form.Control 
                      type="text" 
                      value={interval.end} 
                      onChange={(e) => handleEditInterval(interval.id, 'end', e.target.value)} 
                    />
                  </td>
                  <td>{interval.time}</td>
                  <td>
                    <Button variant="contained" color="danger" onClick={() => handleDeleteInterval(interval.id)}>Delete</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No data available</td>
              </tr>
            )} */}
            {activityIntervals.length > 0 ? (
              activityIntervals.map(interval => (
                <tr key={interval.id}>
                  <td>{interval.start}</td>
                  <td>{interval.end}</td>
                  <td>{interval.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No data available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default ActivityTimeline;