import React, { useState } from "react";
import AddTaskOrTagsForm from "../components/forms/AddTaskOrTagsForm";
import DeleteTagForm from "../components/forms/DeleteTagForm";
import FilterTagsForm from "../components/forms/FilterTagsForm";
import TaskElement from "../components/TaskElement";
import "../styles/App.css";

function TasksView({ tasks, setTasks, tags, setTags, timestamps, setTimestamps, showSnackbar }) {

  const [filteredTags, setFilteredTags] = useState([]);

  const getFilteredTasks = () => {
    if (filteredTags.length > 0 && filteredTags[0] !== null) {
      return tasks.filter(task => {
        const taskTagIds = task.tags.split(",").map(Number);
        // Check if all selected tags are present in task's tags
        return filteredTags.every(tagId => taskTagIds.includes(tagId))
          && filteredTags.length === taskTagIds.length; // Tackles issue when only 1 tag was chosen
      });
    } else if (filteredTags.length === 1 && filteredTags[0] === null) {
      // If the only tag is null, show tasks without tags
      return tasks.filter(task => task.tags === "");
    } else {
      // If no filters are applied, show all tasks
      return tasks;
    }
  };
  

  const filteredTasks = getFilteredTasks();

  return (
    <>
      <section>
        <h3>Tasks:</h3>
        <div>
          <AddTaskOrTagsForm 
            tags={tags} 
            setTasks={setTasks} 
            setTags={setTags} 
            setTimestamps={setTimestamps}
            showSnackbar={showSnackbar} 
          />
        </div>

        <FilterTagsForm allTags={tags} setFilteredTags={setFilteredTags}/>
        <div className="task-grid">
          { tasks.length < 1 ? (
            <h3>No tasks added to database yet.</h3> 
          ) : filteredTasks.length < 1 ? (
            <h3>No tasks found with all of these tags.</h3>
          ) : (
            filteredTasks.map(task => 
              <div key={`container-${task.id}`} className="task-container">
                <TaskElement
                  key={task.id}
                  id={task.id}
                  name={task.name}
                  tags={task.tags}
                  allTags={tags}
                  timestamps={timestamps
                    .filter(t => t.task === task.id)
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))}
                  setTasks={setTasks}
                  setTags={setTags}
                  setTimestamps={setTimestamps}
                  showSnackbar={showSnackbar}
                />
              </div>
            )
          )}
        </div>

        <DeleteTagForm tasks={tasks} setTasks={setTasks} tags={tags} setTags={setTags} showSnackbar={showSnackbar} />
      </section>
    </>
  );
}

export default TasksView;
