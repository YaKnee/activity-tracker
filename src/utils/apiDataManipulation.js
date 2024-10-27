// Retrieves tags specific to a given task based on its tag IDs
export const getTaskSpecificTags = (task, tags) => {
  const tagIdsOfTask = task.tags.split(",").map((t) => parseInt(t.trim()));
  const taskSpecificTags = tags.filter(tag => tagIdsOfTask.includes(tag.id));
  return taskSpecificTags;
};

// Calculates total active time of a task based on its timestamps
export const getTaskSpecificTotalActiveTime = (timestamps) => {
    let totalActiveTime = 0;
    let startTime = null;

    //Type 0 = active, type 1 = inactive
    for (const { type, timestamp } of timestamps) {
      if (type === 0 && startTime === null) {
        startTime = new Date(timestamp);
      } else if (type === 1 && startTime !== null) {
        const endTime = new Date(timestamp);
        totalActiveTime += endTime - startTime; // Accumulate duration in ms
        startTime = null;
      }
    }

    return totalActiveTime;
};

// Parses timestamp string into Date object with UTC format
export const parseTimestampAsUTC = (timestamp) => {
    const [date, time] = timestamp.split(" ");
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute, second, milliseconds] = time.split(/[:.]/).map(Number);
  
    //Create date object in UTC
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second, milliseconds));
};