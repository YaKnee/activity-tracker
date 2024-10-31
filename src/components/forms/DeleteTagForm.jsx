import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Autocomplete from '@mui/material/Autocomplete';
import { Chip, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import AutoCompleteTagsForm from './AutoCompleteTagsForm';
import { deleteTag } from '../../utils/api';

export default function DeleteTagForm({ tasks, setTasks, tags, setTags, taskStates, setTaskStates, showSnackbar }) {
  const [selectedTags, setSelectedTags] = useState([]);

  const handleDeleteTag = async () => {
    if (selectedTags.length === 0) {
      showSnackbar("No tags selected for deletion", "warning");
      return;
    }

    try {
      // Store successful deletion results
      const deletedTags = [];

      // Attempt to delete each selected tag
      for (const tag of selectedTags) {
        const tagObject = tags.find(t => t.name === tag);
        if (tagObject) {
          await deleteTag(tagObject.id, tasks);
          deletedTags.push(tagObject.id);
        }
      }

      const updatedTags = tags.filter(t => !deletedTags.includes(t.id));

      const updatedTasks = tasks.map(task => ({
        ...task,
        tags: task.tags
          .split(',')
          .filter(tagId => !deletedTags.includes(Number(tagId)))
          .join(','),
      }));

      const updatedTaskStates = taskStates.map(state => ({
        ...state,
        tags: state.tags.filter(t => !selectedTags.includes(t))
      }));

      setTags(updatedTags);
      setTasks(updatedTasks);
      setTaskStates(updatedTaskStates);

      showSnackbar("Selected tags were deleted", "success");
      setSelectedTags([]); // Clear the selection after deletion
    } catch (error) {
      console.error("Error deleting tag:", error);
      showSnackbar("Error deleting tags. Please try again", "error");
    }
  };

  return (
    <Container fluid as="section">
      <Row>
        <Col sm={10}>
          <AutoCompleteTagsForm 
            tags={tags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            autoHighlight={true}
            autoComplete={true}
            freeSolo={false}
            label="Select Tags to Delete"
           />
        </Col>
        <Col sm={2}>
          <Button variant="contained"
                  color='primary' 
                  startIcon={<DeleteIcon />} 
                  onClick={handleDeleteTag}
          >
              Tags
          </Button>
        </Col>
      </Row>
    </Container>

  );
}
