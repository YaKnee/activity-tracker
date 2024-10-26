import { React, useState, useEffect } from "react";
import { FaFilePen, FaTrashCan } from 'react-icons/fa6';
import { deleteTask, updateTask, addTimestamp } from "../utils/api";
import { getTagNames, getTotalActiveTimeOfTask, parseTimestampAsUTC} from "../utils/apiDataManipulation";
import "../styles/App.css";

const getInitialTaskState = (name, tags, allTags, timestamps) => {
  const tagNames = getTagNames(tags, allTags);
  const totalActiveTime = getTotalActiveTimeOfTask(timestamps);
  const lastTimestamp = timestamps.length > 0 ? timestamps[timestamps.length - 1] : null;
  const isActive = lastTimestamp ? lastTimestamp.type === 1 : false;

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

const TaskBox = ({ id, name, tags, allTags, timestamps, setTasks, setTimestamps }) => {
    
  const [taskState, setTaskState] = useState(() => getInitialTaskState(name, tags, allTags, timestamps));

  const [isEditMode, setIsEditMode] = useState(false);

  const [editState, setEditState] = useState({ name: taskState.name, tags: taskState.tags });

  useEffect(() => {
    setTaskState(getInitialTaskState(name, tags, allTags, timestamps));
  }, [name, tags, allTags, timestamps]);
  
  useEffect(() => {
    setEditState({ name: taskState.name, tags: taskState.tags });
  }, [taskState.name, taskState.tags]);


  // Update totalActiveDuration every second if the task is active
  useEffect(() => {
    let timer;
    if (taskState.active) {
      timer = setInterval(() => {
        setTaskState(prevState => ({
          ...prevState,
          totalActiveDuration: prevState.totalActiveDuration + 1000,
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [taskState.active])

  // Toggle active state and post timestamp dependant on active state
  const toggleActive = async () => {
    const now = new Date();
    const nowFormattedForPostRequest =
      now.toISOString().slice(0, 19).replace("T", " ") 
      + '.' + String(now.getMilliseconds()).padStart(3, '0');

    const newType = taskState.active ? 0 : 1;
    try {
      const newTimestampId = 
        await addTimestamp(nowFormattedForPostRequest, id, newType);
      
      const newTimestamp = {
        id: newTimestampId.id,
        timestamp: nowFormattedForPostRequest,
        task: id,
        type: newType,
      };
      setTimestamps(prevTimestamps => [...prevTimestamps, newTimestamp]);

      setTaskState(prevState => ({
        ...prevState,
        active: !prevState.active,
        startTime: newType === 1 ? now : prevState.startTime,
        endTime: newType === 0 ? now : null,
      }));
    } catch (error) {
      console.error("Error toggling task active state:", error);
    }
  };

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
  
  
  const handleEditClick = () => setIsEditMode(true);

  const handleDeleteClick = async () => {
    try {
      await deleteTask(id, timestamps);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setEditState({ name: taskState.name, tags: taskState.tags });
  };

  const handleConfirmClick = async () => {
    try {
      const updatedTaskData = {
        name: editState.name,
        tags: editState.tags,
      };

      const updatedTask = await updateTask(id, updatedTaskData, allTags); 
      setTasks(prevTasks => prevTasks.map(task => (task.id === id ? updatedTask : task)));
      setTaskState(prevState => ({
        ...prevState,
        name: updatedTask.name,
        tags: getTagNames(updatedTask.tags, allTags),
      }));
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  //NEEDED?
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditState(prevState => ({
      ...prevState,
      [name]: name === "tags" ? value.split(",").map(tag => tag.trim()).join(",") : value,
    }));
  };

  return (
    <table>
      <tbody>
        <tr>
          <th>Name:</th>
          <td>
            {isEditMode ? <input name="name" type="text" value={editState.name} onChange={handleInputChange} />
                        : taskState.name}
          </td>
        </tr>
        <tr>
          <th>Tags:</th>
          <td>
            {isEditMode ? <input name="tags" type="text" value={editState.tags} onChange={handleInputChange} />
                        : taskState.tags}
          </td>
        </tr>
        <tr>
          <th>Start Time:</th>
          <td>{taskState.active ? taskState.startTime.toLocaleString() : "N/A"}</td>
        </tr>
        <tr>
          <th>End Time:</th>
          <td>{taskState.active ? "N/A" : (timestamps.length > 0 ? taskState.endTime.toLocaleString() : "N/A")}</td>
        </tr>
        <tr>
          <th>Total Duration:</th>
          <td>{formatDuration(taskState.totalActiveDuration)}</td>
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
                  className={`toggle-button ${taskState.active ? "active" : "inactive"}`}
                  onClick={toggleActive}
                >
                  {taskState.active ? "Active" : "Inactive"}
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
