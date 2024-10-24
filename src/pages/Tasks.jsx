import { React, useState } from "react";
import { addTask, addTag, deleteTag} from "../utils/api";
// import { Select, MenuItem, Checkbox, ListItemText, TextField, Button, 
//   FormControl, InputLabel, OutlinedInput } from "@mui/material";
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import TaskBox from "../components/TaskBox";
import "../styles/App.css";

function Tasks({ tasks, setTasks, tags, setTags, timestamps, setTimestamps }) {
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  const handleAddTask = async () => {
    const newTaskData = {
      name: newTaskName,
      tags: selectedTagIds.join(","), // Convert array of tags to a comma-separated string
    };

    try {
      const newTask = await addTask(newTaskData); 
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setNewTaskName(""); // Clear input field
      setSelectedTagIds([]); // Clear selected tags
    } catch (error) {
      alert("Error adding task: ", error);
    }
  };

  // const addTag = async (id, name, newTags) => {
  //   const response = await fetch(`${API}/tags`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ name: newTags }),
  //   });
  //   const newTag = await response.json();
  //   setTags(prevTags => [...prevTags, newTag]);  // Add newly created tag to state
  //   return newTag.id;
  // }

  
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
                    {/* <Autocomplete
                      multiple
                      id="tags-filled"
                      options={tags.map((tag) => tag.name)}
                      freeSolo
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return (
                            <Chip variant="outlined" label={option} key={key} {...tagProps} />
                          );
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="filled"
                          label="Tags"
                          placeholder="Select tags or type them in and press enter"
                        />
                      )}
                    /> */}
          <button onClick={handleSubmit}>Add Task</button>
        </div>
        <div className="task-grid">
          {tasks.map((task) => {
            return (
              <div key={`container-${task.id}`} className="task-container">
                <TaskBox
                  key={task.id}
                  id={task.id}
                  name={task.name}
                  tags={task.tags}
                  allTags={tags}
                  timestamps={timestamps.filter((t) => t.task === task.id)}
                  setTasks={setTasks}
                />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default Tasks;
