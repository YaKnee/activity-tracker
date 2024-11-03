import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import Container from 'react-bootstrap/Container';
import TextField from "@mui/material/TextField";
import AutoCompleteTagsForm from "./forms/AutoCompleteTagsForm";
import { deleteTask, updateTask, addTimestamp } from "../utils/api";




const TaskElement = ({ taskState, allTags, allTimestamps, setTasks, setTags, setTimestamps, setTaskStates, showSnackbar }) => {
  
  const [localTotalTime, setLocalTotalTime] = useState(taskState.totalTime);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editState, setEditState] = useState({});
  
  // useEffect(() => {
  //   return () => {
  //     setLocalTotalTime(localTotalTime)
  //     setTaskStates((prevStates) => {
  //       return prevStates.map((state) => {
  //         if (state.id === taskState.id) {
  //           return {
  //             ...state,
  //             totalTime: localTotalTime
  //           };
  //         }
  //         return state; 
  //       });
  //     });
  //   };
  // }, [setTaskStates, localTotalTime])

  //Updates tags in the UI when they change in the database
  // useEffect(() => {
  //   setTaskStates(prevTaskStates =>
  //     prevTaskStates.map(state =>
  //       state.id === taskState.id
  //         ? {
  //             ...state,
  //             tags: state.tags
  //           }
  //         : state
  //     )
  //   );
  // }, [allTags])

  // Syncs edit state outside of edit mode
  useEffect(() => {
    setEditState({ name: taskState.name, tags: taskState.tags });
  }, [taskState.name, taskState.tags]);
  

  // Updates total active duration every second if the task is active
  useEffect(() => {
    if (taskState.active) {
      const timer = setInterval(() => {
        setLocalTotalTime((prevTime) => prevTime + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [taskState.active, setLocalTotalTime]);

  // Toggles active state and adds new timestamp to track status changes
  const toggleActive = async () => {
    const newType = taskState.active ? 1 : 0;
    // Format current time to adhere to backend format
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS");
    const newTimestampData = {
      timestamp: now,
      task: taskState.id,
      type: newType
    }
    try {
      const newTimestampObject = await addTimestamp(newTimestampData);
      setTimestamps(prevTimestamps => [...prevTimestamps, newTimestampObject]);

      setTaskStates(prevTaskStates =>
        prevTaskStates.map(state =>
          state.id === taskState.id
            ? {
                ...state,
                active: !state.active,
                timestamps: [
                  ...state.timestamps, 
                  { time: newTimestampData.timestamp, type: newTimestampData.type }
                ],
              }
            : state
        )
      );

      showSnackbar(
        `Task "${taskState.name}" ${newType === 1 ? "stopped" : "started"}`,
        "info"
      );
    } catch (error) {
      console.error("Error toggling task active state:", error);
      showSnackbar("An error occurred while toggling the task's active state","error");
    }
  };


  // Activates edit mode, allowing changes to task name and tags
  const handleEditClick = () => setIsEditMode(true);

  // Deletes task and timestamps related to task from list and database
  const handleDeleteClick = async () => {
    try {
      await deleteTask(taskState.id, allTimestamps);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskState.id));
      setTaskStates(prevTasks => prevTasks.filter(task => task.id !== taskState.id));
      setTimestamps(prevTimes => prevTimes.filter(time => time.task !== taskState.id))
      showSnackbar("Task deleted successfully.", "success");
    } catch (error) {
      console.error("Error deleting task:", error);
      showSnackbar("Error deleting task. Please try again.", "error");
    }
  };

  const exitEditMode = () => {
    setIsEditMode(false);
    setEditState({ name: taskState.name, tags: taskState.tags });
  };

  // Saves any edits to the task name or tags, updating the task state and database
  const handleConfirmClick = async () => {
    // Only update if changes have been made while in edit mode
    if (editState.name !== taskState.name || editState.tags !== taskState.tags) {
      try {
        const updatedTaskData = {
          name: editState.name,
          tags: editState.tags,
        };
        const { updatedTaskObject, newTagObjects } = await updateTask(taskState.id, updatedTaskData, allTags); 
        if (newTagObjects.length > 0) {
          setTags((prevTags) => [...prevTags, ...newTagObjects])
        }
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskState.id 
              ? updatedTaskObject 
              : task)
        );
        setTaskStates(prevTaskStates => 
          prevTaskStates.map(state => 
            state.id === taskState.id 
              ? { 
                  ...state, 
                  name: editState.name, 
                  tags: editState.tags 
                }
              : state
          )
        );
        showSnackbar("Task updated successfully.", "success");
      } catch (error) {
        console.error("Error updating task:", error);
        showSnackbar("Error updating task. Please try again.", "error");
      }
    } else {
      showSnackbar("No changes were detected.", "warning");
    }
    exitEditMode();
  };

  // Updates edit state with changes from input fields in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditState(prevState => ({
      ...prevState,
      [name]: name === "tags" ? value.split(",").map(tag => tag.trim()) : value,
    }));
  };
  

  // Formats total active duration in a readable format (DD:HH:MM:SS or HH:MM:SS)
  const formatDuration = (totalSeconds) => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    return days > 0
      ? `${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };
  
  return (
    <>
      <table style={{ backgroundColor: isEditMode ? "#fbe17889" : "#f9f9f9"}}>
        <tbody>
          <tr>
            <th>Name:</th>
            <td>
              {isEditMode ? <TextField required fullWidth label="New Name" defaultValue={editState.name} onChange={handleInputChange} />
                          : <strong>{taskState.name}</strong>}
            </td>
          </tr>
          <tr>
            <th>Tags:</th>
            <td>
              {isEditMode 
                ? <AutoCompleteTagsForm
                    tags={allTags}
                    selectedTags={editState.tags}
                    setSelectedTags={(newTags) =>
                      setEditState((prevState) => ({
                        ...prevState,
                        tags: newTags,
                      }))
                    }
                    autoHighlight={false}
                    freeSolo={true}

                  />
                : taskState.tags.join(", ")}
            </td>
          </tr>
          <tr>
            <th>Created:</th>
            <td>{taskState.timestamps[0].time.slice(0, -4)}</td>
          </tr>
          <tr>
            <th>Last Toggle:</th>
            <td>{taskState.timestamps[taskState.timestamps.length - 1].time.slice(0, -4)}</td>
          </tr>
          <tr>
            <th>Total Duration:</th>
            <td>{formatDuration(localTotalTime)}</td>
          </tr>
          <tr>
            <td colSpan="2">
              <Container className="d-flex space-evenly">
                  {isEditMode 
                    ? <>
                        <Button style={{flexGrow: 2}} variant="contained" color="success" onClick={handleConfirmClick}>Confirm</Button>
                        <Button style={{flexGrow: 3}} variant="contained" color="error" onClick={exitEditMode}>Cancel</Button>
                        <Button style={{flexGrow: 1}} variant="contained" color="dark" onClick={handleDeleteClick}><DeleteIcon /></Button>
                      </>
                    : <>
                        <Button 
                          variant="contained"
                          onClick={handleEditClick}
                          style={{flexGrow: 1}}
                        >
                          <NoteAltIcon />
                        </Button>
                        <Button
                          variant="contained"
                          color={taskState.active ? "success" : "error"}
                          onClick={toggleActive}
                          style={{flexGrow: 3}}
                        >
                          {taskState.active ? "Active" : "Inactive"}
                        </Button>
                      </>
                  }
              </Container>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default TaskElement;
