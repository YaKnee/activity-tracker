import { useEffect, useState }from "react";

import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowCircleUpTwoToneIcon from "@mui/icons-material/ArrowCircleUpTwoTone";
import ArrowCircleDownTwoToneIcon from "@mui/icons-material/ArrowCircleDownTwoTone";

const SortTasksForm = ({ taskStates, sortedTasks, setSortedTasks }) => {

  const [sortingCriteria, setSortingCriteria] = useState({ value: "id", order: "ascending"});
  const [isSorting, setIsSorting] = useState(false);

  // Opens sorting dialog
  const handleOpen = () => setIsSorting(true);
  // Closes sorting dialog
  const handleClose = () => setIsSorting(false);

  // Sorts tasks when either sorting criteria changes
  useEffect(() => {
    handleSort();
  }, [sortingCriteria, sortedTasks]);

  // Updates criteria value based on user selection
  const handleChangeValue = (event) => {
    setSortingCriteria((prevState) => ({
      ...prevState,
      value: event.target.value,
    }));
  };
  
  // Updates sorting order
  const handleChangeOrder = () => {
    setSortingCriteria((prevState) => ({
      ...prevState,
      order: prevState.order === "ascending" ? "descending" : "ascending",
    }));
  };

  // Resets sorting criteria and closes dialog
  const handleRevert = () => {
    setSortingCriteria({ value: "id", order: "ascending"});
    handleClose();
  };

  // Handles sorting logic based on criteria
  const handleSort = () => {
    // Create shallow copy of states. Breaks if no copy
    const taskStatesCopy = [...taskStates];
    const { value, order } = sortingCriteria;

    taskStatesCopy.sort((a, b) => {
      let comparison = 0;

      switch (value) {
        case "id":
          comparison = a.id - b.id;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "tags":
          // Handle empty tags first
          if (a.tags.length === 0 && b.tags.length > 0) return order === "ascending" ? -1 : 1;
          if (a.tags.length > 0 && b.tags.length === 0) return order === "ascending" ? 1 : -1;

          // Compare tags one by one
          for (let i = 0; i < Math.min(a.tags.length, b.tags.length); i++) {
            const comparison = a.tags[i].localeCompare(b.tags[i]);
            if (comparison !== 0) return order === "ascending" ? comparison : -comparison;
          }
          // If all compared tags are equal, sort by number of tags
          comparison = a.tags.length - b.tags.length;
          break;
        case "active":
          comparison = (a.active === b.active) ? 0 : (a.active ? -1 : 1);
          break;
        case "totalTime":
          comparison = a.totalTime - b.totalTime;
          break;
        default:
          return 0;
      }

      // Apply order to comparison result
      return order === "ascending" ? comparison : -comparison;
    });

    setSortedTasks(taskStatesCopy);
  };


  return (
    <>
      <Button 
        variant="contained" 
        color={sortingCriteria.value !== "id" ? "warning" : "primary"}
        startIcon={<SwapVertIcon />}
        onClick={handleOpen}
      >
        Sort
      </Button>
      <Dialog open={isSorting} onClose={handleClose}>
        <DialogTitle>Sort tasks</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose which element you wish to sort by, and in what order. 
            Clicking "Revert" will revert the task order back to time of creation in ascending order.
          </DialogContentText>


          <Stack direction={{xs: "column", sm: "row"}} spacing={{xs: 4}}>

            <FormControl required variant="filled" fullWidth>
              <Select
                fullWidth
                labelId="ValueSelectLabel"
                id="ValueSelect"
                value={sortingCriteria.value}
                onChange={handleChangeValue}
                label="Value"
                //IconComponent={ListIcon}
              >
                <MenuItem value={"id"}>Created</MenuItem>
                <MenuItem value={"name"}>Name</MenuItem>
                <MenuItem value={"tags"}>Tags</MenuItem>
                <MenuItem value={"active"}>Active</MenuItem>
                <MenuItem value={"totalTime"}>Total Time Active</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              className="px-4"
              variant="contained" 
              color="primary"
              onClick={handleChangeOrder} 
              startIcon={sortingCriteria.order === "descending" ? <ArrowCircleDownTwoToneIcon/> : <ArrowCircleUpTwoToneIcon/>}>
              {sortingCriteria.order === "descending" ? "Descending" : "Ascending"}
            </Button>
          </Stack>

        </DialogContent>
        <DialogActions style={{justifyContent: "start"}}>
          <Button variant="contained" color="primary" onClick={handleRevert}>
            Revert
          </Button>

        </DialogActions>
      </Dialog>
    </>
  );
};

export default SortTasksForm;
