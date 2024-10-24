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

//can replace with useState(tags) in React
const fetchTags = async () => {
  try {
    const response = await fetch(`${API}/tags`);
    if (!response.ok) {
      throw new Error("Failed to fetch tags");
    }
    const data = await response.json();
    return data; // Return array of tag objects
  } catch (error) {
    console.error("Error getting: ", error);
    throw error;
  }
};

const checkIfTagsExists = async (tags) => {
  try {
    const existingTags = await fetchTags();
    const newTags = tags.split(",").map((tag) => tag.trim());
    const tagIds = [];
    for (const tag of newTags) {
      const existingTag = existingTags.find(
        (existingTag) => existingTag.name === tag
      );
      if (existingTag) {
        tagIds.push(existingTag.id);
        console.log(`Tag already exists: ${tag}`);
      } else {
        const newTag = await addTag(tag);
        tagIds.push(newTag.id); // Push new tag's ID
        console.log(`Added new tag: ${tag}`);
      }
    }
    return tagIds.join(",");
  } catch (error) {
    console.error("Error checking or adding tags:", error);
    throw error;
  }
};

export const addTask = async (newTaskData) => {
  try {
    // Make copy so as not to manipulate original data
    const taskDataCopy = { ...newTaskData };
    const newTagIDs = await checkIfTagsExists(newTaskData.tags);
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

export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${API}/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

//Might need to add second argument of React's tags useState
export const deleteTag = async (tagId) => {
  try {
    const deleteResponse = await fetch(`${API}/tags/${tagId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!deleteResponse.ok) {
      throw new Error("Failed to delete tag");
    }

    console.log(`Tag with ID ${tagId} deleted successfully`);

    // Get all current tasks
    // Change to React's tags useState
    const tasksResponse = await fetch(`${API}/tasks`);
    if (!tasksResponse.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const tasks = await tasksResponse.json();
    // Find tasks with the id of the deleted tag
    const tasksToUpdate = tasks.filter((task) => task.tags.includes(tagId));

    // Update each task that had the deleted tag
    for (const task of tasksToUpdate) {
      // Remove the tag ID from the task's tags
      const updatedTags = task.tags
        .split(",")
        .filter((id) => id !== String(tagId))
        .join(",");

      await fetch(`${API}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, tags: updatedTags }),
      });

      console.log(`Task ${task.id} updated to remove tag ${tagId}`);
    }

    console.log(`All tasks updated to remove the deleted tag ${tagId}`);
  } catch (error) {
    console.error("Error deleting tag or updating tasks:", error);
    throw error;
  }
};

export const updateTask = async (id, updatedTask) => {
  try {
    const newTagIDs = await checkIfTagsExists(updatedTask.tags);
    updatedTask.tags = newTagIDs; // Update tags to be tag IDs with "," delimiter

    const response = await fetch(`${API}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    return await response.json(); // Return the updated task data
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};
