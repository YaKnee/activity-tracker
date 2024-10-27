import { React, useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Fab from '@mui/material/Fab';
import { FaTrashCan } from 'react-icons/fa6';
import { deleteTag } from '../utils/api';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function DeleteTagForm({ tasks, setTasks, tags, setTags }) {
  // Extract tag names with IDs for easier access
  const [selectedTags, setSelectedTags] = useState([]);
  
  const handleChange = (event) => {
    const { target: { value } } = event;
    setSelectedTags(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleDelete = async () => {
    try {
      for (const tag of selectedTags) {
        const tagObject = tags.find(t => t.name === tag);
        if (tagObject) {
          // Delete the tag by ID in the backend
          await deleteTag(tagObject.id, tasks);
  
          // Update tags state: filter out the deleted tag and create a new array
          setTags(prevTags => [...prevTags.filter(t => t.id !== tagObject.id)]);
  
          // Update tasks state: create a new array with updated tasks
          setTasks(prevTasks =>
            prevTasks.map(task => ({
              ...task,
              tags: task.tags
                .split(',')
                .filter(tagId => tagId !== String(tagObject.id))
                .join(','),
            }))
          );
            alert(`Tag ${tagObject.id} was deleted.`)
        }
      }
  
      // Reset selection after deletion
      setSelectedTags([]);
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedTags}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {tags.map(tag => (
            <MenuItem key={tag.id} value={tag.name}>
              <Checkbox checked={selectedTags.includes(tag.name)} />
              <ListItemText primary={tag.name} />
            </MenuItem>
          ))}
        </Select>
        <Fab color="secondary" aria-label="delete" onClick={handleDelete}>
          <FaTrashCan />
        </Fab>
      </FormControl>
    </div>
  );
}