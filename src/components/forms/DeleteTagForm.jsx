import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import AutoCompleteTagsForm from './AutoCompleteTagsForm';
import { deleteTags } from '../../utils/api';

export default function DeleteTagForm({ tasks, setTasks, tags, setTags, taskStates, setTaskStates, showSnackbar }) {
  const [selectedTags, setSelectedTags] = useState([]);

  const handleDeleteTag = async () => {
    if (selectedTags.length === 0) {
      showSnackbar("No tags selected for deletion", "warning");
      return;
    }

    try {
      const tagsToBeDeleted = tags
        .filter(tag => selectedTags.includes(tag.name))
        .map(tag => tag.id);

      await deleteTags(tagsToBeDeleted, tasks);

      const updatedTags = tags.filter(tag => !tagsToBeDeleted.includes(tag.id));

      const updatedTasks = tasks.map(task => ({
        ...task,
        tags: task.tags
          .split(',')
          .filter(id => !tagsToBeDeleted.includes(Number(id)))
          .join(','),
      }));
      
      setTags(updatedTags);
      setTasks(updatedTasks);
      showSnackbar(`Tag(s): "${selectedTags.join(", ")}" were deleted`, "success");
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
