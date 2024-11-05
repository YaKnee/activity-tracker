import React, { useEffect, useState } from "react";

import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function DateRangePicker({ timeRange, setTimeRange }) {
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
    <div style={{display: "flex", justifyContent: "space-between", marginTop: "16px", alignItems: "center"}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
     
        <DatePicker
          label="Start Date"
          value={dates.start}
          onChange={(newStart) => {
            if (!newStart || newStart.isBefore(dates.end) || newStart.isSame(dates.end, "day")) {
              handleDateChange(newStart, undefined);
            }
          }}
          minDate={dayjs("2020-01-01")}
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

      </LocalizationProvider>
    </div>
  );
}

export default DateRangePicker;
