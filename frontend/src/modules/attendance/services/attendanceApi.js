/**
 * Attendance Management REST API Service Client
 * Developer: Shawon Afrin Badhon (Student ID: 2222625)
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    const cleanUrl = envUrl.replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  return 'http://127.0.0.1:5000/api';
};

const API_BASE = getApiBaseUrl();

async function fetchWithFallback(urlPath, options = {}) {
  const targetUrl = urlPath.startsWith('/api')
    ? API_BASE + urlPath.substring(4)
    : (urlPath.startsWith('/') ? API_BASE + urlPath : `${API_BASE}/${urlPath}`);

  try {
    const res = await fetch(targetUrl, options);
    if (res.ok) return await res.json();
    const data = await res.json();
    return data;
  } catch (err1) {
    try {
      const res2 = await fetch(urlPath, options);
      return await res2.json();
    } catch (err2) {
      console.error('API Fetch Error:', err2);
      return { success: false, message: 'Could not connect to backend server.' };
    }
  }
}

/**
 * Fetch all attendance records & summary metrics
 */
export async function getAttendanceApi() {
  return await fetchWithFallback('/api/attendance');
}

export async function registerStudentApi(studentData) {
  return await fetchWithFallback('/api/students/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(studentData)
  });
}

export async function getRegisteredStudentsApi() {
  return await fetchWithFallback('/api/students/registered');
}

/**
 * Search and filter attendance records
 * @param {Object} filters - { query, date, studentId, status }
 */
export async function searchAttendanceApi(filters = {}) {
  const params = new URLSearchParams();
  if (filters.query) params.append('query', filters.query);
  if (filters.date) params.append('date', filters.date);
  if (filters.studentId) params.append('studentId', filters.studentId);
  if (filters.status) params.append('status', filters.status);

  return await fetchWithFallback(`/api/attendance/search?${params.toString()}`);
}

/**
 * Mark new attendance record (POST /api/attendance)
 */
export async function markAttendanceApi(attendanceData) {
  return await fetchWithFallback('/api/attendance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(attendanceData)
  });
}

/**
 * Edit attendance record by ID (PUT /api/attendance/<id>)
 */
export async function editAttendanceApi(id, attendanceData) {
  return await fetchWithFallback(`/api/attendance/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(attendanceData)
  });
}

/**
 * Delete attendance record by ID (DELETE /api/attendance/<id>)
 */
export async function deleteAttendanceApi(id) {
  return await fetchWithFallback(`/api/attendance/${id}`, {
    method: 'DELETE'
  });
}
