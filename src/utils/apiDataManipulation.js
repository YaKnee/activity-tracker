export const getTaskSpecificTags = (task, tags) => {
  const tagIdsOfTask = task.tags.split(",").map((t) => parseInt(t.trim()));
  const taskSpecificTags = tags.filter(tag => tagIdsOfTask.includes(tag.id));
  return taskSpecificTags;
};

export const getTaskSpecificTotalActiveTime = (timestamps) => {
    let totalActiveTime = 0;
    let startTime = null;

    for (let i = 0; i < timestamps.length; i++) {
        const currentTimestamp = timestamps[i];
        //Type 0: active, type 1: inactive
        if (currentTimestamp.type === 0 && startTime === null) {
            // Start timing when we find an active period
            startTime = new Date(currentTimestamp.timestamp);
        } else if (currentTimestamp.type === 1 && startTime !== null) {
            // Stop timing when we find an inactive period
            const endTime = new Date(currentTimestamp.timestamp);
            totalActiveTime += endTime - startTime; // Add duration in milliseconds
            startTime = null; // Reset startTime to search for next active period
        }
    }

    return totalActiveTime;
}

export const parseTimestampAsUTC = (timestamp) => {
    const [datePart, timePart] = timestamp.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);
    const milliseconds = parseInt(timePart.split(".")[1], 10);
  
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second, milliseconds));
  };