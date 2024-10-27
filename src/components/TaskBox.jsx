import { React, useState, useEffect } from "react";
import { FaFilePen, FaTrashCan } from 'react-icons/fa6';
import { deleteTask, updateTask, addTimestamp } from "../utils/api";
import { getTaskSpecificTotalActiveTime, parseTimestampAsUTC} from "../utils/apiDataManipulation";
import "../styles/App.css";

const initialTaskBoxState = (name, tags, timestamps) => {
  const tagNames = tags.map((tag) => tag.name).join(", ")
  const totalActiveTime = getTaskSpecificTotalActiveTime(timestamps);
  const lastTimestamp = timestamps.length > 0 ? timestamps[timestamps.length - 1] : null;
  const isActive = lastTimestamp ? lastTimestamp.type === 0 : false;

  const initialActiveDuration = isActive
    ? totalActiveTime + (new Date().getTime() - parseTimestampAsUTC(lastTimestamp.timestamp).getTime())
    : totalActiveTime;

  return {
    name,
    tags: tagNames,
    active: isActive,
    startTime: isActive ? parseTimestampAsUTC(lastTimestamp.timestamp) : null,
    endTime: isActive ? null : (lastTimestamp ? parseTimestampAsUTC(lastTimestamp.timestamp) : null),
    totalActiveDuration: initialActiveDuration,
  };
};

const TaskBox = ({ id, name, tags, allTags, timestamps, setTasks, setTags, setTimestamps }) => {
    
  const [taskBoxState, setTaskBoxState] = useState(() => initialTaskBoxState(name, tags, timestamps));
  const [isEditMode, setIsEditMode] = useState(false);
  const [editState, setEditState] = useState({ name: taskBoxState.name, tags: taskBoxState.tags });

  // Updates task tags in the display when tags change in the database
  useEffect(() => {
    setTaskBoxState(prevState => ({
      ...prevState,
      tags: tags.map((tag) => tag.name).join(", "),
   }))
  }, [tags, allTags])

  // Syncs edit state outside of edit mode
  useEffect(() => {
    setEditState({ name: taskBoxState.name, tags: taskBoxState.tags });
  }, [taskBoxState.name, taskBoxState.tags]);
  

  // Updates total active duration every second if the task is active
  useEffect(() => {
    let timer;
    if (taskBoxState.active) {
      timer = setInterval(() => {
        setTaskBoxState(prevState => ({
          ...prevState,
          totalActiveDuration: prevState.totalActiveDuration + 1000,
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [taskBoxState.active])

  // Toggles active state and adds new timestamp to track status changes
  const toggleActive = async () => {
    const now = new Date();
    const nowFormattedForPostRequest =
      now.toISOString().slice(0, 19).replace("T", " ") 
      + '.' + String(now.getMilliseconds()).padStart(3, '0');

    const newType = taskBoxState.active ? 1 : 0;
    try {
      const newTimestampObject = 
        await addTimestamp(nowFormattedForPostRequest, id, newType);
      
      setTimestamps(prevTimestamps => [...prevTimestamps, newTimestampObject]);

      setTaskBoxState(prevState => ({
        ...prevState,
        active: !prevState.active,
        startTime: newType === 1 ? null : now,
        endTime: newType === 1 ? now : null,
      }));
    } catch (error) {
      console.error("Error toggling task active state:", error);
    }
  };


  // Activates edit mode, allowing changes to task name and tags
  const handleEditClick = () => setIsEditMode(true);

  // Deletes task and timestamps related to task from list and database
  const handleDeleteClick = async () => {
    try {
      await deleteTask(id, timestamps);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Cancels editing, reverting to the current state values
  const handleCancelClick = () => {
    setIsEditMode(false);
    setEditState({ name: taskBoxState.name, tags: taskBoxState.tags });
  };

  // Saves any edits to the task name or tags, updating the task state and database
  const handleConfirmClick = async () => {
    // Only update if changes have been made while in edit mode
    if (editState.name !== taskBoxState.name || editState.tags !== taskBoxState.tags) {
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
        setTaskBoxState(prevState => ({
          ...prevState,
          name: updatedTaskObject.name,
          tags: editState.tags,
        }));
  
  
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } 
    handleCancelClick(); // Exit edit mode
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
  const formatDuration = (totalTime) => {
    const totalSeconds = Math.round(totalTime / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    return days > 0
      ? `${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };
  
  return (
    <table>
      <tbody>
        <tr>
          <th>Name:</th>
          <td>
            {isEditMode ? <input name="name" type="text" value={editState.name} onChange={handleInputChange} />
                        : taskBoxState.name}
          </td>
        </tr>
        <tr>
          <th>Tags:</th>
          <td>
            {isEditMode ? <input name="tags" type="text" value={editState.tags} onChange={handleInputChange} />
                        : taskBoxState.tags}
          </td>
        </tr>
        <tr>
          <th>Start Time:</th>
          <td>{taskBoxState.active ? taskBoxState.startTime.toLocaleString() : "N/A"}</td>
        </tr>
        <tr>
          <th>End Time:</th>
          <td>{taskBoxState.active ? "N/A" : (timestamps.length > 0 ? taskBoxState.endTime.toLocaleString() : "N/A")}</td>
        </tr>
        <tr>
          <th>Total Duration:</th>
          <td>{formatDuration(taskBoxState.totalActiveDuration)}</td>
        </tr>
        <tr>
          <td colSpan="2">
            <div className="task-buttons">
              <div className="left-buttons">
                {!isEditMode ? (
                  <button className="edit-button" onClick={handleEditClick}><FaFilePen /></button>
                ) : (
                  <>
                    <button className="confirm-button" onClick={handleConfirmClick}>Confirm</button>
                    <button className="cancel-button" onClick={handleCancelClick}>Cancel</button>
                  </>
                )}
                <button
                  className={`toggle-button ${taskBoxState.active ? "active" : "inactive"}`}
                  onClick={toggleActive}
                >
                  {taskBoxState.active ? "Active" : "Inactive"}
                </button>
              </div>
              {isEditMode && <button className="delete-button" onClick={handleDeleteClick}><FaTrashCan /></button>}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TaskBox;
