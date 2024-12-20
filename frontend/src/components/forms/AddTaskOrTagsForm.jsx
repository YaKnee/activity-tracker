import { useState} from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import AutoCompleteTagsForm from "./AutoCompleteTagsForm";
import { addTask, checkIfTagsExists } from "../../utils/api";

function AddTaskOrTagsForm({ setTasks, tags, setTags, setTimestamps, showSnackbar}) {

  const [newTaskName, setNewTaskName] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // Handles the addition of a new task
  const handleAddTask = async () => {
    const newTaskData = {
      name: newTaskName,
      tags: selectedTags,
    };
    try {
      const { newTaskObject, newTagObjects, newTimestampObject } = await addTask(newTaskData, tags);
      setTasks((prevTasks) => [...prevTasks, newTaskObject]);
      setTimestamps((prevTimestamps) => [...prevTimestamps, newTimestampObject]);

      if (newTagObjects.length > 0) {
        setTags((prevTags) => [...prevTags, ...newTagObjects]);
        showSnackbar(`Task added successfully.\n
          New tag(s): ${newTagObjects.map(t =>"\"" + t.name + "\"").join(", ")} 
          were added to the database.`, "success");
      } else {
        showSnackbar("Task added successfully.", "success");
      }

      resetForm();
    } catch (error) {
      console.error("Error adding task:", error);
      showSnackbar("Error adding task.", "error");
    }
  };

    // Handles adding tags only
    const handleAddTagsOnly = async () => {
      try {
        const { existingTagIds, newTagObjects } = await checkIfTagsExists(selectedTags, tags);
        if (newTagObjects.length > 0) {
          setTags((prevTags) => [...prevTags, ...newTagObjects]);
          showSnackbar(`New tag(s): ${newTagObjects.map(t =>"\"" + t.name + "\"").join(", ")} were added to the database.`, "success");
        } else {
          showSnackbar("Tag(s) already exists.", "error");
        }
        resetForm();
      } catch (error) {
        console.error("Error adding tags:", error);
        showSnackbar("An error occurred. Please try again.", "error");
      }
    };

  // Resets the form fields
  const resetForm = () => {
    setNewTaskName("");
    setSelectedTags([]);
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTaskName && selectedTags.length > 0) {
      // If both task name and tags are filled, submit as a task
      await handleAddTask();
    } else if (!newTaskName && selectedTags.length > 0) {
      // If only tags are filled, submit tags only
      await handleAddTagsOnly();
    } else if (newTaskName && selectedTags.length === 0) {
      showSnackbar("Please enter at least one tag for this task", "warning");
    } else {
      showSnackbar("Please enter a task name or create at least one tag", "warning");
    }
  };

  return (
    <>
    <Container fluid="small" as="section" >
      <Form onSubmit={handleSubmit} className="mt-3">

          <Row>
            <Col sm={5} className="mt-3">
              <TextField
                label="Enter new task name"
                variant="outlined"
                fullWidth
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
              />
            </Col>
            <Col sm={5} className="mt-3">
              <AutoCompleteTagsForm 
                tags={tags}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                autoHighlight={false}
                freeSolo={true}
              />
            </Col>
            <Col sm={1}>
              <Button 
                variant="contained"
                color="primary"
                type="submit"
                startIcon={newTaskName || selectedTags.length > 0 ? <AddCircleOutlineIcon /> : null}
                className="my-4"
              >
                {newTaskName ? "Task" : selectedTags.length > 0 ? "Tags" : <AddCircleOutlineIcon />}
              </Button>
            </Col>
          </Row>


      </Form>
    </Container>
    </>
  );
}

export default AddTaskOrTagsForm;
