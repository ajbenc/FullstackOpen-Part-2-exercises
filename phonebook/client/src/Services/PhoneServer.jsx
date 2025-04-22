/*
  PhoneServer.jsx - Service for connecting to MongoDB via Express
  
  This module handles API communication with the Express backend that 
  connects to MongoDB. It uses a direct connection approach with clear 
  error reporting.
*/

// Get API base URL from environment variable or use default
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const personsUrl = `${apiBaseUrl}/api/persons`;

console.log('PhoneServer: Using API URL:', personsUrl);

// Helper function to handle fetch responses
const handleResponse = async (response) => {
  // Log detailed response information for debugging
  console.log(`PhoneServer: Received ${response.status} ${response.statusText} from server`);
  
  if (!response.ok) {
    // Try to get detailed error message from response
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || response.statusText;
    } catch (e) {
      errorMessage = response.statusText;
      console.log(e);
      
    }
    
    throw new Error(`Server error (${response.status}): ${errorMessage}`);
  }
  
  // For successful responses, parse JSON
  return response.json();
};

// GET all persons from MongoDB
export const getAllPersons = async () => {
  try {
    console.log('PhoneServer: Fetching all persons from', personsUrl);
    
    // Make request with timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(personsUrl, { 
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    
    clearTimeout(timeoutId);
    
    const data = await handleResponse(response);
    console.log(`PhoneServer: Successfully fetched ${data.length} persons`);
    return data;
  } catch (error) {
    // Provide more helpful error messages based on error type
    if (error.name === 'AbortError') {
      console.error('PhoneServer: Request timed out. The server might be down or unreachable.');
    } else if (error.message.includes('Failed to fetch')) {
      console.error('PhoneServer: Connection failed. Check if the Express server is running on port 3001.');
      console.error('Try running: cd ExpressServer && node server.js');
    } else {
      console.error('PhoneServer: Error fetching persons:', error.message);
    }
    
    throw error;
  }
};

// POST a new person to MongoDB
export const createPerson = async (newPerson) => {
  try {
    console.log('PhoneServer: Creating new person:', newPerson);
    
    const response = await fetch(personsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPerson)
    });
    
    const data = await handleResponse(response);
    console.log('PhoneServer: Person created successfully:', data);
    return data;
  } catch (error) {
    console.error('PhoneServer: Error creating person:', error.message);
    throw error;
  }
};

// PUT (update) a person in MongoDB
export const updatePerson = async (id, updatedPerson) => {
  try {
    console.log(`PhoneServer: Updating person with ID ${id}:`, updatedPerson);
    
    const response = await fetch(`${personsUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedPerson)
    });
    
    const data = await handleResponse(response);
    console.log('PhoneServer: Person updated successfully:', data);
    return data;
  } catch (error) {
    console.error(`PhoneServer: Error updating person ${id}:`, error.message);
    throw error;
  }
};

// DELETE a person from MongoDB
export const deletePerson = async (id) => {
  try {
    console.log(`PhoneServer: Deleting person with ID ${id}`);
    
    const response = await fetch(`${personsUrl}/${id}`, {
      method: 'DELETE'
    });
    
    // DELETE may return 204 No Content
    if (response.status === 204) {
      console.log(`PhoneServer: Person ${id} deleted successfully`);
      return true;
    }
    
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error(`PhoneServer: Error deleting person ${id}:`, error.message);
    throw error;
  }
};

// Export as default object with methods
export default {
  getAll: getAllPersons,
  createPerson,
  updatePerson,
  deletePerson
};