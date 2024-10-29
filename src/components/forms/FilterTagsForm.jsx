import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FilterListIcon from "@mui/icons-material/FilterList";
import AutoCompleteTagsForm from "./AutoCompleteTagsForm";

function FilterTagsForm({ allTags, setFilteredTags }) {
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [lastConfirmedTags, setLastConfirmedTags] = useState([]);
  const [hasFiltered, setHasFiltered] = useState(false);

  const handleOpen = () => {
    setIsFiltering(true);
  };
  const handleClose = () => {
    setSelectedTags(lastConfirmedTags)
    setIsFiltering(false);
  };
  const handleClear = () => {
    setFilteredTags([])
    setSelectedTags([]);
    setLastConfirmedTags([]);
    setHasFiltered(false);
    handleClose();
  }
  const handleSubmit = () => {
    if (selectedTags.length > 0) {
      // Set the filteredTags to the selected tag IDs
      setFilteredTags(selectedTags.map(tag => allTags.find(t => t.name === tag).id));
      // Set lastConfirmedTags to the selected tag names
      setLastConfirmedTags(selectedTags.map(tag => allTags.find(t => t.name === tag).name));
      setHasFiltered(true);
    } else {
      // If no tags selected, filter for tasks without tags
      setSelectedTags([])
      setFilteredTags([null]);
      setHasFiltered(true)
    }
    setIsFiltering(false);
  };


  return (
    <>
      <Button
        variant="contained"
        color={hasFiltered ? "warning" : "primary"}
        startIcon={<FilterListIcon />}
        onClick={handleOpen}
        style={{ marginTop: "10px" }}
      >
        {hasFiltered ? "Filtered" : "Filter"}
      </Button>
      <Dialog open={isFiltering} onClose={handleClose}>
        <DialogTitle>Filter tasks by tags</DialogTitle>
        <DialogContent>
          <DialogContentText className="mb-4">
            Only tasks that have all of these selected tags will be displayed.
            If you press "Filter" without selecting any tags,
            all tasks without tags will be displayed. Pressing "Clear Filters" 
            will reset these filters and show all existing tasks again.
          </DialogContentText>
          <AutoCompleteTagsForm 
                tags={allTags}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                autoHighlight={true}
                freeSolo={false}
              />
        </DialogContent>
        <DialogActions style={{justifyContent: "space-between"}}>
          <Button variant="contained" className="p-1" onClick={handleClear}>Clear Filters</Button>
          <div>
            <Button variant="contained" className="p-1 mx-1" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="success" className="p-1" onClick={handleSubmit}>Filter</Button>
          </div>

        </DialogActions>
      </Dialog>
    </>
  );
}

export default FilterTagsForm;
