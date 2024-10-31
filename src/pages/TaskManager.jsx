import React, { useState, useEffect } from "react";
import AddTaskOrTagsForm from "../components/forms/AddTaskOrTagsForm";
import DeleteTagForm from "../components/forms/DeleteTagForm";
import FilterTagsForm from "../components/forms/FilterTagsForm";
import SortTasksForm from "../components/forms/SortTasksForm";
import TaskElement from "../components/TaskElement";
import "../styles/App.css";

function TaskManager({ tasks, setTasks, tags, setTags, timestamps, setTimestamps, taskStates, setTaskStates, showSnackbar }) {

  const [filteredTags, setFilteredTags] = useState([]);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [filteredAndSortedTasks, setFilteredAndSortedTasks] = useState([]);
 
  useEffect(() => {
    setSortedTasks(taskStates);
  }, [taskStates]);

  useEffect(() => {
    const updatedTasks = 
      // Default Mode: show all tasks if no filters are set
      filteredTags.length === 0 
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
          tags={tags} 
          setTasks={setTasks} 
          setTags={setTags} 
          setTimestamps={setTimestamps}
          showSnackbar={showSnackbar} 
        />

        <section>
          <div className="pt-2 mt-2 border-top d-flex justify-content-evenly">
            <SortTasksForm taskStates={taskStates} sortedTasks={sortedTasks} setSortedTasks={setSortedTasks} />
            <FilterTagsForm allTags={tags} setFilteredTags={setFilteredTags}/>
          </div>

          <div className="task-grid">
            { tasks.length < 1 ? (
              <h3>No tasks added to database yet.</h3> 
            ) : filteredAndSortedTasks.length < 1 ? (
              <h3>No tasks found with these filtered tags.</h3>
            ) : (
              filteredAndSortedTasks.map(task => 
                <div key={`container-${task.id}`} className="task-container">
                  <TaskElement
                    key={task.id}
                    taskState={task}
                    allTags={tags}
                    allTimestamps={timestamps}
                    setTasks={setTasks}
                    setTags={setTags}
                    setTimestamps={setTimestamps}
                    setTaskStates={setTaskStates}
                    showSnackbar={showSnackbar}
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
          taskStates={taskStates}
          setTaskStates={setTaskStates}
          showSnackbar={showSnackbar}
        />
    </>
  );
}

export default TaskManager;
