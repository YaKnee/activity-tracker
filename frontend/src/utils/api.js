import dayjs from "dayjs";

const API = "http://localhost:3010";

// Generic fetch function to handle API requests
const apiFetch = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
};

// Fetches all data from database on App load
export const fetchData = async () => {
  const urls = [`${API}/tasks`, `${API}/tags`, `${API}/timestamps`, `${API}/options`];
  const fetchPromises = urls.map(url => apiFetch(url));
  
  try {
    const [tasksData, tagsData, timestampsData, settingsData] = await Promise.all(fetchPromises);
    return { tasksData, tagsData, timestampsData, settingsData };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Adds new tag to database
export const addTag = async (name) => {
  return await apiFetch(`${API}/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
};

// Checks if specified tags exist and adds any new tags to the database
export const checkIfTagsExists = async (tags, existingTags) => {
  const tagNames = tags.map((tag) => tag.trim());
  const existingTagIds = [];
  const newTagObjects = [];

  for (const tagName of tagNames) {
    const existingTag = existingTags.find((existingTag) => existingTag.name === tagName);
    if (existingTag) {
      existingTagIds.push(existingTag.id);
    } else {
      const newTagObject = await addTag(tagName);
      newTagObjects.push({ id: newTagObject.id, name: tagName });
      existingTagIds.push(newTagObject.id);
    }
  }
  return { existingTagIds, newTagObjects };
};

// Adds a new timestamp to database
export const addTimestamp = async (newTimestampData) => {
  const newTimestampResponse = await apiFetch(`${API}/timestamps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTimestampData),
  });
  const newTimestampObject = { id: newTimestampResponse.id, ...newTimestampData };
  return newTimestampObject;
};

// Delete single timestamp
export const deleteTimestamp = async (timestamp) => {
 await apiFetch(`${API}/timestamps/${timestamp.id}`, { method: "DELETE" });
};

// Adds new task to the database, updating tags if necessary, and create a timestamp of this creation
export const addTask = async (newTaskData, existingTags) => {
  const { existingTagIds, newTagObjects } = await checkIfTagsExists(newTaskData.tags, existingTags);
  newTaskData.tags = existingTagIds.join(",");
  
  const newTaskResponse = await apiFetch(`${API}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTaskData),
  });
  // Create a timestamp for this new task
  const taskTimeOfCreation = {
    timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss.SSS"),
    task: newTaskResponse.id,
    type: 1
  };
  const newTimestampObject = await addTimestamp(taskTimeOfCreation);

  const newTaskObject = { id: newTaskResponse.id, ...newTaskData };
  return { newTaskObject, newTagObjects, newTimestampObject };
};


// Updates an existing task with new data and handles tags
export const updateTask = async (id, updatedTask, allTags) => {
  const { existingTagIds, newTagObjects } = await checkIfTagsExists(updatedTask.tags, allTags);
  updatedTask.tags = existingTagIds.join(",");
  
  const updatedTaskResponse = await apiFetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTask),
  });

  const updatedTaskObject = { id: updatedTaskResponse.id, ...updatedTask };
  return { updatedTaskObject, newTagObjects };
};

// Delete task and all associated timestamps (Maybe change later so we can potentially restore task)
export const deleteTask = async (id, timestamps) => {
  await apiFetch(`${API}/tasks/${id}`, { method: "DELETE" });
  await deleteAllTimestamps(id, timestamps);
};

// Deletes timestamps associated with a specific task
const deleteAllTimestamps = async (taskId, timestamps) => {
  const deletePromises = timestamps
    .filter(timestamp => timestamp.task === taskId)
    .map(timestamp => apiFetch(`${API}/timestamps/${timestamp.id}`, { method: "DELETE" }));

  await Promise.all(deletePromises);
};

// Deletes multiple tags and updates all tasks that used those tags
export const deleteTags = async (tagIds, tasks) => {
  for (const tagId of tagIds) {
    await apiFetch(`${API}/tags/${tagId}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
  }

  const tasksToUpdate = tasks.filter(task =>
    task.tags.split(",").some(id => tagIds.includes(Number(id)))
  );

  for (const task of tasksToUpdate) {
    const updatedTags = task.tags
      .split(",")
      .filter(id => !tagIds.includes(Number(id)))
      .join(",");

    await apiFetch(`${API}/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, tags: updatedTags }),
    });
  }
};

// Fetch timestamps for specific tasks
export const fetchTimesPerTask = async (taskId) => {
  const result = await apiFetch(`${API}/timesfortask/${taskId}`);
  return result;
};

// Update settings for theme and mode change
export const updateSettings = async (newSettings) => {
  const updatedSettingsResponse = await apiFetch(`${API}/options/${newSettings.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSettings),
  });
  return updatedSettingsResponse;
};