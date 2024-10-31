// SnackbarAlert.js
import React, { useState, forwardRef, useImperativeHandle } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Using forwardRef to expose the `showSnackbar` method to parent components
const SnackbarAlert = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("info");
  const [message, setMessage] = useState("");

  // Expose the `showSnackbar` method to the parent component
  useImperativeHandle(ref, () => ({
    showSnackbar(newMessage, newSeverity = "info") {
      setMessage(newMessage);
      setSeverity(newSeverity);
      setOpen(true);
    },
  }));

  // Close handler
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
});

export default SnackbarAlert;
