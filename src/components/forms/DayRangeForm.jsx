import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/material";

function DayRangeForm({ timeRange, setTimeRange }) {
  const [dates, setDates] = useState({
    start: dayjs(timeRange.start),
    end: dayjs(timeRange.end),
  });

  useEffect(() => {
    setTimeRange({
      start: dates.start,
      end: dates.end,
    });
  }, [dates, setTimeRange]);

  const handleDateChange = (newStart, newEnd) => {
    setDates((prev) => ({
      start: newStart || prev.start,
      end: newEnd || prev.end,
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" justifyContent="space-evenly" gap={2} flexWrap="wrap" marginTop={"10px"}>
        <DatePicker
          label="Start Date"
          value={dates.start}
          onChange={(newStart) => {
            if (!newStart || newStart.isBefore(dates.end) || newStart.isSame(dates.end, "day")) {
              handleDateChange(newStart, undefined);
            }
          }}
          maxDate={dates.end}
          disableFuture
          format="DD-MM-YYYY"
        />
        {"-"}
        <DatePicker
          label="End Date"
          value={dates.end}
          onChange={(newEnd) => {
            if (!newEnd || newEnd.isAfter(dates.start) || newEnd.isSame(dates.start, "day")) {
              handleDateChange(undefined, newEnd);
            }
          }}
          minDate={dates.start}
          disableFuture
          format="DD-MM-YYYY"
        />
      </Box>
    </LocalizationProvider>
  );
}

export default DayRangeForm;
