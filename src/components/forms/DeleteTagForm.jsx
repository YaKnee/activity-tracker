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

export default function DeleteTagForm({ tasks, setTasks, tags, setTags, showSnackbar }) {
  const [selectedTags, setSelectedTags] = useState([]);

  const handleDeleteTag = async () => {
    if (selectedTags.length === 0) {
      showSnackbar("No tags selected for deletion", "warning");
      return;
    }

    try {
      for (const tag of selectedTags) {
        const tagObject = tags.find(t => t.name === tag);
        if (tagObject) {
          await deleteTag(tagObject.id, tasks);
          setTags(prevTags => prevTags.filter(t => t.id !== tagObject.id));
          setTasks(prevTasks =>
            prevTasks.map(task => ({
              ...task,
              tags: task.tags
                .split(',')
                .filter(tagId => tagId !== String(tagObject.id))
                .join(','),
            }))
          );
        }
      }
      showSnackbar("Selected tags were deleted", "success");
      setSelectedTags([]);
    } catch (error) {
      console.error("Error deleting tag:", error);
      showSnackbar("Error deleting tags. Please try again", "error");
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col sm={10}>
          <AutoCompleteTagsForm 
            tags={tags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            autoHighlight={true}
            freeSolo={false}
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
