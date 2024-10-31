import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

function TaskTable({ taskStates, chosenTask, setChosenTask }) {

  const [selectedRow, setSelectedRow] = useState(chosenTask);

  const columns = [
    { field: "id", headerName: "ID", type: "number", minWidth: 70 },
    { field: "name", headerName: "Name", type: "string", minWidth: 120 },
    {
      field: "created",
      headerName: "Created",
      type: "dateTime",
      flex: 1,
      minWidth: 200,
    },
    { field: "active", heaerName: "Active", type: "boolean", minWidth: 70 },
  ];
  const rows = taskStates.map((state) => {
    return {
      id: state.id,
      name: state.name,
      created: new Date(state.timestamps[0]), //.format("YYYY-MM-DD HH:mm:ss")
      active: state.active,
    };
  });

  const paginationModel = { page: 0, pageSize: 100 };

  useEffect(() => {
    // Set the selected row when chosenTask changes
    setSelectedRow(chosenTask);
  }, [chosenTask]);


  // Handle row selection change
  const handleSelectionModelChange = (newSelection) => {
    console.log("New selection:", newSelection); // Log the new selection for debugging
    if (newSelection.length === 0) {
      // If no selection, reset to chosenTask
      setSelectedRow(null); // Or chosenTask depending on your logic
      setChosenTask(null); // Or keep it based on your logic
    } else {
      // Set the selected row and update chosenTask
      const selectedId = newSelection[0];
      setSelectedRow(selectedId);
      setChosenTask(selectedId);
      console.log("Selected Row ID:", selectedId); // Log the selected row
    }
  };

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: { paginationModel },
        }}
        checkboxSelection
        disableColumnSelector
        disableMultipleRowSelection
        disableColumnResize
        onSelectionModelChange={handleSelectionModelChange}
        selectionModel={[selectedRow]}
      />
    </Paper>
  );
}

export default TaskTable;
