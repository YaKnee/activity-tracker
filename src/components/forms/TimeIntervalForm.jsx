import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

function TimeIntervalForm({ timeRange, setTimeRange }) {
    const [startValue, setStartValue] = useState(timeRange.start);
    const [endValue, setEndValue] = useState(timeRange.end);

    // Update startValue and endValue when timeRange changes
    useEffect(() => {
        setStartValue(timeRange.start);
        setEndValue(timeRange.end);
    }, [timeRange]);

    const handleStartChange = (newValue) => {
        setStartValue(newValue);
        // Directly update the timeRange state
        if (newValue && endValue) {
            setTimeRange({
                start: newValue.toDate(),
                end: endValue.toDate(),
            });
        }
    };

    const handleEndChange = (newValue) => {
        setEndValue(newValue);
        // Directly update the timeRange state
        if (startValue && newValue) {
            setTimeRange({
                start: startValue.toDate(),
                end: newValue.toDate(),
            });
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "row", margin: "10px 0", justifyContent: "center" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDateTimePicker
                    label="Start Time"
                    value={startValue}
                    onChange={handleStartChange} // Update start time and timeRange
                    // You can set minDateTime and maxDateTime here if needed
                />
                <MobileDateTimePicker
                    label="End Time"
                    value={endValue}
                    onChange={handleEndChange} // Update end time and timeRange
                    // You can set minDateTime and maxDateTime here if needed
                />
            </LocalizationProvider>
        </div>
    );
}

export default TimeIntervalForm;
