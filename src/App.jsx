import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import BuildIcon from '@mui/icons-material/Build';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import dayjs from "dayjs";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import SnackbarAlert from "./components/alerts/SnackBarAlert";
import { fetchData } from "./utils/api";
import { getTagNames, getTaskSpecificTotalActiveTime } from "./utils/apiDataManipulation";
import About from "./pages/About";
import Settings from "./pages/Settings";
import DailyBarChart from "./components/DailyBarChart";
import TaskManager from "./pages/TaskManager";
import Home from "./pages/Home";

function App() {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [settings, setSettings] = useState([]);
  const [taskStates, setTaskStates] = useState([])
  const snackbarRef = useRef(null);
  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const navbarRef = useRef(null);


  // Fetch all data from backend on load
  useEffect(() => {
    const loadData = async () => {
      try {
        const { tasksData, tagsData, timestampsData, settingsData } = await fetchData();
        setTasks(tasksData);
        setTags(tagsData);
        setTimestamps(timestampsData);
        setSettings(settingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, []);

  // Initialise state of each task
  useEffect(() => {
    const newTaskStates = tasks.map(task => {
      const taskTimestampObjects = 
        timestamps.filter(t => t.task === task.id)
                  .sort((a, b) => dayjs(a.timestamp) - dayjs(b.timestamp));
      
      const taskTagArray = 
        task.tags.length > 0
          ? task.tags.split(",").map((id, index) => ({
              id: Number(id),
              name: getTagNames(task.tags, tags)[index],
            }))
          : [];
  
      const sortedTags = taskTagArray.sort((a, b) => a.name.localeCompare(b.name));
      return {
        id: task.id,
        name: task.name,
        tags: sortedTags.map(t => t.name),
        timestamps: taskTimestampObjects.map(t => t.timestamp),
        totalTime: getTaskSpecificTotalActiveTime(taskTimestampObjects),
        active: taskTimestampObjects[taskTimestampObjects.length - 1].type === 0,
      };
    });
    console.log(newTaskStates)
    setTaskStates(newTaskStates);
  }, [tasks]);
  
  



  // Update document title
  const location = useLocation();
  const titleMap = {
    "/": "Home",
    "/task-manager": "Task Manager",
    "/task-daily": "Daily Active Times",
    "/settings": "Settings",
    "/about": "About",
  };
  document.title = `${titleMap[location.pathname] || "Something"}`;


  const showSnackbar = (message, severity) => {
    snackbarRef.current.showSnackbar(message, severity);
  };

  // Handles
  const handleCloseNavbar = () => {
    setNavbarExpanded(false);
  };

  // Toggles Navbar's expanded state
  const handleToggleNavbar = () => {
    setNavbarExpanded(prev => !prev);
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleCloseNavbar}>
          <Navbar
            expand="lg"
            bg="dark"
            data-bs-theme="dark"
            sticky="top"
            expanded={navbarExpanded}
            ref={navbarRef} 
            role="navigation"
            as="navbar"
          >
            <Container fluid="md">
              <Navbar.Brand as={Link} to="/">
                <img src="mylogo.png"
                     width="40"
                     height="35"
                     className="align-top"
                     alt="JaniOC Logo"
                />{" "}
                Activity Tracker
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggleNavbar} />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto" style={{ textAlign: "right" }}>
                  <Nav.Link as={Link} to="/" onClick={handleCloseNavbar}>Home <HomeIcon className="nav-icons"/></Nav.Link>
                  <Nav.Link as={Link} to="/task-manager" onClick={handleCloseNavbar}>Manager <BuildIcon className="nav-icons" /></Nav.Link>
                  <NavDropdown title={<div className="d-inline-block">Displays <DisplaySettingsIcon className="nav-icons"/> </div>} id="nav-task-dropdown">
                    <NavDropdown.Item as={Link} to="/task-daily" className="nav-drop-items" onClick={handleCloseNavbar}><EqualizerIcon className="nav-icons" /> Daily Active Times</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/task-graph" className="nav-drop-items" onClick={handleCloseNavbar}><FormatListNumberedIcon className="nav-icons" /> List</NavDropdown.Item>
                  </NavDropdown>

                  <Nav.Link as={Link} to="/settings" onClick={handleCloseNavbar}>Settings <SettingsIcon className="nav-icons" /></Nav.Link>
                  <Nav.Link as={Link} to="/about" onClick={handleCloseNavbar}>About <InfoIcon className="nav-icons" /></Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
      </ClickAwayListener>

      <Container fluid as="article">
          <Routes>
            <Route
              path="/"
              element={
                <Home 
                  tasks={tasks} 
                  tags={tags} 
                  timestamps={timestamps} 
                  showSnackbar={showSnackbar} 
                />
              }
            />
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
                />
              }
            />
            <Route 
              path="/task-daily"
              element={
                <DailyBarChart taskStates={taskStates}/>
              }
            />
            <Route 
              path="/settings" 
              element={
                <Settings 
                  settings={settings} 
                  setSettings={setSettings}
                />
              } 
            />
            <Route path="/about" element={<About />} />
          </Routes>
      </Container>

      <Navbar as="footer" id="copyright" bg="dark" data-bs-theme="dark" color="dark">
        <Navbar.Text style={{width: "100%"}}>
          &copy;{" "}
          <a href="http://www.janioc.com" target="_blank">
            <strong>Jani O&#39;Connell</strong>
          </a>{" "}
          2024
        </Navbar.Text>
      </Navbar>

      <SnackbarAlert ref={snackbarRef} />
    </>
  );
}

export default App;
