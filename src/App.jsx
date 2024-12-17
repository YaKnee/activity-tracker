import { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import dayjs from "dayjs";

import HomeIcon from "@mui/icons-material/Home";
import BuildIcon from "@mui/icons-material/Build";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { fetchData } from "./utils/api";
import { getTaskSpecificTotalActiveTime } from "./utils/apiDataManipulation";
import SnackbarAlert from "./components/alerts/SnackbarAlert";
import About from "./pages/About";
import Settings from "./pages/Settings";
import ActivityTimeline from "./pages/ActivityTimeline";
import DailyActiveTimes from "./pages/DailyActiveTimes";
import TaskManager from "./pages/TaskManager";
import Home from "./pages/Home";

function App() {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [taskStates, setTaskStates] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [selectionMode, setSelectionMode] = useState(0);
  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const navbarRef = useRef(null);
  const [chosenTask, setChosenTask] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [snackbarMessage, setSnackbarMessage] = useState("");


  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  // Fetch all data from backend on load
  useEffect(() => {
    const loadData = async () => {
      try {
        const { tasksData, tagsData, timestampsData, settingsData } =
          await fetchData();
        setTasks(tasksData);
        setTags(tagsData);
        setTimestamps(timestampsData);
        setDarkMode(settingsData[0].theme === "dark");
        setSelectionMode(settingsData[0].alternative);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, []);

  // Initialise state of each task
  useEffect(() => {
    const newTaskStates = tasks.map((task) => {
      const taskTimestampObjects = timestamps
        .filter((ts) => ts.task === task.id)
        .sort((a, b) => dayjs(a.timestamp) - dayjs(b.timestamp))
        .map((t) => ({
          id: t.id,
          time: t.timestamp,
          type: t.type,
        }));

      const taskTagArray =
        task.tags.length > 0
          ? task.tags
              .split(",")
              .map(Number)
              .map((tagId) => {
                const tag = tags.find((tag) => tag.id === tagId);
                return tag ? tag.name : null;
              })
              .filter(Boolean)
              .sort((a, b) => a.localeCompare(b))
          : [];

      return {
        id: task.id,
        name: task.name,
        tags: taskTagArray,
        timestamps: taskTimestampObjects,
        totalTime: getTaskSpecificTotalActiveTime(taskTimestampObjects),
        active:
          taskTimestampObjects.length > 0 &&
          taskTimestampObjects[taskTimestampObjects.length - 1].type === 0,
      };
    });

    setTaskStates(newTaskStates);
  }, [tasks, timestamps, tags]);

  // Set chosenTask for displays
  useEffect(() => {
    if (taskStates.length > 0 && chosenTask === null) {
      setChosenTask(taskStates[0]);
    }
  }, [taskStates, chosenTask]);

  // Update document title
  const location = useLocation();
  const titleMap = {
    "/": "Home",
    "/task-manager": "Task Manager",
    "/activity-timeline": "Activity Timeline",
    "/daily-times": "Daily Active Times",
    "/settings": "Settings",
    "/about": "About",
  };
  document.title = `${titleMap[location.pathname] || "Something"}`;

  // Handles closing the Navbar
  const handleCloseNavbar = () => {
    setNavbarExpanded(false);
  };

  // Toggles Navbar"s expanded state
  const handleToggleNavbar = () => {
    setNavbarExpanded((prev) => !prev);
  };

  // Snackbar handling
  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ClickAwayListener onClickAway={handleCloseNavbar}>
        <Navbar
          expand="lg"
          bg={darkMode ? "secondary" : "dark"}
          data-bs-theme="dark"
          sticky="top"
          expanded={navbarExpanded}
          ref={navbarRef}
          role="navigation"
          as="nav"
        >
          <Container fluid="md">
            <Navbar.Brand as={Link} to="/">
              <img
                src="mylogo.png"
                width="40"
                height="35"
                className="align-top"
                alt="JaniOC Logo"
              />{" "}
              Activity Tracker
            </Navbar.Brand>
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              onClick={handleToggleNavbar}
              style={{
                borderColor:"#000000",
                color: darkMode ? "#FFFFFF" : "#000000",
              }}
            />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto" style={{ textAlign: "right" }}>
                <Nav.Link as={Link} to="/" onClick={handleCloseNavbar}>
                  Home <HomeIcon className="nav-icons" />
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/task-manager"
                  onClick={handleCloseNavbar}
                >
                  Manager <BuildIcon className="nav-icons" />
                </Nav.Link>
                <NavDropdown
                  title={
                    <div className="d-inline-block">
                      Displays <DisplaySettingsIcon className="nav-icons" />{" "}
                    </div>
                  }
                  id="nav-task-dropdown"
                  bg="dark"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/daily-times"
                    className="nav-drop-items"
                    onClick={handleCloseNavbar}

                  >
                    <EqualizerIcon className="nav-icons" /> Daily Active Times
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/activity-timeline"
                    className="nav-drop-items"
                    onClick={handleCloseNavbar}
                  >
                    <FormatListNumberedIcon className="nav-icons" /> Task
                    Activity Timeline
                  </NavDropdown.Item>
                </NavDropdown>

                <Nav.Link as={Link} to="/settings" onClick={handleCloseNavbar}>
                  Settings <SettingsIcon className="nav-icons" />
                </Nav.Link>
                <Nav.Link as={Link} to="/about" onClick={handleCloseNavbar}>
                  About <InfoIcon className="nav-icons" />
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </ClickAwayListener>

      <Container fluid as="article">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/task-manager"
            element={
              <TaskManager
                tasks={tasks}
                setTasks={setTasks}
                tags={tags}
                setTags={setTags}
                timestamps={timestamps}
                setTimestamps={setTimestamps}
                taskStates={taskStates}
                setTaskStates={setTaskStates}
                showSnackbar={showSnackbar}
                darkMode={darkMode}
                selectionMode={selectionMode}
              />
            }
          />
          <Route
            path="/daily-times"
            element={
              <DailyActiveTimes
                taskStates={taskStates}
                chosenTask={chosenTask}
                setChosenTask={setChosenTask}
                darkMode={darkMode}
              />
            }
          />
          <Route
            path="/activity-timeline"
            element={
              <ActivityTimeline
                taskStates={taskStates}
                timestamps={timestamps}
                chosenTask={chosenTask}
                setChosenTask={setChosenTask}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <Settings 
                taskStates={taskStates}
                setTaskStates={setTaskStates}
                setTimestamps={setTimestamps}
                darkMode={darkMode} 
                setDarkMode={setDarkMode}
                selectionMode={selectionMode}
                setSelectionMode={setSelectionMode}
                showSnackbar={showSnackbar}
              />
            }
          />
          <Route path="/about" element={<About darkMode={darkMode}/>} />
        </Routes>
      </Container>

      <SnackbarAlert
        open={snackbarOpen}
        severity={snackbarSeverity}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />

      <Navbar
        as="footer"
        id="copyright"
        bg={darkMode ? "secondary" : "dark"}
        data-bs-theme={darkMode ? "secondary" : "dark"}
        color="dark"
      >
        <Navbar.Text style={{ width: "100%" }}>
          &copy;{" "}
          <a href="http://www.janioc.com" target="_blank">
            <strong>Jani O&#39;Connell</strong>
          </a>{" "}
          2024
        </Navbar.Text>
      </Navbar>
    </ThemeProvider>
      
    </>
  );
}

export default App;
