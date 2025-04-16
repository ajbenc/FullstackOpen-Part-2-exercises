// eslint-disable-next-line no-undef
const baseUrl = process.env.REACT_APP_API_URL;
if (!baseUrl) {
  console.error("REACT_APP_API_URL is not defined! Falling back to http://localhost:3001");
}
const apiUrl = `${baseUrl || "http://localhost:3001"}/api/persons`;

// Debug: Log the API URL in use
console.log("Using API URL:", apiUrl);

// GET all persons
export const getAllPersons = async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error fetching persons: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch persons:", error);
    throw error;
  }
};

// POST a new person
export const createPerson = async (newPerson) => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPerson)
    });
    if (!response.ok) {
      throw new Error(`Error creating person: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to create person:", error);
    throw error;
  }
};

// PUT (update) an existing person
export const updatePerson = async (id, updatedPerson) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedPerson)
    });
    if (!response.ok) {
      throw new Error(`Error updating person: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to update person:", error);
    throw error;
  }
};

// DELETE a person
export const deletePerson = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error(`Error deleting person: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to delete person:", error);
    throw error;
  }
};

export default {
  getAllPersons,
  createPerson,
  updatePerson,
  deletePerson
};
