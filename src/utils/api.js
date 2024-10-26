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

    return await response.json(); // Return the new tag data
  } catch (error) {
    console.error("Error adding tag:", error);
    throw error;
  }
};

const checkIfTagsExists = async (tags, existingTags) => {
  try {
    const newTags = tags.split(",").map((tag) => tag.trim());
    const tagIds = [];
    for (const tag of newTags) {
      const existingTag = existingTags.find(
        (existingTag) => existingTag.name === tag
      );
      if (existingTag) {
        tagIds.push(existingTag.id);
      } else {
        const newTag = await addTag(tag);
        tagIds.push(newTag.id);
      }
    }
    return tagIds.join(",");
  } catch (error) {
    console.error("Error checking or adding tags:", error);
    throw error;
  }
};

export const addTask = async (newTaskData, allTags) => {
  try {
    // Make copy so as not to manipulate original data
    const taskDataCopy = { ...newTaskData };
    const newTagIDs = await checkIfTagsExists(newTaskData.tags, allTags);
    taskDataCopy.tags = newTagIDs; // Update tags to be tag IDs with "," delimiter

    const response = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskDataCopy),
    });

    if (!response.ok) {
      throw new Error("Failed to add new task");
    }

    return await response.json(); // Return the new task data
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
    await deleteTimestamp(id, timestamps);
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
    const newTagIDs = await checkIfTagsExists(updatedTask.tags, allTags);
    updatedTask.tags = newTagIDs;

    const response = await fetch(`${API}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    return await response.json();
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

    return await response.json();
  } catch (error) {
    console.error("Error adding timestamp:", error);
    throw error;
  }
}

const deleteTimestamp = async (taskId, timestamps) => {
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
