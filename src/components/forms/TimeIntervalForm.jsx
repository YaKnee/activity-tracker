import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function TimeIntervalForm({ timeRange, setTimeRange }) {
    const [startValue, setStartValue] = useState(dayjs(timeRange.start));
    const [endValue, setEndValue] = useState(dayjs(timeRange.end));

    // Update startValue and endValue when timeRange changes
    useEffect(() => {
        setStartValue(dayjs(timeRange.start));
        setEndValue(dayjs(timeRange.end));
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
                <DateTimePicker
                    label="Start Time"
                    value={startValue}
                    onChange={handleStartChange} // Update start time and timeRange
                    // You can set minDateTime and maxDateTime here if needed
                />
                <DateTimePicker
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
