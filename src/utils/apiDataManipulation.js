import dayjs from "dayjs";

// Calculates total active time of a task based on its timestamps
export const getTaskSpecificTotalActiveTime = (timestamps) => {
  let totalActiveTime = 0;
  let startTime = null;

  // Type 0 = active, type 1 = inactive
  for (const { time, type } of timestamps) {
      if (type === 0 && startTime === null) {
          startTime = dayjs(time);
      } else if (type === 1 && startTime !== null) {
          const endTime = dayjs(time);
          totalActiveTime += endTime - startTime;
          startTime = null;
      }
  }
  // If the last entry was active (type 0)
  if (startTime !== null) {
      totalActiveTime += dayjs() - startTime;
  }
  return Math.round(totalActiveTime / 1000); //return seconds
};


// Creates an array of active times per for a specific task in a specific time range
// (Very excessive but works so don't touch it...)
export const getActiveTimesInTimeRange = (task, timeRange, accuracy) => {
  const start = dayjs(timeRange.start).startOf("day");
  const end = dayjs(timeRange.end).endOf("day");
  const currentMoment = dayjs();
  const timestamps = task.timestamps;
  const dailyTimes = [];

  // Case: No timestamps or first timestamp is after end of range
  if (timestamps.length === 0 || dayjs(timestamps[0].time).isAfter(end)) {
    for (let day = start; day.isBefore(end); day = day.add(1, "day")) {
      dailyTimes.push({ date: day.format("DD-MM-YYYY"), totalTime: 0 });
    }
    return dailyTimes;
  }

  // Case: Last timestamp is before start of range:
  if (dayjs(timestamps[timestamps.length - 1].time).isBefore(start)){
    // If still active
    if (timestamps[timestamps.length - 1].type === 0) {
      for (let day = start; day.isBefore(end); day = day.add(1, "day")) {
        // If current day, count up until current time
        if(day.isSame(currentMoment, "day")) {
          dailyTimes.push({ date: day.format("DD-MM-YYYY"), totalTime: currentMoment.diff(day, "seconds") });
        } else { // Max out every other day
          dailyTimes.push({ date: day.format("DD-MM-YYYY"), totalTime: 86400 });
        }
      }
    } else { // Not active
      for (let day = start; day.isBefore(end); day = day.add(1, "day")) {
        dailyTimes.push({ date: day.format("DD-MM-YYYY"), totalTime: 0 });
      }
    }
    return formatDailyTimes(dailyTimes, accuracy);
  }

  // Case 3: Timestamps in range
  let isActive = false;

  const lastTimestampBeforeStart = timestamps
  .filter(timestamp => dayjs(timestamp.time).isBefore(start))
  .sort((a, b) => dayjs(a.time).diff(dayjs(b.time)))
  .pop();

  // Set isActive based on the type of the last timestamp found
  if (lastTimestampBeforeStart) {
    isActive = lastTimestampBeforeStart.type === 0;
  }

  for (let day = start; day.isBefore(end); day = day.add(1, "day")) {
    // Reset start time and total time every day
    let activeStartTime = null;
    let totalTime = 0;
    // Find timestamps for this day in loop
    let dailyTimestamps = timestamps.filter(ts => dayjs(ts.time).isSame(day, 'day'));
    // If there are timestamps
    if (dailyTimestamps.length > 0) {
      // Calculate time between timestamps
      for (let i = 0; i < dailyTimestamps.length; i++) {
        const ts = dailyTimestamps[i];
        
        if ( ts.type === 0) {
          // If only one timestamp on this day
          if(dailyTimestamps.length === 1) {
            if(isActive) { // Last timestamp was type 0
              // Whole day is active
              totalTime = 86400;
            } else { // Last timestamp was type 1
              isActive = true;
              if(day.isSame(currentMoment, "day")) {
                totalTime += currentMoment.diff(dayjs(ts.time), "second");
              } else {
                // Add time from this timestamp until the end of the day
                totalTime += day.endOf("day").diff(dayjs(ts.time), "seconds");
              }

            }
          } else { // More than 1 timestamp
            if (!isActive) { // Last timestamp was type 1
              isActive = true;
              activeStartTime = dayjs(ts.time);
              if (i === dailyTimestamps.length - 1) { // if last timestamp of the day
                if(day.isSame(currentMoment, "day")) {
                  totalTime += currentMoment.diff(dayjs(ts.time), "second");
                } else {
                  // Add time from this timestamp until the end of the day
                  totalTime += day.endOf("day").diff(dayjs(ts.time), "seconds");
                }
              }

            } else { // Last timestamp was type 0
              // Update the time since last timestamp
              totalTime += dayjs(ts.time).diff(activeStartTime, "seconds");
              // Set as new active time
              activeStartTime = dayjs(ts.time);
              if (i === dailyTimestamps.length - 1) { // if last timestamp of the day
                if(day.isSame(currentMoment, "day")) {
                  totalTime += currentMoment.diff(activeStartTime, "second");
                } else {
                  // Add time from this timestamp until the end of the day
                  totalTime += day.endOf("day").diff(activeStartTime, "seconds");
                }
              }
            }
          }
        } else if ( ts.type === 1) {
          // If only 1 timestamp on this day
          if(dailyTimestamps.length === 1) {
            if (isActive) { // Last timestamp was type 0
              isActive = false;
              totalTime = dayjs(ts.time).diff(day, "seconds");
            } else { // Last timestamp was type 1
              // Whole day inactive
              totalTime = 0;
            }
          } else { // More than 1 timestamp
            if(isActive) { // Prev timestamp was type 0
              isActive = false;
              if (activeStartTime === null) {// If first timestamp of the day
                // total time since start of the day
                totalTime += dayjs(ts.time).diff(day, "seconds");
              } else {
                // total time since last type 0
                totalTime += dayjs(ts.time).diff(activeStartTime, "seconds");
              }
            }
          }
          // Reset active start time whenever there is a type 1
          activeStartTime = null;
        }
      }
    } else { // If no timestamps for day in loop
      if (isActive) { // Last timestamp of type 0
        // If day in loop is current day
        if (day.isSame(currentMoment, "day")) {
          //
          totalTime = currentMoment.diff(day, "seconds")
        } else { // Not the same day
          totalTime = 86400;
        }

      } else { // Last timestamp of type 1
        totalTime = 0;
      }
    }
    dailyTimes.push({ date: day.format("DD-MM-YYYY"), totalTime });
  }
  
  return formatDailyTimes(dailyTimes, accuracy);
};

