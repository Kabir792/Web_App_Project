import Dexie from 'dexie';

export const db = new Dexie('SmartCampusDB');

// Define database schema
db.version(1).stores({
  assignments: 'id, course_code, priority, is_completed, sync_status, updated_at',
  courses: 'id, code, title',
  locations: 'id, name, category',
  syncQueue: '++id, item_id, action, timestamp'
});

// Initial seed data if local DB is empty
export async function seedLocalDatabase() {
  const assignmentCount = await db.assignments.count();
  if (assignmentCount === 0) {
    await db.assignments.bulkAdd([
      {
        id: "asgn-1",
        course_id: "crs-101",
        course_code: "CSE401",
        title: "System Architecture & UML Diagrams",
        description: "Submit complete Sequence & Component diagrams for the Capstone Project.",
        due_date: "2026-08-15T23:59:00",
        priority: "high",
        is_completed: false,
        sync_status: "synced",
        updated_at: new Date().toISOString()
      },
      {
        id: "asgn-2",
        course_id: "crs-102",
        course_code: "CSE409",
        title: "RAG Pipeline Benchmark Report",
        description: "Evaluate LlamaIndex vs LangChain performance on vector retrieval tasks.",
        due_date: "2026-08-20T18:00:00",
        priority: "medium",
        is_completed: false,
        sync_status: "synced",
        updated_at: new Date().toISOString()
      },
      {
        id: "asgn-3",
        course_id: "crs-103",
        course_code: "CSE415",
        title: "Dockerized Microservice Deployment",
        description: "Deploy 3 microservices with Nginx API gateway on local Kubernetes / Docker Compose.",
        due_date: "2026-08-10T23:59:00",
        priority: "high",
        is_completed: true,
        sync_status: "synced",
        updated_at: new Date().toISOString()
      }
    ]);
  }

  const courseCount = await db.courses.count();
  if (courseCount === 0) {
    await db.courses.bulkAdd([
      { id: "crs-101", code: "CSE401", title: "Software Engineering & Architecture", instructor: "Dr. Ariful Islam", room: "Lab 402", schedule: "Sun/Tue 10:00 AM", color: "#6366f1", attended: 14, total: 16 },
      { id: "crs-102", code: "CSE409", title: "Machine Learning & AI", instructor: "Prof. Farhana Nusrat", room: "Room 501", schedule: "Mon/Wed 11:30 AM", color: "#ec4899", attended: 11, total: 15 },
      { id: "crs-103", code: "CSE415", title: "Distributed Systems & Cloud", instructor: "Engr. Tanvir Ahmed", room: "Lab 305", schedule: "Thu 09:00 AM", color: "#10b981", attended: 12, total: 14 }
    ]);
  }
}
