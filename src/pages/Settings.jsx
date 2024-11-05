import React, { useEffect } from "react";

import dayjs from "dayjs";

import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Filter9PlusIcon from "@mui/icons-material/Filter9Plus";
import Filter1Icon from "@mui/icons-material/Filter1";

import { updateSettings, addTimestamp } from "../utils/api";

// Yoinked from MUI Docs, with minor edits to enlarge
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 80,
  height: 48,
  padding: 12,
  "& .MuiSwitch-switchBase": {
    margin: 4,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(32px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
        ...theme.applyStyles("dark", {
          backgroundColor: "#8796A5",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#001e3c",
    width: 40,
    height: 40,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 1.5,
      top: 1.5,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: "#003892",
    }),
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 24 / 2,
    ...theme.applyStyles("dark", {
      backgroundColor: "#8796A5",
    }),
  },
}));

function Settings({
  taskStates,
  setTaskStates,
  setTimestamps,
  darkMode,
  setDarkMode,
  selectionMode,
  setSelectionMode,
  showSnackbar,
}) {
  const handleChangeTheme = async (event) => {
    const newDarkMode = event.target.checked;
    setDarkMode(newDarkMode);
    const updatedTheme = newDarkMode ? "dark" : "default";
    const newSettings = {
      id: 1,
      theme: updatedTheme,
      alternative: selectionMode,
      own_textual_data: "",
    };

    try {
      await updateSettings(newSettings);
      showSnackbar("Theme has been updated in the backend.", "success");
    } catch (error) {
      showSnackbar("Failed to update theme in the backend.", "error");
      console.error("Failed to update settings:", error);
    }
  };

  // Update selectionMode when user changes the mode
  const handleModeChange = async (event, newMode) => {
    if (newMode !== null) {
      setSelectionMode(newMode);
      const updatedSettings = {
        id: 1,
        theme: darkMode,
        alternative: newMode,
        own_textual_data: "",
      };

      try {
        await updateSettings(updatedSettings);
        if (newMode === 0) {
          showSnackbar(
            "You can now activate multiple tasks at once.",
            "success"
          );
        } else {
          showSnackbar(
            "You can now only have 1 active task at any given time.",
            "success"
          );

          // Find the most recently active task based on timestamps
          const mostRecentActiveTask = taskStates
            .filter((task) => task.active)
            .sort((a, b) => {
              const aLatestStart =
                a.timestamps.filter((ts) => ts.type === 0).slice(-1)[0]?.time ||
                0;
              const bLatestStart =
                b.timestamps.filter((ts) => ts.type === 0).slice(-1)[0]?.time ||
                0;
              return dayjs(bLatestStart) - dayjs(aLatestStart);
            })[0];

          // If all tasks are inactive, leave it be.
          if (!mostRecentActiveTask) return;

          // Find tasks that need to be deactivated (active and not the most recent)
          const tasksToUpdate = taskStates.filter(
            (task) => task.active && task.id !== mostRecentActiveTask.id
          );

          // Deactivate each identified task and update the timestamps
          for (const task of tasksToUpdate) {
            const now = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS");
            const newTimestampData = {
              timestamp: now,
              task: task.id,
              type: 1,
            };

            try {
              const newTimestampObject = await addTimestamp(newTimestampData);

              // Update the state with the new timestamp
              setTimestamps((prevTimestamps) => [
                ...prevTimestamps,
                newTimestampObject,
              ]);

              // Update taskStates to reflect the inactive status
              setTaskStates((prevStates) =>
                prevStates.map((state) => {
                  if (state.id === task.id) {
                    return {
                      ...state,
                      active: false,
                      timestamps: [
                        ...state.timestamps,
                        { time: newTimestampObject.timestamp, type: 1 },
                      ],
                    };
                  }
                  return state;
                })
              );
            } catch (error) {
              console.error(
                `Failed to add timestamp for task ${task.id}:`,
                error
              );
              showSnackbar(`Failed to deactivate task "${task.name}"`, "error");
            }
          }
        }
      } catch (error) {
        showSnackbar("Failed to update mode selection.", "error");
        console.error("Failed to update settings:", error);
      }
    }
  };

  return (
    <>
      <Stack direction={{xs: "column"}} spacing={{sm: 4}} >
      <section style={{minWidth: "50%"}}>
          <h1>Theme:</h1>
          <p style={{textAlign: "justify", textJustify: "inter-word"}}>
            The theme settings let users choose between light and dark modes. This
            feature improves visibility, especially in dim light, and changes the
            colors of text, buttons, and charts to match the selected theme.
            Whether you like the modern look of dark mode or the bright feel of
            light mode, this toggle makes your workspace easier to use. The
            changes happen instantly in the app, and your choices are saved, so
            your preferences are always there when you log in.
          </p>

          <FormControlLabel
            control={
              <MaterialUISwitch
                sx={{ m: 1 }}
                checked={darkMode}
                onChange={handleChangeTheme}
              />
            }
            label={darkMode ? "Dark Mode" : "Light Mode"}
          />
        </section>

        <section style={{minWidth: "50%"}}>
          <h1>Mode Selection:</h1>
          <p style={{textAlign: "justify", textJustify: "inter-word"}}>
            The Mode Selection feature lets you personalize how you manage your
            tasks. You can switch between modes to focus on just one task at a
            time, which helps you concentrate on what's most important. Or, if you
            prefer, you can turn on a mode that allows you to work on multiple
            tasks at once, giving you the flexibility to handle different
            responsibilities.
          </p>
          <ToggleButtonGroup
            size="large"
            value={selectionMode}
            onChange={handleModeChange}
            exclusive
            className="mb-5"
          >
            <ToggleButton value={0}>
              <Filter9PlusIcon />
            </ToggleButton>
            <ToggleButton value={1}>
              <Filter1Icon />
            </ToggleButton>
          </ToggleButtonGroup>
        </section>
      </Stack>

    </>
  );
}
export default Settings;
