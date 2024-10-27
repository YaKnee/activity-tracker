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
const checkIfTagsExists = async (tags, existingTags) => {
  const tagNames = tags.split(",").map((tag) => tag.trim());
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

// Adds new task to the database, updating tags if necessary
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
  
  const newTaskObject = { id: newTaskResponse.id, ...newTaskData };
  return { newTaskObject, newTagObjects };
};

// Deletes task and all associated timestamps
export const deleteTask = async (id, timestamps) => {
  await apiFetch(`${API}/tasks/${id}`, { method: "DELETE" });
  await deleteTimestamps(id, timestamps);
};

// Deletes tag and updates all tasks that used that tag
export const deleteTag = async (tagId, tasks) => {
  await apiFetch(`${API}/tags/${tagId}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
  
  const tasksToUpdate = tasks.filter((task) => task.tags.includes(tagId));
  for (const task of tasksToUpdate) {
    const updatedTags = task.tags.split(",").filter((id) => id !== String(tagId)).join(",");
    
    await apiFetch(`${API}/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, tags: updatedTags }),
    });
  }
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

// Adds new timestamp to database
export const addTimestamp = async (newTimestampData) => {
  const newTimestampResponse =  await apiFetch(`${API}/timestamps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTimestampData),
  });
  const newTimestampObject = { id: newTimestampResponse.id, ...newTimestampData };
  return newTimestampObject;
};

// Deletes timestamps associated with a specific task
const deleteTimestamps = async (taskId, timestamps) => {
  const deletePromises = timestamps
    .filter(timestamp => timestamp.task === taskId)
    .map(timestamp => apiFetch(`${API}/timestamps/${timestamp.id}`, { method: "DELETE" }));

  await Promise.all(deletePromises);
};