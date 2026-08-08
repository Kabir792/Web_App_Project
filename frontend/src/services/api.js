/**
 * Student & Auth API Service
 * Handles async REST requests to the FastAPI Backend.
 */

const BACKEND_BASE = 'http://127.0.0.1:5000/api';

async function fetchWithFallback(urlPath, options = {}) {
  try {
    const res = await fetch(urlPath, options);
    if (res.ok) return await res.json();
    const data = await res.json();
    return data;
  } catch (err1) {
    try {
      const fullUrl = urlPath.replace('/api', BACKEND_BASE);
      const res2 = await fetch(fullUrl, options);
      return await res2.json();
    } catch (err2) {
      console.error('API Fetch Error:', err2);
      return { success: false, message: 'Could not connect to FastAPI backend server (Port 5000).' };
    }
  }
}

/**
 * Login user via User ID & Password
 * @param {string} userId
 * @param {string} password
 */
export async function loginUser(userId, password) {
  return await fetchWithFallback('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, username: userId, password })
  });
}

/**
 * Register a new student
 */
export async function registerStudent(studentData) {
  return await fetchWithFallback('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });
}

/**
 * Update an existing student record
 */
export async function updateStudent(studentId, updatedData) {
  return await fetchWithFallback(`/api/students/${studentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });
}

/**
 * Delete a student record
 */
export async function deleteStudent(studentId) {
  return await fetchWithFallback(`/api/students/${studentId}`, {
    method: 'DELETE'
  });
}

/**
 * Fetch all registered students
 */
export async function fetchStudents() {
  try {
    const res = await fetchWithFallback('/api/students');
    if (res && res.data) return res.data;
    if (Array.isArray(res)) return res;
    return [];
  } catch (error) {
    console.error('API Error fetching students:', error);
    return [];
  }
}