// Helper function to format the output based on the required accuracy
const formatDailyTimes = (dailyTimes, accuracy) => {
  return dailyTimes.map(entry => {
    let formattedTotalTime;
    if (accuracy === "minutes") {
      formattedTotalTime = Math.min((entry.totalTime / 60), 1440).toFixed(2);
    } else if (accuracy === "hours") {
      formattedTotalTime = Math.min((entry.totalTime / 3600), 24).toFixed(2);
    } else {
      formattedTotalTime = Math.min(entry.totalTime, 86400);
    }
    return {
      date: entry.date,
      totalTime: parseFloat(formattedTotalTime),
    };
  });
};


export const getActivityIntervals = (task, timeRange) => {
  const start = dayjs(timeRange.start);
  const end = dayjs(timeRange.end);
  const timestamps = task.timestamps;
  let intervals = [];
  let currentStart = null;

  timestamps.forEach((timestamp) => {
    const time = dayjs(timestamp.time);
    if (timestamp.type === 0) {
      // Mark the start of an activity
      currentStart = time;
    } else if (timestamp.type === 1 && currentStart) {
      // Mark the end of an activity and add the interval if it overlaps the range
      if (currentStart.isBefore(end) && time.isAfter(start)) {
        intervals.push({
          id: timestamp.id,
          start: currentStart.format('YYYY-MM-DD HH:mm:ss'),
          end: time.format('YYYY-MM-DD HH:mm:ss'),
          time: `${formatDuration(time.diff(currentStart, "seconds"))}`
        });
      }
      currentStart = null; // Reset for the next interval
    }
  });

  // Handle ongoing activity if the last timestamp is type 0
  if (currentStart && currentStart.isBefore(end)) {
    intervals.push({
      id: null,
      start: currentStart.format('YYYY-MM-DD HH:mm:ss'),
      end: "Ongoing",
      time: `${formatDuration(dayjs().diff(currentStart, "seconds"))}`
    });
  }

  const lastTimestampBeforeStart = timestamps
    .filter(timestamp => dayjs(timestamp.time).isBefore(start))
    .sort((a, b) => dayjs(a.time).diff(dayjs(b.time)))
    .pop();

  const lastTimestampAfterEnd = timestamps
    .filter(timestamp => dayjs(timestamp.time).isAfter(end))
    .sort((a, b) => dayjs(b.time).diff(dayjs(a.time)))
    .pop();

  // Adjust the first interval's start if the last timestamp before start is type 0
  if (intervals.length > 0 && lastTimestampBeforeStart && lastTimestampBeforeStart.type === 0) {
    const firstInterval = intervals[0];
    const newStart = dayjs(lastTimestampBeforeStart.time);
    intervals[0] = {
      ...firstInterval,
      start: newStart.format('YYYY-MM-DD HH:mm:ss')
    };
  }

  // Adjust the last interval's end if the last timestamp after end is type 1
  if (intervals.length > 0 && lastTimestampAfterEnd && lastTimestampAfterEnd.type === 1) {
    const lastInterval = intervals[intervals.length - 1];
    const newEnd = dayjs(lastTimestampAfterEnd.time);
    intervals[intervals.length - 1] = {
      ...lastInterval,
      end: newEnd.format('YYYY-MM-DD HH:mm:ss')
    };
  }

  return intervals;
};


// Formats total active duration in a readable format (DD:HH:MM:SS or HH:MM:SS)
export const formatDuration = (totalSeconds) => {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return days > 0
    ? `${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};