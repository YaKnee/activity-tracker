import { useEffect, useState } from "react";

import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function DateTimeRangePicker({ timeRange, setTimeRange }) {
  const [dates, setDates] = useState({
    start: timeRange.start,
    end: timeRange.end,
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
    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Start Date"
            value={dates.start}
            onChange={(newStart) => {
              if (!newStart || newStart.isBefore(dates.end)) {
                handleDateChange(newStart, undefined);
              }
            }}
            minDateTime={dayjs("2020-01-01")}
            maxDateTime={dates.end}
            disableFuture
            ampm={false}
            views={["year","month","day","hours","minutes","seconds"]}
          />
          {"-"}
          <DateTimePicker
            label="End Date"
            value={dates.end}
            onChange={(newEnd) => {
              if (!newEnd || newEnd.isAfter(dates.start)) {
                handleDateChange(undefined, newEnd);
              }
            }}
            minDateTime={dates.start}
            disableFuture
            ampm={false}
            views={["year","month","day","hours","minutes","seconds"]}
          />
      </LocalizationProvider>
    </div>

  );
}

export default DateTimeRangePicker;
