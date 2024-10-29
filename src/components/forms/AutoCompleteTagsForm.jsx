import React, { useEffect } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import Chip from "@mui/material/Chip";
import TextField from '@mui/material/TextField';

function AutoCompleteTagsForm({ tags, selectedTags, setSelectedTags, autoHighlight, freeSolo, fullWidth = false }) {

    useEffect(() => {
        setSelectedTags(selectedTags);
    }, [selectedTags]);

  return (
    <>
      <Autocomplete
        style={{marginTop: "8px"}}
        multiple
        className="auto-tags"
        options={tags
          .map((tag) => tag.name)
          .filter((tag) => !selectedTags.includes(tag))}
        value={selectedTags}
        freeSolo={freeSolo}
        fullWidth={fullWidth}
        autoHighlight={autoHighlight}
        onChange={(event, newValue) => {
          setSelectedTags(newValue);
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const tagProps = getTagProps({ index });
            return (
              <Chip
                variant="outlined"
                label={option}
                {...tagProps}
                key={option}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Select tags"
            placeholder="Type or select and press Enter"
            fullWidth
          />
        )}
      />
    </>
  );
}

export default AutoCompleteTagsForm;
