/**
 * Student & Auth API Service
 * Handles async REST requests to the Flask Backend.
 */

const API_BASE_URL = '/api';

/**
 * Login user via User ID & Password
 * @param {string} userId
 * @param {string} password
 */
export async function loginUser(userId, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, password })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Server connection failed' };
  }
}

/**
 * Register a new student
 */
export async function registerStudent(studentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Registration failed.',
        errors: data.errors || null,
        status: response.status
      };
    }
    return { success: true, message: data.message, data: data.data };
  } catch (error) {
    console.error('API Error during student registration:', error);
    return {
      success: false,
      message: 'Unable to connect to Flask API server.'
    };
  }
}

/**
 * Update an existing student record
 */
export async function updateStudent(studentId, updatedData) {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Update failed.',
        errors: data.errors || null
      };
    }
    return { success: true, message: data.message, data: data.data };
  } catch (error) {
    console.error('Update API Error:', error);
    return { success: false, message: 'Server error during update.' };
  }
}

/**
 * Delete a student record
 */
export async function deleteStudent(studentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Delete API Error:', error);
    return { success: false, message: 'Server error during delete.' };
  }
}

/**
 * Fetch all registered students
 */
export async function fetchStudents() {
  try {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) throw new Error('Failed to fetch students');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('API Error fetching students:', error);
    return [];
  }
}
