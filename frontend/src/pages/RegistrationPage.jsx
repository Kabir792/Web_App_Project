import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudentForm from '../components/StudentForm';
import StudentCard from '../components/StudentCard';
import StudentEditModal from '../components/StudentEditModal';
import StudentTranscriptModal from '../components/StudentTranscriptModal';
import AlertMessage from '../components/AlertMessage';
import { fetchStudents, deleteStudent } from '../services/api';
import { Users, RefreshCw, Search, Award, Calendar, BookOpen, UserCheck, FileText } from 'lucide-react';

export default function RegistrationPage({ user, onLogout, onSwitchModule, onOpenGrades }) {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingStudent, setEditingStudent] = useState(null);

  // Transcript Report Modal State
  const [selectedReportStudentId, setSelectedReportStudentId] = useState(null);

  // Feedback Banner State
  const [pageAlert, setPageAlert] = useState(null);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load students:', err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleStudentRegistered = (newStudent) => {
    if (newStudent) {
      setStudents((prev) => [newStudent, ...(Array.isArray(prev) ? prev : [])]);
    } else {
      loadStudents();
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
  };

  const handleEditSaved = (updatedStudent) => {
    setStudents((prev) =>
      (Array.isArray(prev) ? prev : []).map((s) => (s.student_id === updatedStudent.student_id ? updatedStudent : s))
    );
    setPageAlert({
      type: 'success',
      title: 'Record Updated',
      message: `Student '${updatedStudent.name}' (ID: ${updatedStudent.student_id}) has been updated.`
    });
  };

  const handleDeleteClick = async (studentId, studentName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete student "${studentName}" (ID: ${studentId})?`
    );
    if (!confirmDelete) return;

    const res = await deleteStudent(studentId);
    if (res?.success) {
      setStudents((prev) => (Array.isArray(prev) ? prev : []).filter((s) => s.student_id !== studentId));
      setPageAlert({
        type: 'success',
        title: 'Record Removed',
        message: `Student record '${studentName}' (ID: ${studentId}) was deleted successfully.`
      });
    } else {
      setPageAlert({
        type: 'error',
        title: 'Delete Failed',
        message: res?.message || 'Unable to delete student record.'
      });
    }
  };

  // Safe Filtered Directory
  const studentList = Array.isArray(students) ? students : [];
  const filteredStudents = studentList.filter((student) => {
    if (!student) return false;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (student.name && String(student.name).toLowerCase().includes(query)) ||
      (student.student_id && String(student.student_id).toLowerCase().includes(query)) ||
      (student.department && String(student.department).toLowerCase().includes(query)) ||
      (student.email && String(student.email).toLowerCase().includes(query))
    );
  });

  const studentReportHeaders = [
    { label: 'Student ID', key: 'student_id' },
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Department', key: 'department' },
    { label: 'Session', key: 'session' },
    { label: 'Semester', key: 'semester' },
    { label: 'Status', key: 'status' }
  ];

  return (
    <div className="app-container">
      <Header user={user} onLogout={onLogout} onSwitchModule={onSwitchModule} onOpenGrades={onOpenGrades} />

      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Student Registration System</h1>
          <p className="page-subtitle">
            Web Applications &amp; Internet Course &bull; Academic Portal
          </p>
        </div>

        {/* Portal Metrics Grid */}
        <div className="portal-metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">
              <UserCheck size={22} />
            </div>
            <div className="metric-info">
              <label>Portal Status</label>
              <span style={{ color: '#10b981' }}>LOGGED IN ({user?.role || 'ADMIN'})</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <Award size={22} />
            </div>
            <div className="metric-info">
              <label>User ID &amp; Role</label>
              <span>{user?.user_id || '2220792'} &bull; {user?.role === 'TEACHER' ? 'Teacher' : 'Admin'}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <Calendar size={22} />
            </div>
            <div className="metric-info">
              <label>Academic Term</label>
              <span>Autumn 2026</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <BookOpen size={22} />
            </div>
            <div className="metric-info">
              <label>Total Registered</label>
              <span>{studentList.length} Students</span>
            </div>
          </div>
        </div>

        {pageAlert && (
          <AlertMessage
            type={pageAlert.type}
            title={pageAlert.title}
            message={pageAlert.message}
          />
        )}

        <div className="content-grid">
          {/* Left Column: Student Registration Form */}
          <StudentForm onSuccess={handleStudentRegistered} />

          {/* Right Column: Registered Students Directory Feed */}
          <div className="students-list-panel">
            <div className="panel-header" style={{ flexDirection: 'column', gap: '0.85rem', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div className="panel-title">
                  <Users size={20} color="#f59e0b" />
                  <span>Registered Directory</span>
                  <span className="count-chip">{filteredStudents.length}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={loadStudents}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                      padding: '0.4rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8rem'
                    }}
                    title="Refresh student directory"
                  >
                    <RefreshCw size={12} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Directory Search Bar */}
              <div className="input-wrapper">
                <Search className="input-icon" size={16} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search directory by Student ID, Name, Department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.5rem', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div className="cards-scroll-area">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                  Fetching student directory...
                </div>
              ) : filteredStudents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                  No students found matching "{searchQuery}".
                </div>
              ) : (
                filteredStudents.map((student, index) => (
                  <StudentCard
                    key={student.student_id || index}
                    student={student}
                    userRole={user?.role || 'ADMIN'}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onViewReport={(id) => setSelectedReportStudentId(id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Student Modal */}
      {editingStudent && (
        <StudentEditModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSaveSuccess={handleEditSaved}
        />
      )}

      {/* Student ID-Wise Transcript PDF Modal */}
      {selectedReportStudentId && (
        <StudentTranscriptModal
          studentId={selectedReportStudentId}
          onClose={() => setSelectedReportStudentId(null)}
        />
      )}

      <Footer />
    </div>
  );
}
