import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

function SelectTaskForm({ taskStates, chosenTask, setChosenTask }) {

  const taskOptions = taskStates.map((task) => {
    const firstLetter = task.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...task,
    };
  });
  
  const handleTaskChange = (event, newValue) => {
    setChosenTask(newValue);
  };

  return(
    <>
      <Autocomplete
        value={chosenTask}
        onChange={handleTaskChange}
        disableClearable
        fullWidth
        options={taskOptions.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
        getOptionLabel={(option) => `${option.name} (id: ${option.id}) `}
        groupBy={(option) => option.firstLetter}
        renderInput={(params) => (
          <TextField {...params} label="Select or Type Task Name" variant="outlined" />
        )}
        autoComplete
        autoHighlight
        ListboxProps={{
          style: {
            maxHeight: 48 * 5,
          },
        }}
      />
    </>
  );
}

export default SelectTaskForm;
