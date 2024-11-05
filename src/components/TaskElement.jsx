import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

import Button from "@mui/material/Button";
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import Container from 'react-bootstrap/Container';
import TextField from "@mui/material/TextField";

import AutoCompleteTagsForm from "./forms/AutoCompleteTagsForm";
import { getTaskSpecificTotalActiveTime, formatDuration } from "../utils/apiDataManipulation"
import { deleteTask, updateTask, addTimestamp } from "../utils/api";

const TaskElement = ({ element, taskStates, setTaskStates, setTasks, tags, setTags, timestamps, setTimestamps, showSnackbar, darkMode, selectionMode }) => {

  const [isEditMode, setIsEditMode] = useState(false);
  const [editState, setEditState] = useState({});
  
  // Syncs edit state outside of edit mode
  useEffect(() => {
    setEditState({ name: element.name, tags: element.tags });
  }, [element.name, element.tags]);

  // Set up timer to update totalTime every second if active
  useEffect(() => {
    if (element.active) {
      const timer = setInterval(() => {
        setTaskStates(prevElements =>
          prevElements.map(state =>
            state.id === element.id
              ? {
                  ...state,
                  totalTime: state.totalTime + 1,
                }
              : state
          )
        );
      }, 1000);

      // Clean up the interval on unmount
      return () => {
        clearInterval(timer);
      };
    }
  }, [element.active]);

  // Sync total active time duration and mode selection on mount
  useEffect(() => {
    if (element.active) {
      const time = getTaskSpecificTotalActiveTime(element.timestamps);
      setTaskStates(prevElements =>
        prevElements.map(state =>
          state.id === element.id
            ? {
                ...state,
                totalTime: time,
              }
            : state
        )
      );
    }

  }, []);


  // Toggles active state and adds new timestamp to track status changes
  const toggleActive = async () => {
    console.log(element)
    const newType = element.active ? 1 : 0;
    // Format current time to adhere to backend format
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS");
    const newTimestampData = {
      timestamp: now,
      task: element.id,
      type: newType
    }
    try {
      const newTimestampObject = await addTimestamp(newTimestampData);
      setTimestamps(prevTimestamps => [...prevTimestamps, newTimestampObject]);

      // Check if selectionMode is 1 and if there are any other active tasks
      if (selectionMode === 1 && !element.active) {
        const otherActiveTasks = taskStates.filter(task => task.active && task.id !== element.id);

        for (const task of otherActiveTasks) {
          const deactivationTimestampData = {
            timestamp: now,
            task: task.id,
            type: 1
          };

          try {
            const deactivationTimestampObject = await addTimestamp(deactivationTimestampData);

            setTimestamps(prevTimestamps => [...prevTimestamps,deactivationTimestampObject]);

            setTaskStates(prevStates =>
              prevStates.map(state =>
                state.id === task.id
                  ? ({
                      ...state,
                      active: false,
                      timestamps: [
                        ...state.timestamps,
                        { time: deactivationTimestampObject.timestamp, type: 1 }
                      ]
                    })
                  : state
              )
            );
          } catch (error) {
            console.error(`Error deactivating task ${task.id}:`, error);
            showSnackbar(`Failed to deactivate task "${task.name}"`, "error");
          }
        }
      }

      setTaskStates(prevElements =>
        prevElements.map(state =>
          state.id === element.id
            ? ({
                ...state,
                active: !state.active,
                timestamps: [
                  ...state.timestamps, 
                  { time: newTimestampData.timestamp, type: newTimestampData.type }
                ],
              })
            : state
        )
      );

      showSnackbar(`Task "${element.name}" ${newType === 1 ? "stopped" : "started"}`,"info");
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
      await deleteTask(element.id, timestamps);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== element.id));
      setTaskStates(prevTasks => prevTasks.filter(task => task.id !== element.id));
      setTimestamps(prevTimes => prevTimes.filter(time => time.task !== element.id))
      showSnackbar("Task deleted successfully.", "success");
    } catch (error) {
      console.error("Error deleting task:", error);
      showSnackbar("Error deleting task. Please try again.", "error");
    }
  };

  const exitEditMode = () => {
    setIsEditMode(false);
    setEditState({ name: element.name, tags: element.tags });
  };

  // Saves any edits to the task name or tags, updating the task state and database
  const handleConfirmClick = async () => {
    if (editState.name === "") {
      showSnackbar("Name cannot be empty.", "error");
      return;
    }
    // Only update if changes have been made while in edit mode
    if (editState.name !== element.name || editState.tags !== element.tags) {
      try {
        const updatedTaskData = {
          name: editState.name,
          tags: editState.tags,
        };
        const { updatedTaskObject, newTagObjects } = await updateTask(element.id, updatedTaskData, tags); 
        if (newTagObjects.length > 0) {
          setTags((prevTags) => [...prevTags, ...newTagObjects])
        }
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === element.id 
              ? updatedTaskObject 
              : task
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
  
  return (
    <>
        <table
          style={{
            backgroundColor: isEditMode
              ? darkMode
                ? "#2B2500"
                : "#F7E9AF"
              : darkMode
                ? "#333"
                : "#FFFFFF",
            color: darkMode ? "#FFFFFF" : "#000",
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
        <tbody>
          <tr>
            <th>Name:</th>
            <td>
              {isEditMode ? <TextField 
                              required
                              fullWidth 
                              label="New Name" 
                              value={editState.name}
                              onChange={(event) => {
                                setEditState(prev => ({...prev, name: event.target.value}))
                              }}
                            />
                          : <strong>{element.name}</strong>}
            </td>
          </tr>
          <tr>
            <th>Tags:</th>
            <td>
              {isEditMode 
                ? <AutoCompleteTagsForm
                    tags={tags}
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
                : element.tags.join(", ")}
            </td>
          </tr>
          <tr>
            <th>First Timestamp:</th>
            <td>{element.timestamps[0].time.slice(0, -4)}</td>
          </tr>
          <tr>
            <th>Last Timestamp:</th>
            <td>{element.timestamps[element.timestamps.length - 1].time.slice(0, -4)}</td>
          </tr>
          <tr>
            <th>Total Duration:</th>
            <td>{formatDuration(element.totalTime)}</td>
          </tr>
          <tr>
            <td colSpan="2">
              <Container className="d-flex space-evenly task-buttons">
                  {isEditMode 
                    ? <>
                        <Button style={{flexGrow: 2}} variant="contained" color="success" onClick={handleConfirmClick}>Confirm</Button>
                        <Button style={{flexGrow: 3}} variant="contained" color="error" onClick={exitEditMode}>Cancel</Button>
                        <Button 
                          style={{
                            flexGrow: 1,
                            backgroundColor: darkMode ? '#F5F5F5' : '#333',
                            color: darkMode ? '#000000' : '#FFFFFF',
                          }} 
                          variant="contained" 
                          onClick={handleDeleteClick}>
                            <DeleteIcon />
                          </Button>
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
                          color={element.active ? "success" : "error"}
                          onClick={toggleActive}
                          style={{flexGrow: 3}}
                        >
                          {element.active ? "Active" : "Inactive"}
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
