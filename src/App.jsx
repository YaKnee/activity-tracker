import {React, useState, useEffect} from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { fetchData } from "./utils/api";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import Home from "./pages/Home";

function App() {
  
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [settings, setSettings] = useState([]);

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

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/about">About</Link>
      </nav>

      <article>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" 
                element={<Tasks tasks={tasks}
                                setTasks={setTasks}
                                tags={tags}
                                setTags={setTags}
                                timestamps={timestamps}
                                setTimestamps={setTimestamps}
                          />}
          />
          <Route path="/settings"
                 element={<Settings settings={settings}
                                    setSettings={setSettings}
                          />}
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </article>


      <footer id="copyright">
        <p>&copy; <a href="http://www.janioc.com" target="_blank"><strong>Jani O&#39;Connell</strong></a> 2024</p>
      </footer>
    </>
  );
}

export default App;
