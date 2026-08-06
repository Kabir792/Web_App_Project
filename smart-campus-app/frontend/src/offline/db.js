import Dexie from 'dexie';

export const db = new Dexie('IUBSmartCampusDB');

db.version(3).stores({
  assignments: 'id, course_code, task_type, priority, is_completed, sync_status, updated_at',
  courses: 'id, code, title, department',
  locations: 'id, name, category',
  syncQueue: '++id, item_id, action, timestamp'
});

export const IUB_LOGO_URL = "/iub-logo.png";

export const TASK_TYPES = [
  { id: 'quiz', label: 'Quiz / Class Test', icon: '📝', color: '#a855f7' },
  { id: 'assignment', label: 'Assignment', icon: '📄', color: '#3b82f6' },
  { id: 'midterm', label: 'Midterm Exam', icon: '🎯', color: '#f59e0b' },
  { id: 'final', label: 'Final Exam', icon: '🏆', color: '#ef4444' },
  { id: 'lab_report', label: 'Lab Report', icon: '🔬', color: '#06b6d4' }
];

export async function seedLocalDatabase() {
  const assignmentCount = await db.assignments.count();
  if (assignmentCount === 0) {
    await db.assignments.bulkAdd([
      {
        id: "task-1",
        course_id: "iub-csc401",
        course_code: "CSC401",
        task_type: "midterm",
        title: "CSC401 Midterm Examination",
        description: "Covers UML Diagrams, Design Patterns & Agile Principles. Venue: SETS Gallery 4001.",
        due_date: "2026-08-12T10:00:00",
        priority: "high",
        is_completed: false,
        sync_status: "synced",
        updated_at: new Date().toISOString()
      },
      {
        id: "task-2",
        course_id: "iub-csc201",
        course_code: "CSC201",
        task_type: "quiz",
        title: "Graph Algorithms & Tree Traversals Quiz",
        description: "15-minute surprise class test at the beginning of lecture.",
        due_date: "2026-08-08T10:00:00",
        priority: "high",
        is_completed: false,
        sync_status: "synced",
        updated_at: new Date().toISOString()
      },
      {
        id: "task-3",
        course_id: "iub-csc307",
        course_code: "CSC307",
        task_type: "lab_report",
        title: "React Hooks & PWA Service Worker Lab Report",
        description: "Submit PDF report with code snippets & performance metrics on IUB Canvas.",
        due_date: "2026-08-09T23:59:00",
        priority: "medium",
        is_completed: false,
        sync_status: "synced",
        updated_at: new Date().toISOString()
      }
    ]);
  }

  const masterCourses = [
    { id: "iub-csc101", code: "CSC101", title: "Introduction to Computer Science", department: "SETS / CSE", instructor: "Dr. Mahady Hasan", room: "Room 4001, SETS", schedule: "Sun/Tue 08:30 AM", color: "#6366f1", attended: 15, total: 16 },
    { id: "iub-csc101l", code: "CSC101L", title: "Computer Science Lab", department: "SETS / CSE", instructor: "Engr. Naimur Rahman", room: "Lab 5001, SETS", schedule: "Thu 10:00 AM", color: "#4f46e5", attended: 14, total: 14 },
    { id: "iub-csc201", code: "CSC201", title: "Data Structures & Algorithms", department: "SETS / CSE", instructor: "Prof. Aminur Rahman", room: "Lab 5002, SETS", schedule: "Mon/Wed 10:00 AM", color: "#3b82f6", attended: 14, total: 15 },
    { id: "iub-csc201l", code: "CSC201L", title: "Data Structures Lab", department: "SETS / CSE", instructor: "Engr. Naimur Rahman", room: "Lab 5002, SETS", schedule: "Thu 01:00 PM", color: "#2563eb", attended: 13, total: 14 },
    { id: "iub-csc301", code: "CSC301", title: "Object Oriented Programming (Java/C++)", department: "SETS / CSE", instructor: "Dr. Sadita Ahmed", room: "Lab 5003, SETS", schedule: "Sun/Tue 11:30 AM", color: "#06b6d4", attended: 12, total: 14 },
    { id: "iub-csc303", code: "CSC303", title: "Database Management Systems (PostgreSQL)", department: "SETS / CSE", instructor: "Engr. Tanvir Ahmed", room: "Lab 5004, SETS", schedule: "Mon/Wed 01:00 PM", color: "#14b8a6", attended: 13, total: 14 },
    { id: "iub-csc305", code: "CSC305", title: "Computer Architecture & Organization", department: "SETS / CSE", instructor: "Dr. Mahady Hasan", room: "Room 4003, SETS", schedule: "Sun/Tue 01:00 PM", color: "#0d9488", attended: 14, total: 15 },
    { id: "iub-csc307", code: "CSC307", title: "Web Applications & Internet Technologies", department: "SETS / CSE", instructor: "Dr. Mahady Hasan", room: "Lab 4002, SETS", schedule: "Thu 09:00 AM", color: "#10b981", attended: 16, total: 16 },
    { id: "iub-csc309", code: "CSC309", title: "Operating Systems & Kernel Architecture", department: "SETS / CSE", instructor: "Dr. Mahady Hasan", room: "Lab 5001, SETS", schedule: "Sun/Tue 02:30 PM", color: "#8b5cf6", attended: 13, total: 15 },
    { id: "iub-csc317", code: "CSC317", title: "Computer Networks & Security Protocol", department: "SETS / CSE", instructor: "Engr. Naimur Rahman", room: "Lab 5005, SETS", schedule: "Mon/Wed 08:30 AM", color: "#a855f7", attended: 12, total: 14 },
    { id: "iub-csc401", code: "CSC401", title: "Software Engineering & System Architecture", department: "SETS / CSE", instructor: "Dr. Mahady Hasan", room: "Room 4002, SETS", schedule: "Sun/Tue 10:00 AM", color: "#d946ef", attended: 14, total: 16 },
    { id: "iub-csc409", code: "CSC409", title: "Machine Learning & Neural Networks", department: "SETS / CSE", instructor: "Prof. Farhana Nusrat", room: "Lab 5001, SETS", schedule: "Mon/Wed 11:30 AM", color: "#ec4899", attended: 11, total: 15 },
    { id: "iub-csc415", code: "CSC415", title: "Cloud Computing & Distributed Systems", department: "SETS / CSE", instructor: "Dr. Sadita Ahmed", room: "Lab 5004, SETS", schedule: "Thu 09:00 AM", color: "#f43f5e", attended: 12, total: 14 },
    { id: "iub-csc420", code: "CSC420", title: "Cybersecurity & Ethical Hacking", department: "SETS / CSE", instructor: "Engr. Naimur Rahman", room: "Lab 5005, SETS", schedule: "Sun/Tue 02:30 PM", color: "#f97316", attended: 10, total: 12 },
    { id: "iub-csc425", code: "CSC425", title: "Artificial Intelligence & Robotics", department: "SETS / CSE", instructor: "Prof. Farhana Nusrat", room: "AI Lab, SETS", schedule: "Mon/Wed 02:30 PM", color: "#e11d48", attended: 12, total: 13 },
    { id: "iub-csc430", code: "CSC430", title: "Data Science & Big Data Analytics", department: "SETS / CSE", instructor: "Prof. Aminur Rahman", room: "Lab 5002, SETS", schedule: "Sun/Tue 11:30 AM", color: "#be185d", attended: 11, total: 12 },
    { id: "iub-csc499", code: "CSC499", title: "Senior Capstone Design Project I & II", department: "SETS / CSE", instructor: "Dr. Mahady Hasan", room: "SETS Project Studio", schedule: "Fri 09:00 AM", color: "#ef4444", attended: 8, total: 8 },
    { id: "iub-eee101", code: "EEE101", title: "Electrical Circuits I & Electronics", department: "EEE", instructor: "Dr. Mustafa Habib", room: "EEE Lab 3001", schedule: "Mon/Wed 08:30 AM", color: "#eab308", attended: 15, total: 16 },
    { id: "iub-eee102", code: "EEE102", title: "Electrical Circuits II & AC Analysis", department: "EEE", instructor: "Dr. Mustafa Habib", room: "EEE Lab 3002", schedule: "Sun/Tue 10:00 AM", color: "#d97706", attended: 13, total: 14 },
    { id: "iub-eee201", code: "EEE201", title: "Signals & Systems Analysis", department: "EEE", instructor: "Dr. Mustafa Habib", room: "EEE Lab 3002", schedule: "Sun/Tue 11:30 AM", color: "#ca8a04", attended: 13, total: 15 },
    { id: "iub-eee301", code: "EEE301", title: "Digital Signal Processing (DSP)", department: "EEE", instructor: "Prof. Jahangir Alam", room: "EEE Lab 3004", schedule: "Mon/Wed 01:00 PM", color: "#b45309", attended: 12, total: 14 },
    { id: "iub-eee401", code: "EEE401", title: "Telecommunication & Wireless Networks", department: "EEE", instructor: "Prof. Jahangir Alam", room: "EEE Lab 3005", schedule: "Thu 09:00 AM", color: "#92400e", attended: 11, total: 13 },
    { id: "iub-mat101", code: "MAT101", title: "Differential & Integral Calculus", department: "Mathematics", instructor: "Prof. Shahriar Hossain", room: "Gallery 1002", schedule: "Sun/Tue 01:00 PM", color: "#84cc16", attended: 13, total: 15 },
    { id: "iub-mat102", code: "MAT102", title: "Coordinate Geometry & Vector Analysis", department: "Mathematics", instructor: "Prof. Shahriar Hossain", room: "Gallery 1003", schedule: "Mon/Wed 08:30 AM", color: "#65a30d", attended: 14, total: 15 },
    { id: "iub-mat201", code: "MAT201", title: "Linear Algebra & Differential Equations", department: "Mathematics", instructor: "Prof. Shahriar Hossain", room: "Gallery 1003", schedule: "Mon/Wed 02:30 PM", color: "#4d7c0f", attended: 12, total: 14 },
    { id: "iub-phy101", code: "PHY101", title: "Engineering Physics I & Mechanics", department: "Mathematics", instructor: "Dr. Kabir Ahmed", room: "Physics Lab 1001", schedule: "Sun/Tue 08:30 AM", color: "#3f6212", attended: 15, total: 16 },
    { id: "iub-eng101", code: "ENG101", title: "Public Speaking & Communication", department: "General Education", instructor: "Ms. Tasnim Chowdhury", room: "Room 2005", schedule: "Thu 01:00 PM", color: "#a855f7", attended: 14, total: 14 },
    { id: "iub-eng105", code: "ENG105", title: "Advanced English Composition", department: "General Education", instructor: "Ms. Tasnim Chowdhury", room: "Room 2006", schedule: "Sun/Tue 02:30 PM", color: "#9333ea", attended: 13, total: 14 },
    { id: "iub-bus101", code: "BUS101", title: "Introduction to Business & Ethics", department: "School of Business", instructor: "Dr. Faisal Ahmed", room: "Business Block 301", schedule: "Sun/Tue 08:30 AM", color: "#0284c7", attended: 15, total: 16 },
    { id: "iub-bus201", code: "BUS201", title: "Principles of Management", department: "School of Business", instructor: "Dr. Faisal Ahmed", room: "Business Block 302", schedule: "Mon/Wed 02:30 PM", color: "#0369a1", attended: 12, total: 13 },
    { id: "iub-mkt201", code: "MKT201", title: "Principles of Marketing Strategy", department: "School of Business", instructor: "Ms. Samira Khan", room: "Business Block 401", schedule: "Sun/Tue 01:00 PM", color: "#0891b2", attended: 13, total: 14 },
    { id: "iub-act101", code: "ACT101", title: "Financial Accounting I", department: "School of Business", instructor: "Mr. Rafiqul Islam", room: "Business Block 201", schedule: "Mon/Wed 10:00 AM", color: "#0e7490", attended: 14, total: 15 },
    { id: "iub-bio101", code: "BIO101", title: "General Biology & Environmental Science", department: "Life Sciences", instructor: "Dr. Sharmeen Parveen", room: "Bio Lab 2001", schedule: "Thu 10:00 AM", color: "#16a34a", attended: 11, total: 12 },
    { id: "iub-phr101", code: "PHR101", title: "Principles of Pharmacy & Pharmacology", department: "Life Sciences", instructor: "Dr. Sharmeen Parveen", room: "Pharmacy Lab 2002", schedule: "Sun/Tue 10:00 AM", color: "#15803d", attended: 13, total: 14 }
  ];

  await db.courses.clear();
  await db.courses.bulkAdd(masterCourses);
}
