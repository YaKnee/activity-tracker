import React, { useEffect, useState }from "react";
import dayjs from "dayjs";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button"
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ListIcon from '@mui/icons-material/List';
import ArrowCircleUpTwoToneIcon from '@mui/icons-material/ArrowCircleUpTwoTone';
import ArrowCircleDownTwoToneIcon from '@mui/icons-material/ArrowCircleDownTwoTone';

const SortTasksForm = ({ taskStates, setTaskStates, sortedTasks, setSortedTasks }) => {
  //Value = id/name/tags(amount)/firstTimestamp(created)/lastTimestamp/active/totalTime; 
  //order= 0 is ascending, 1 is descending

  const [sortingCriteria, setSortingCriteria] = useState({ value: "id", order: 0});
  const [isSorting, setIsSorting] = useState(false);

  const handleOpen = () => {
    setIsSorting(true);
  };
  const handleClose = () => {
    setIsSorting(false);
    console.log(sortingCriteria)
  };

  useEffect(() => {
    setSortedTasks([...taskStates])
    console.log(sortingCriteria)
    console.log("Current tasks states:", taskStates)
  }, [taskStates])

  const handleChangeValue = (event) => {
    setSortingCriteria((prevState) => ({
      ...prevState,
      value: event.target.value,
    }));

    handleSort()
  };
  
  const handleChangeOrder = () => {
    setSortingCriteria((prevState) => ({
      ...prevState,
      order: prevState.order === 0 ? 1 : 0,
    }));
    // Directly reverse sortedTasks
    handleSort();
  };
  const handleSort = () => {

    const updatedTasks = sortedTasks.map((task) => {
      if (task.active) {
        return {
          ...task,
          totalActiveDuration:  dayjs().diff(dayjs(task.latestTimestamp), "seconds"),
          latestTimestamp: dayjs().format("YYYY-MM-DD HH:mm:ss:SSS"),
        };
      }
      return task;
    });

    const { value, order } = sortingCriteria
      // Sorting logic based on `sortingValue.value`
    updatedTasks.sort((a, b) => {
      if (value === "id" || value === "totalActiveDuration") {
        // Integer comparison
        return a[value] - b[value];
      } else if (value === "name") {
        // String comparison (alphabetical)
        return a[value].localeCompare(b[value]);
      } else if (value === "tags") {
        const tagsA = a.tags.split(",").map(tag => tag.trim());
        const tagsB = b.tags.split(",").map(tag => tag.trim());
  
        // Compare tags one-by-one
        for (let i = 0; i < Math.min(tagsA.length, tagsB.length); i++) {
          const comparison = tagsA[i].localeCompare(tagsB[i]);
          if (comparison !== 0) {
            return comparison;
          }
        }
        return tagsB.length - tagsA.length;
      } else if (value === "firstTimestamp" || value === "latestTimestamp") {
        // Day.js date comparison
        return dayjs(a[value]).isBefore(dayjs(b[value])) ? -1 : 1;
      }
      return 0;
    });

    if (sortingCriteria.order === 1) {
      updatedTasks.reverse();
    }


    // Update sortedTasks with updatedTasks
    setTaskStates(updatedTasks);
  };


  return (
    <>
      <Button 
        variant="contained" 
        color="error" 
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
          </DialogContentText>


        
          <Row>
            <Col sm={5}>
              <FormControl required variant="filled">
                <Select
                  // fullWidth
                  labelId="ValueSelectLabel"
                  id="ValueSelect"
                  value={sortingCriteria.value}
                  onChange={handleChangeValue}
                  label="Value"
                  IconComponent={ListIcon}
                >
                  <MenuItem value={"id"}>ID</MenuItem>
                  <MenuItem value={"name"}>Name</MenuItem>
                  <MenuItem value={"tags"}>Tags</MenuItem>
                  <MenuItem value={"firstTimestamp"}>Created</MenuItem>
                  <MenuItem value={"active"}>Active</MenuItem>
                  <MenuItem value={"totalActiveDuration"}>Total Time Active</MenuItem>
                </Select>
              </FormControl>
            </Col>
            <Col sm={5}>
              <Button variant="contained" color="secondary" onClick={handleChangeOrder}>
                  {sortingCriteria.order === 1 ? <ArrowCircleDownTwoToneIcon/> : <ArrowCircleUpTwoToneIcon/>}
                </Button>
            </Col>
            </Row>

        </DialogContent>
        <DialogActions>


        </DialogActions>
      </Dialog>
    </>
  );
};

export default SortTasksForm;
