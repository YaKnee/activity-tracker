import { useState, useEffect } from "react";

import AddTaskOrTagsForm from "../components/forms/AddTaskOrTagsForm";
import DeleteTagForm from "../components/forms/DeleteTagForm";
import FilterTagsForm from "../components/forms/FilterTagsForm";
import SortTasksForm from "../components/forms/SortTasksForm";
import TaskElement from "../components/TaskElement";
import "../styles/App.css";

function TaskManager({tasks, setTasks, tags, setTags, timestamps, setTimestamps, taskStates, setTaskStates, showSnackbar, darkMode, selectionMode}) {

  const [filteredTags, setFilteredTags] = useState([]);
  const [sortedTasks, setSortedTasks] = useState(taskStates);
  const [filteredAndSortedTasks, setFilteredAndSortedTasks] = useState([]);
 
  useEffect(() => {
    const updatedTasks = filteredTags.length === 0 
        ? sortedTasks // No filter
        : filteredTags.includes("noTags")
          // Filter for tasks without tags
          ? sortedTasks.filter(task => task.tags.length === 0) 
          // Filter for tasks that have all the selected tags
          : sortedTasks.filter(task => {
              return (
                filteredTags.every(tag => task.tags.includes(tag)) && 
                filteredTags.length === task.tags.length
              );
            });
  
    setFilteredAndSortedTasks(updatedTasks);
  }, [sortedTasks, filteredTags]);

  return (
    <>
      <h1>Manager:</h1>

        <AddTaskOrTagsForm 
          setTasks={setTasks} 
          tags={tags} 
          setTags={setTags} 
          setTimestamps={setTimestamps}
          showSnackbar={showSnackbar}
        />

        <section>
          <div className="pt-2 mt-2 border-top d-flex justify-content-evenly">
            <SortTasksForm taskStates={taskStates} sortedTasks={sortedTasks} setSortedTasks={setSortedTasks} />
            <FilterTagsForm allTags={tags} setFilteredTags={setFilteredTags}/>
          </div>

          <div className="task-grid" style={{backgroundColor: darkMode ? "#11111E" : "#767676"}}>
            { tasks.length < 1 ? (
              <h3>No tasks added to database yet.</h3> 
            ) : filteredAndSortedTasks.length < 1 ? (
              <h3>No tasks found with these filtered tags.</h3>
            ) : (
              filteredAndSortedTasks.map(task => 
                <div 
                key={`container-${task.id}`} 
                className="task-container" 
                style={{backgroundColor: darkMode ? "#000028" : "#f9f9f9"}}>
                  <TaskElement
                    key={task.id}
                    element={task}
                    taskStates={taskStates}
                    setTaskStates={setTaskStates}
                    setTasks={setTasks}
                    tags={tags}
                    setTags={setTags}
                    timestamps={timestamps}
                    setTimestamps={setTimestamps}
                    showSnackbar={showSnackbar}
                    darkMode={darkMode}
                    selectionMode={selectionMode}
                  />
                </div>
              )
            )}
          </div>
        </section>


        <DeleteTagForm 
          tasks={tasks}
          setTasks={setTasks}
          tags={tags}
          setTags={setTags}
          showSnackbar={showSnackbar}
        />
    </>
  );
}

export default TaskManager;
