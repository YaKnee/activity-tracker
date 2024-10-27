import { React, useState } from "react";
import { addTask, addTag, deleteTag} from "../utils/api";
import { getTagNames } from "../utils/apiDataManipulation";
// import { Select, MenuItem, Checkbox, ListItemText, TextField, Button, 
//   FormControl, InputLabel, OutlinedInput } from "@mui/material";
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import TaskBox from "../components/TaskBox";
import DeleteTagForm from "../components/DeleteTagForm";
import "../styles/App.css";

function Tasks({ tasks, setTasks, tags, setTags, timestamps, setTimestamps }) {
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const handleAddTask = async () => {
    const newTaskData = {
      name: newTaskName,
      tags: selectedTags.split(",").map(id => id.trim()).join(","),
    };
    try {
      const { newTaskObject, newTagObjects } = await addTask(newTaskData, tags);
      setTasks((prevTasks) => [...prevTasks, newTaskObject]);
      if (newTagObjects.length > 0) {
       setTags((prevTags) => [...prevTags, ...newTagObjects]);
      }
      setNewTaskName("");
      setSelectedTags([]);
    } catch (error) {
      alert("Error adding task: ", error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskName || selectedTags.length === 0) {
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
            value={selectedTags}
            onChange={(e) => setSelectedTags(e.target.value)}
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
        <div>
          <h3>Delete Tags:</h3>
          <DeleteTagForm tasks={tasks} setTasks={setTasks} tags={tags} setTags={setTags}/>
        </div>
        <div className="task-grid">
          {tasks.length < 1 ? (
            <h3>No tasks yet.</h3>
          ) : (
            tasks.map(task =>
              <div key={`container-${task.id}`} className="task-container">
                <TaskBox
                  key={task.id}
                  id={task.id}
                  name={task.name}
                  tags={getTagNames(task.tags, tags)}
                  allTags={tags}
                  timestamps={timestamps.filter((t) => t.task === task.id)}
                  setTasks={setTasks}
                  setTags={setTags}
                  setTimestamps={setTimestamps}
                />
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}

export default Tasks;
