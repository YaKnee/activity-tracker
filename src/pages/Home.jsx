import React, { useEffect, useState } from "react";
import TimeIntervalForm from "../components/forms/TimeIntervalForm";
// import TimeIntervalGraph from "../components/graphs/TimeIntervalGraph";
import { fetchTimesPerTask } from "../utils/api"; // Adjust import path as needed
import "../styles/App.css";

function Home({ tasks, tags, timestamps, showSnackbar }) {
    const [timesForTask, setTimesForTask] = useState([]);
    const [timeRange, setTimeRange] = useState({ start: null, end: null });

    // Use useEffect to fetch times only once when the component mounts
    useEffect(() => {
        const getTimes = async () => {
            try {
                const times = await fetchTimesPerTask(1); // Fetch times for task ID 1
                setTimesForTask(times); // Set the fetched times in state
                
                // Extract first and last timestamps
                if (times.length > 0) {
                    const firstTimestamp = times[0].timestamp;
                    const lastTimestamp = times[times.length - 1].timestamp;

                    // Update the timeRange state
                    setTimeRange({
                        start: new Date(firstTimestamp),
                        end: new Date(lastTimestamp),
                    });
                }
            } catch (error) {
                console.error("Error fetching times:", error);
            }
        };

        getTimes(); // Call the async function
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <section>
            <h1>Hi</h1>
            <TimeIntervalForm 
                timeRange={timeRange} 
                setTimeRange={setTimeRange} 
                showSnackbar={showSnackbar} 
            />
            {/* <TimeIntervalGraph timestamps={timesForTask} timeRange={timeRange} /> */}
        </section>
    );
}

export default Home;
