const API = "http://localhost:3010";

export const fetchData = async () => {
  try {
    const [tasksResponse, tagsResponse, timestampsResponse, settingsResponse] =
      await Promise.all([
        fetch(`${API}/tasks`),
        fetch(`${API}/tags`),
        fetch(`${API}/timestamps`),
        fetch(`${API}/options`),
      ]);

    if (
      !tasksResponse.ok ||
      !tagsResponse.ok ||
      !timestampsResponse.ok ||
      !settingsResponse.ok
    ) {
      throw new Error("Failed to fetch data");
    }

    const tasksData = await tasksResponse.json();
    const tagsData = await tagsResponse.json();
    const timestampsData = await timestampsResponse.json();
    const settingsData = await settingsResponse.json();

    return { tasksData, tagsData, timestampsData, settingsData };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw to handle in the calling function
  }
};

export const addTag = async (name) => {
  try {
    const response = await fetch(`${API}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error("Failed to add tag");
    }
    const data = await response.json()
    return data.id; // Return new tag ID
  } catch (error) {
    console.error("Error adding tag:", error);
    throw error;
  }
};

const checkIfTagsExists = async (tags, existingTags) => {
  try {
    const newTags = tags.split(",").map((tag) => tag.trim());
    const existingTagIds = [];
    const newTagObjects = [];

    for (const tag of newTags) {
      const existingTag = existingTags.find((existingTag) => existingTag.name === tag);
      if (existingTag) {
        existingTagIds.push(existingTag.id);
      } else {
        const newTagId = await addTag(tag);
        newTagObjects.push({ id: newTagId, name: tag }); 
        existingTagIds.push(newTagId);
      }
    }
    return { existingTagIds, newTagObjects };
  } catch (error) {
    console.error("Error checking or adding tags:", error);
    throw error;
  }
};

export const addTask = async (newTaskData, existingTags) => {
  try {
    const { existingTagIds, newTagObjects } = await checkIfTagsExists(newTaskData.tags, existingTags);
    newTaskData.tags = existingTagIds.join(",");
    const response = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTaskData),
    });

    if (!response.ok) {
      throw new Error("Failed to add new task");
    }
    const newTaskResponse = await response.json();
    const newTaskObject = {
      id: newTaskResponse.id,
      name: newTaskData.name,
      tags: newTaskData.tags,
    }
    return { newTaskObject, newTagObjects };
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

// Delete task and all timestamps associated with it
export const deleteTask = async (id, timestamps) => {
  try {
    const response = await fetch(`${API}/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
    await deleteTimestamps(id, timestamps);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Delete tag and remove deleted tag from all existing tasks housing it
export const deleteTag = async (tagId, tasks) => {
  try {
    const deleteResponse = await fetch(`${API}/tags/${tagId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!deleteResponse.ok) {
      throw new Error("Failed to delete tag");
    }
////CHECK IF OTHER FUNCTIONS CAN USE SAME .includes FUNCTION////////////////////////////////////////////////////////////////////////
    // Find tasks with the id of the deleted tag
    const tasksToUpdate = tasks.filter((task) => task.tags.includes(tagId));

    for (const task of tasksToUpdate) {
      const updatedTags = task.tags
        .split(",")
        .filter((id) => id !== String(tagId))
        .join(",");

      await fetch(`${API}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, tags: updatedTags }),
      });
    }
  } catch (error) {
    console.error("Error deleting tag or updating tasks:", error);
    throw error;
  }
};

export const updateTask = async (id, updatedTask, allTags) => {
  try {
    const { existingTagIds, newTagObjects }= await checkIfTagsExists(updatedTask.tags, allTags);
    // Copy the object so as not to manipulate original data
    const updatedTaskCopy = {...updatedTask};
    updatedTaskCopy.tags = existingTagIds.join(",");

    const response = await fetch(`${API}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTaskCopy),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }
    const updatedTaskResponse = await response.json();
    const updatedTaskObject = {
      id: updatedTaskResponse.id,
      name: updatedTask.name,
      tags: updatedTask.tags
    }
    return { updatedTaskObject, newTagObjects };
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const addTimestamp = async (time, task, type) => {
  try {
    const response = await fetch(`${API}/timestamps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timestamp: time,
        task: task,
        type: type,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add timestamp");
    }
    const newTimestampResponse = await response.json();
    const newTimestampObject = {
      id: newTimestampResponse.id,
      timestamp: time,
      task: task,
      type: type
    }
    return newTimestampObject;
  } catch (error) {
    console.error("Error adding timestamp:", error);
    throw error;
  }
}

const deleteTimestamps = async (taskId, timestamps) => {
  for (const timestamp of timestamps) {
    if (timestamp.task === taskId) {
      try {
        const response = await fetch(`${API}/timestamps/${timestamp.id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete timestamp");
        }
      } catch (error) {
        console.error("Error deleting timestamp:", error);
        throw error;
      }
    }
  }
};
