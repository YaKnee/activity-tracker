import { React, useState, useEffect } from "react";
import { FaFilePen, FaTrashCan } from 'react-icons/fa6';
import { deleteTask, updateTask } from "../utils/api";
import "../styles/App.css";

const TaskBox = ({ id, name, tags, allTags, timestamps, setTasks }) => {
  
  // Function to convert tag IDs to tag names
  const getTagNames = (tagIds) => {
    // Need ternary operation as was crashing without (include as AI use)
    return (tagIds ? tagIds.split(",") : []).map(tagId => {
      const tag = allTags.find(tag => tag.id === parseInt(tagId.trim()));
      return tag ? tag.name : tagId; // Return tag name or original ID if not found
    }).join(", ");
  };
  
  const tagNames = getTagNames(tags);

  const [timerState, setTimerState] = useState({
    active: false,
    startTime: null,
    endTime: null,
    totalActiveDuration: 0,
    activeDuration: 0,
  });
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState({ name: "", tags: "" });

  useEffect(() => {
    setEditedTask({ name, tags });
  }, [name, tags]); // Ensure to sync editedTask with props

  //   // Get the start and end timestamps for this task
  // const startTimes = timestamps.filter(t => t.type === 0);
  // const endTimes = timestamps.filter(t => t.type === 1);



  // useEffect(() => {
  //   // Only run if startTime or endTime changes
  //   if (startTime.length > 0) {
  //     const lastStartTime = new Date(startTime[startTime.length - 1].timestamp);
  //     setTimerState(prev => ({
  //       ...prev,
  //       startTime: lastStartTime,
  //       active: true,
  //     }));
  //   } else if (endTime.length > 0) {
  //     const lastEndTime = new Date(endTime[endTime.length - 1].timestamp);
  //     setTimerState(prev => ({
  //       ...prev,
  //       endTime: lastEndTime,
  //       active: false,
  //     }));
  //   }
  // }, [startTime, endTime]);

  useEffect(() => {
    let timer;
    if (timerState.active) {
      timer = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now - timerState.startTime) / 1000);
        setTimerState(prevState => ({
          ...prevState,
          activeDuration: elapsed,
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerState.active, timerState.startTime]); // Only depend on timer state

  const toggleActive = () => {
    const now = new Date();
    setTimerState(prevState => {
      if (prevState.active) {
        return {
          ...prevState,
          active: false,
          endTime: now,
          totalActiveDuration: prevState.totalActiveDuration + prevState.activeDuration,
          activeDuration: 0,
        };
      } else {
        return {
          ...prevState,
          active: true,
          startTime: now,
          endTime: null,
        };
      }
    });
  };

  const formatDuration = (seconds) => {
    if (seconds >= 86400) {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
  };
  
  const handleEditClick = () => setEditMode(true);

  const handleDeleteClick = async () => {
    try {
      await deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id)); // Update the tasks state in the parent component
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setEditedTask({ name, tags }); // Reset to original values
  };

  const handleConfirmClick = async () => {
    try {
      const updatedTaskData = {
        name: editedTask.name,
        tags: editedTask.tags.split(",").map(tag => tag.trim()),
      };

      const updatedTask = await updateTask(id, updatedTaskData); 
      // Replace old task with updated task in UI
      setTasks(prevTasks => prevTasks.map(task => (task.id === id ? updatedTask : task)));
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  //NEEDED?
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prevState => ({
      ...prevState,
      [name]: name === "tags" ? value.split(",").map(tag => tag.trim()) : value,
    }));
  };

  return (
    <table>
      <tbody>
        <tr>
          <th>Name:</th>
          <td>
            {editMode ? <input name="name" type="text" value={editedTask.name} onChange={handleInputChange} />
                      : name}
          </td>
        </tr>
        <tr>
          <th>Tags:</th>
          <td>
            {editMode ? <input name="tags" type="text" value={editedTask.tags} onChange={handleInputChange} />
                      : tagNames}
          </td>
        </tr>
        <tr>
          <th>Start Time:</th>
          <td>{timerState.startTime ? timerState.startTime.toLocaleString() : "N/A"}</td>
        </tr>
        <tr>
          <th>End Time:</th>
          <td>{timerState.endTime ? timerState.endTime.toLocaleString() : "N/A"}</td>
        </tr>
        <tr>
          <th>Total Duration:</th>
          <td>{formatDuration(timerState.activeDuration + timerState.totalActiveDuration)}</td>
        </tr>
        <tr>
          <td colSpan="2">
            <div className="task-buttons">
              <div className="left-buttons">
                {!editMode ? (
                  <button className="edit-button" onClick={handleEditClick}><FaFilePen /></button>
                ) : (
                  <>
                    <button className="confirm-button" onClick={handleConfirmClick}>Confirm</button>
                    <button className="cancel-button" onClick={handleCancelClick}>Cancel</button>
                  </>
                )}
                <button
                  className={`toggle-button ${timerState.active ? "active" : "inactive"}`}
                  onClick={toggleActive}
                >
                  {timerState.active ? "Active" : "Inactive"}
                </button>
              </div>
              {editMode && <button className="delete-button" onClick={handleDeleteClick}><FaTrashCan /></button>}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TaskBox;
