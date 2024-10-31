import React, { useEffect } from "react";
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";

function AutoCompleteTagsForm({
  tags,
  selectedTags,
  setSelectedTags,
  autoHighlight,
  autoComplete = false,
  freeSolo,
  fullWidth = false,
  label = "Select or Create Tags",
})
{

  useEffect(() => {
    setSelectedTags(selectedTags);
  }, [selectedTags]);

  return (
    <>
      <Autocomplete
        style={{ marginTop: "8px"}}
        multiple
        className="auto-tags"
        clearIcon={<CancelRoundedIcon />}
        clearText="Clear tags"
        autoComplete={autoComplete}
        autoHighlight={autoHighlight}
        clearOnEscape={true}
        freeSolo={freeSolo}
        fullWidth={fullWidth}
        options={tags
          .map((tag) => tag.name)
          .filter((tag) => !selectedTags.includes(tag))}
        noOptionsText="No tags found"
        value={selectedTags}

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
            label={label}
            placeholder="Type or select and press Enter"
            fullWidth
          />
        )}
      />
    </>
  );
}

export default AutoCompleteTagsForm;
