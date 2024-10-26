import { React, useState } from "react";
import { addTask, addTag, deleteTag} from "../utils/api"; //tag manipulation to be added here
import TaskBox from "../components/TaskBox";
import "../styles/App.css";

function Tasks({ tasks, setTasks, tags, setTags, timestamps, setTimestamps }) {
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  const handleAddTask = async () => {
    const newTaskData = {
      name: newTaskName,
      tags: selectedTagIds.join(","),
    };

    try {
      const newTask = await addTask(newTaskData, tags); 
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setNewTaskName("");
      setSelectedTagIds([]);
    } catch (error) {
      alert("Error adding task: ", error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskName || selectedTagIds.length === 0) {
      alert("Please enter a task name and select at least one tag.");
    } else {
      await handleAddTask();
    }
  };

  return (
    <>
      <section>
        <h3>Tasks:</h3>
        <div>
          <input
            type="text"
            placeholder="Enter new task name"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={selectedTagIds}
            onChange={(e) => setSelectedTagIds(e.target.value.split(",").map(id => id.trim()))}
          />
          <button onClick={handleSubmit}>Add Task</button>
        </div>
        <div className="task-grid">
          {tasks.length < 1 ? (
            <h3>No tasks yet.</h3>
          ) : (
            tasks.map((task) => (
              <div key={`container-${task.id}`} className="task-container">
                <TaskBox
                  key={task.id}
                  id={task.id}
                  name={task.name}
                  tags={task.tags}
                  allTags={tags}
                  timestamps={timestamps.filter((t) => t.task === task.id)}
                  setTasks={setTasks}
                  setTimestamps={setTimestamps}
                />
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}

export default Tasks;
