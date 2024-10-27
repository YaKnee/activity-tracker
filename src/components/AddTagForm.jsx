import React, { useRef, useState } from "react";
import { checkIfTagsExists } from "../utils/api";
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function AddTagForm({ tags, setTags, showSnackbar }) {
    const [inputValue, setInputValue] = useState("");
    const [tagChips, setTagChips] = useState([]);

    // Handles addition of tags to the database
    const handleAddTags = async () => {
        if (tagChips.length === 0){
            showSnackbar("You have yet to add a tag.", "warning");
            return;
        }
        const newTags = tagChips.join(",");

        try {
            const { existingTagIds, newTagObjects } = await checkIfTagsExists(newTags, tags);
            if (newTagObjects.length > 0) {
                setTags((prevTags) => [...prevTags, ...newTagObjects]); // Append new tags
                showSnackbar(
                    `New tag(s): "${newTagObjects.map(t => t.name).join(", ")}" were added to database.`, 
                    "success"
                );
            } else {
                showSnackbar("Tag already exists.", "error");
            }
            resetForm();
        } catch (error) {
            console.error("Error adding tags:", error);
            showSnackbar("An error occurred. Please try again.", "error");
        }
    };

    // Handles adding a tag chip when Enter or comma is pressed
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addTagChip(inputValue.trim());
        }
    };

    // Function to add a tag chip
    const addTagChip = (tag) => {
        if (tag && !tagChips.includes(tag)) {
            setTagChips((prevChips) => [...prevChips, tag]);
            setInputValue("");
        }
    };

    // Function to remove a tag chip
    const handleDeleteChip = (chipToDelete) => {
        setTagChips((prevChips) => prevChips.filter((chip) => chip !== chipToDelete));
    };

    // Reset input field and chips
    const resetForm = () => {
        setInputValue("");
        setTagChips([]);
    };


    return (
        <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Box display="flex" flexWrap="wrap" mb={2}>
                {tagChips.map((chip) => (
                    <Chip
                        key={chip}
                        label={chip}
                        onDelete={() => handleDeleteChip(chip)}
                        sx={{ margin: '2px' }}
                    />
                ))}
            </Box>
            <TextField
                value={inputValue}
                label={"Add Tag"}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Press Enter or ',' to link tags"
                variant="outlined"
                size="small"
            />
            <Button variant="contained" color="primary" onClick={handleAddTags} sx={{ marginTop: 2 }}>
                Add Tags
            </Button>
        </Box>
    );
}

export default AddTagForm;
