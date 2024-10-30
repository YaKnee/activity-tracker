import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import Container from 'react-bootstrap/Container';
import dayjs from "dayjs";
import { deleteTask, updateTask, addTimestamp } from "../utils/api";
import { getTagNames, getTaskSpecificTotalActiveTime} from "../utils/apiDataManipulation";
import "../styles/App.css";

const initialTaskElementState = (name, tags, timestamps, allTags) => {
  const tagNames = getTagNames(tags, allTags)
  const firstTimestamp = timestamps[0];
  const lastTimestamp = timestamps[timestamps.length - 1];
  const isActive = lastTimestamp.type === 0;
  const totalActiveTime = getTaskSpecificTotalActiveTime(timestamps);

  return {
    name,
    tags: tagNames,
    active: isActive,
    firstTimestamp: dayjs(firstTimestamp.timestamp).format("YYYY-MM-DD HH:mm:ss"),
    latestTimestamp: dayjs(lastTimestamp.timestamp).format("YYYY-MM-DD HH:mm:ss"),
    totalActiveDuration: totalActiveTime,
  };
};

const TaskElement = ({ id, name, tags, allTags, timestamps, setTasks, setTags, setTimestamps, taskStates, setTaskStates, showSnackbar }) => {
  
  //const [localTimeStamps, setLocalTimeStamps] = useState([])
  const [taskElementState, setTaskElementState] = useState(() => initialTaskElementState(name, tags, timestamps, allTags));
  const [isEditMode, setIsEditMode] = useState(false);
  const [editState, setEditState] = useState({ name: taskElementState.name, tags: taskElementState.tags });


  // Update parent task states manager whenever something changes here
  useEffect(() => {
    setTaskStates((prevStates) => {
      const index = prevStates.findIndex((state) => state.id === id);
      if (index === -1) {
        return [...prevStates, { id, ...taskElementState }];
      }
      return [
        ...prevStates.slice(0, index),
        { ...prevStates[index], ...taskElementState },
        ...prevStates.slice(index + 1),
      ];
    });
  }, [taskElementState.active, taskElementState.tags, taskElementState.name]);

  // Updates tags in the UI when they change in the database
  useEffect(() => {
    setTaskElementState(prevState => ({
      ...prevState,
      tags: getTagNames(tags, allTags),
   }))
  }, [allTags])

  // Syncs edit state outside of edit mode
  useEffect(() => {
    setEditState({ name: taskElementState.name, tags: taskElementState.tags });
  }, [taskElementState.name, taskElementState.tags]);
  

  // Updates total active duration every second if the task is active
  useEffect(() => {
    let timer;
    if (taskElementState.active) {
      timer = setInterval(() => {
        setTaskElementState(prevState => ({
          ...prevState,
          totalActiveDuration: prevState.totalActiveDuration + 1,
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [taskElementState.active])

  // Toggles active state and adds new timestamp to track status changes
  const toggleActive = async () => {
    const newType = taskElementState.active ? 1 : 0;
    // Format current time to adhere to backend format
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss:SSS");
    const newTimestampData = {
      timestamp: now,
      task: id,
      type: newType
    }
    try {
      const newTimestampObject = await addTimestamp(newTimestampData);
      setTimestamps(prevTimestamps => [...prevTimestamps, newTimestampObject]);

      setTaskElementState(prevState => ({
        ...prevState,
        active: !prevState.active,
        latestTimestamp: dayjs(now).format("YYYY-MM-DD HH:mm:ss"),
      }));
      showSnackbar(
        `Task ${id} ${newType === 1 ? "stopped" : "started"}`,
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
      await deleteTask(id, timestamps);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      showSnackbar("Task deleted successfully.", "success");
    } catch (error) {
      console.error("Error deleting task:", error);
      showSnackbar("Error deleting task. Please try again.", "error");
    }
  };

  // Cancels editing, reverting to the current state values
  const exitEditMode = () => {
    setIsEditMode(false);
    setEditState({ name: taskElementState.name, tags: taskElementState.tags });
  };

  // Saves any edits to the task name or tags, updating the task state and database
  const handleConfirmClick = async () => {
    // Only update if changes have been made while in edit mode
    if (editState.name !== taskElementState.name || editState.tags !== taskElementState.tags) {
      try {
        const updatedTaskData = {
          name: editState.name,
          tags: editState.tags,
        };
        const { updatedTaskObject, newTagObjects } = await updateTask(id, updatedTaskData, allTags); 
        if (newTagObjects.length > 0) {
          setTags((prevTags) => [...prevTags, ...newTagObjects])
        }
        setTasks(prevTasks => prevTasks.map(task => (task.id === id ? updatedTaskObject : task)));
        setTaskElementState(prevState => ({
          ...prevState,
          name: updatedTaskObject.name,
          tags: editState.tags,
        }));
        showSnackbar("Task updated successfully.", "success");
      } catch (error) {
        console.error("Error updating task:", error);
        showSnackbar("Error updating task. Please try again.", "error");
      }
    } 
    exitEditMode();
  };

  // Updates edit state with changes from input fields in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditState(prevState => ({
      ...prevState,
      [name]: value,
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
      <table>
        <tbody>
          <tr>
            <th>Name:</th>
            <td>
              {isEditMode ? <input name="name" type="text" value={editState.name} onChange={handleInputChange} />
                          : <strong>{taskElementState.name}</strong>}
            </td>
          </tr>
          <tr>
            <th>Tags:</th>
            <td>
              {isEditMode ? <input name="tags" type="text" value={editState.tags} onChange={handleInputChange} />
                          : taskElementState.tags}
            </td>
          </tr>
          <tr>
            <th>Created:</th>
            <td>{taskElementState.firstTimestamp}</td>
          </tr>
          <tr>
            <th>Last Toggle:</th>
            <td>{taskElementState.latestTimestamp}</td>
          </tr>
          <tr>
            <th>Total Duration:</th>
            <td>{formatDuration(taskElementState.totalActiveDuration)}</td>
          </tr>
          <tr>
            <td colSpan="2">
              <Container className="task-buttons">
                  {isEditMode 
                    ? <>
                        <Button variant="contained" color="success" onClick={handleConfirmClick}>Confirm</Button>
                        <Button variant="contained" color="error" onClick={exitEditMode}>Cancel</Button>
                        <Button className="delete-button" onClick={handleDeleteClick}><DeleteIcon /></Button>
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
                          color={taskElementState.active ? "success" : "error"}
                          onClick={toggleActive}
                          style={{flexGrow: 3}}
                        >
                          {taskElementState.active ? "Active" : "Inactive"}
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
