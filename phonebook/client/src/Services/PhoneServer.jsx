/*
  PhoneServer.jsx - Production-grade service for API communication
  Features:
  - Automatic retry logic
  - Enhanced error handling
  - CORS optimization
  - Security headers
  - Request timeouts
*/

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://fullstackopen-part-2-exercises.onrender.com';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const PERSONS_URL = `${API_BASE_URL}/api/persons`;

// Configure retry parameters
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 2000,
  retryStatuses: [429, 502, 503, 504],
};

// Global request timeout (10 seconds)
const REQUEST_TIMEOUT = 10000;

// Unified fetch handler with retry logic
const fetchWithRetry = async (url, options = {}, retries = RETRY_CONFIG.maxRetries) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` }),
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (RETRY_CONFIG.retryStatuses.includes(response.status) && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.retryDelay));
      return fetchWithRetry(url, options, retries - 1);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name !== 'AbortError' && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.retryDelay));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

// Enhanced response handler
const handleResponse = async (response) => {
  // Handle CORS-related errors
  if (response.status === 403) {
    const errorData = await response.json().catch(() => ({}));
    if (errorData.code === 'CORS_FORBIDDEN') {
      window.location.reload();
      return;
    }
  }

  // Handle empty responses
  const contentLength = response.headers.get('Content-Length');
  if (response.status === 204 || contentLength === '0') {
    return null;
  }

  // Handle error responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText,
    }));
    
    throw new Error(errorData.message || `HTTP Error ${response.status}`);
  }

  return response.json();
};

// API Methods
export const getAllPersons = async () => {
  try {
    const response = await fetchWithRetry(PERSONS_URL);
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch persons:', error.message);
    throw new Error('Connection to server failed. Please try again later.');
  }
};

export const createPerson = async (newPerson) => {
  try {
    const response = await fetchWithRetry(PERSONS_URL, {
      method: 'POST',
      body: JSON.stringify(newPerson),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to create person:', error.message);
    throw new Error(`Failed to create entry: ${error.message}`);
  }
};

export const updatePerson = async (id, updatedPerson) => {
  try {
    const response = await fetchWithRetry(`${PERSONS_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedPerson),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Failed to update person ${id}:`, error.message);
    throw new Error(`Update failed: ${error.message}`);
  }
};

export const deletePerson = async (id) => {
  try {
    const response = await fetchWithRetry(`${PERSONS_URL}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Failed to delete person ${id}:`, error.message);
    throw new Error(`Deletion failed: ${error.message}`);
  }
};

// Service Export
export default {
  getAll: getAllPersons,
  createPerson,
  updatePerson,
  deletePerson,
};