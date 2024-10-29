import dayjs from "dayjs";
import { fetchTimesPerTask } from "./api";

// Convert tag IDs from task objects to tag names
export const getTagNames = (tagsString, allTags) => {
  // Return empty string if all tags have been deleted
  if (tagsString.length == 0) return "";

  const tagIds = (tagsString.split(",").map(Number));
  const tagNames = tagIds.map(tagId => {
    const tagObject = allTags.find(tag => tag.id === tagId);
    return tagObject.name;
  })
  return tagNames.join(", ");
}

export const getLastTimestampForSpecificTask = async () => {
  const timestamps = await fetchTimesPerTask(taskId);
  return timestamps[timestamps.length - 1];
}
// Retrieves tags specific to a given task based on its tag IDs
export const getTaskSpecificTags = (task, tags) => {
  const tagIdsOfTask = task.tags.split(",").map(Number);
  const taskSpecificTags = tags.filter(tag => tagIdsOfTask.includes(tag.id));
  return taskSpecificTags;
};

// Calculates total active time of a task based on its timestamps
export const getTaskSpecificTotalActiveTime = (timestamps) => {
  let totalActiveTime = 0;
  let startTime = null;

  // Type 0 = active, type 1 = inactive
  for (const { type, timestamp } of timestamps) {
      if (type === 0 && startTime === null) {
          startTime = dayjs(timestamp);
      } else if (type === 1 && startTime !== null) {
          const endTime = dayjs(timestamp);
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
