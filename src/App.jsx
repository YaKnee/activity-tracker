import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { fetchData } from "./utils/api";
import SnackbarAlert from "./components/alerts/SnackBarAlert";
import About from "./pages/About";
import Settings from "./pages/Settings";
import TasksView from "./pages/TasksView";
import Home from "./pages/Home";

function App() {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [settings, setSettings] = useState([]);
  const snackbarRef = useRef(null);
  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const navbarRef = useRef(null);

  const showSnackbar = (message, severity) => {
    snackbarRef.current.showSnackbar(message, severity);
  };

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

  useEffect(() => {
    loadData();
  }, []);

  // Update document title
  const location = useLocation();
  const titleMap = {
    "/": "Home",
    "/tasks": "Tasks",
    "/settings": "Settings",
    "/about": "About",
  };
  document.title = `${titleMap[location.pathname] || "Something"}`;

  // Close navbar when clicking outside burger menu
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navbarExpanded && navbarRef.current && !navbarRef.current.contains(event.target)) {
        setNavbarExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [navbarExpanded]);

  return (
    <>
      <Navbar
        expand="lg"
        bg="dark"
        data-bs-theme="dark"
        sticky="top"
        expanded={navbarExpanded}
        onToggle={() => setNavbarExpanded(!navbarExpanded)}
        ref={navbarRef}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={() => setNavbarExpanded(false)}>
            <img src="mylogo.png"
                 width="20"
                 height="20"
                 className="d-inline-block align-center"
                 alt="JaniOC Logo"
            />{" "}
            Activity Tracker
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" style={{ textAlign: "right" }}>
              <Nav.Link as={Link} to="/" onClick={() => setNavbarExpanded(false)}>Home</Nav.Link>
              <Nav.Link as={Link} to="/tasks" onClick={() => setNavbarExpanded(false)}>Tasks</Nav.Link>
              <Nav.Link as={Link} to="/settings" onClick={() => setNavbarExpanded(false)}>Settings</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/about" onClick={() => setNavbarExpanded(false)}>About</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid="lg">
        <article>
          <Routes>
            <Route
              path="/"
              element={<Home tasks={tasks} tags={tags} timestamps={timestamps} showSnackbar={showSnackbar} />}
            />
            <Route
              path="/tasks"
              element={<TasksView tasks={tasks} setTasks={setTasks} tags={tags} setTags={setTags} timestamps={timestamps} setTimestamps={setTimestamps} showSnackbar={showSnackbar} />}
            />
            <Route path="/settings" element={<Settings settings={settings} setSettings={setSettings} />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </article>
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
