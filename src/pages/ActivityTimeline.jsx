import { useState, useEffect } from "react";

import dayjs from "dayjs";

import Table from "react-bootstrap/Table";

import Stack  from "@mui/material/Stack";

import DateTimeRangePicker from "../components/time-range/DateTimeRangePicker";
import SelectTaskForm from "../components/forms/SelectTaskForm";
import { getActivityIntervals } from "../utils/apiDataManipulation";

function ActivityTimeline({ taskStates, timestamps, chosenTask, setChosenTask}) {

  const [timeRange, setTimeRange] = useState({ 
    start: dayjs().startOf("day"), 
    end: dayjs()
  });
  const [activityIntervals, setActivityIntervals] = useState({});

  useEffect(() => {
    if (chosenTask && timeRange) {
      const intervals = getActivityIntervals(chosenTask, timeRange);
      setActivityIntervals(intervals);
    }
  }, [chosenTask, timeRange, timestamps]);

    // // Doesnt work, uncomment when fixed
  // // Handles adding new intervals
  // const handleNewInterval = async () => {
  //   try {
  //     const newTimestampsData = [
  //       { timestamp: timeRange.start.format("YYYY-MM-DD HH:mm:ss.SSS"), task: chosenTask.id, type: 0 },
  //       { timestamp: timeRange.end.format("YYYY-MM-DD HH:mm:ss.SSS"), task: chosenTask.id, type: 1 }
  //     ]
      
  //     const newTimestampObjects = await Promise.all(
  //       newTimestampsData.map(ts => addTimestamp(ts))
  //     );
  
  //     const cleanedTimestamps = newTimestampObjects.map(ts => {
  //       const { id, timestamp, task, type  } = ts;
  //       return { id, time: timestamp, type};
  //     });

  //     // Combine old timestamps with new cleaned timestamps
  //     const allTimestamps = [...chosenTask.timestamps, ...cleanedTimestamps];

  //     const { firstLetter, ...cleanedTask} = chosenTask;
  //     // Update the chosen task with the sorted timestamps
  //     const updatedTask = {
  //       ...cleanedTask,
  //       timestamps: allTimestamps.sort((a, b) => dayjs(a.time) - dayjs(b.time))
  //     };
  //     setTimestamps(prev => [...prev, newTimestampObjects]);
  //     setTaskStates(prevTaskStates => 
  //       prevTaskStates.map(state => 
  //         state.id === chosenTask.id ? updatedTask : state
  //       )
  //     );
  //     console.log(updatedTask);
  //     setNewInterval({ start: '', end: '' });
  //     showSnackbar(`Interval added to "${chosenTask.name}".`, "success");
  //   } catch (error) {
  //     showSnackbar("Failed to add interval. Please try again.", "error");
  //     console.error("Error adding timestamps:", error);
  //   }
  // }

  return (
    <>
    <Stack direction={{xs: "column", sm: "row"}} spacing={{ xs: 1, sm: 2, md: 4}} className="my-4">
      <div style={{display: "flex", justifyContent: "space-evenly", minWidth: "50%"}}>
        <DateTimeRangePicker timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>

      <SelectTaskForm taskStates={taskStates} chosenTask={chosenTask} setChosenTask={setChosenTask} />
    </Stack>
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
                <td colSpan="3">No intervals found. Try another time range or a different task.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default ActivityTimeline;