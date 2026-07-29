import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudentForm from '../components/StudentForm';
import StudentCard from '../components/StudentCard';
import StudentEditModal from '../components/StudentEditModal';
import LoginForm from '../components/LoginForm';
import AlertMessage from '../components/AlertMessage';
import { fetchStudents, deleteStudent } from '../services/api';
import { Users, RefreshCw, Search, Award, Calendar, BookOpen, UserCheck } from 'lucide-react';

export default function RegistrationPage() {
  // Pre-seeded Admin User (Zahid Kabir Utsho - ID: 2220792)
  const [currentUser, setCurrentUser] = useState({
    user_id: '2220792',
    name: 'Zahid Kabir Utsho (Admin)',
    role: 'ADMIN'
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingStudent, setEditingStudent] = useState(null);
  
  // Feedback Banner State
  const [pageAlert, setPageAlert] = useState(null);

  const loadStudents = async () => {
    setLoading(true);
    const data = await fetchStudents();
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleStudentRegistered = (newStudent) => {
    if (newStudent) {
      setStudents((prev) => [newStudent, ...prev]);
    } else {
      loadStudents();
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
  };

  const handleEditSaved = (updatedStudent) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === updatedStudent.student_id ? updatedStudent : s))
    );
    setPageAlert({
      type: 'success',
      title: 'Record Updated',
      message: `Student '${updatedStudent.name}' (ID: ${updatedStudent.student_id}) has been updated in students.json.`
    });
  };

  const handleDeleteClick = async (studentId, studentName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete student "${studentName}" (ID: ${studentId})?\nThis action will remove the record from students.json.`
    );
    if (!confirmDelete) return;

    const res = await deleteStudent(studentId);
    if (res.success) {
      setStudents((prev) => prev.filter((s) => s.student_id !== studentId));
      setPageAlert({
        type: 'success',
        title: 'Record Removed',
        message: `Student record '${studentName}' (ID: ${studentId}) was deleted successfully.`
      });
    } else {
      setPageAlert({
        type: 'error',
        title: 'Delete Failed',
        message: res.message || 'Unable to delete student record.'
      });
    }
  };

  // Filtered Directory
  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (student.name && student.name.toLowerCase().includes(query)) ||
      (student.student_id && student.student_id.toLowerCase().includes(query)) ||
      (student.department && student.department.toLowerCase().includes(query)) ||
      (student.email && student.email.toLowerCase().includes(query))
    );
  });

  return (
    <div className="app-container">
      <Header
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
        onOpenLoginModal={() => setShowLoginModal(true)}
      />

      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Student Registration System</h1>
          <p className="page-subtitle">
            Web Applications &amp; Internet Course &bull; Academic Portal
          </p>
        </div>

        {/* Portal Metrics Grid */}
        {currentUser && (
          <div className="portal-metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">
                <UserCheck size={22} />
              </div>
              <div className="metric-info">
                <label>Admin Status</label>
                <span style={{ color: '#10b981' }}>LOGGED IN (ADMIN)</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <Award size={22} />
              </div>
              <div className="metric-info">
                <label>Admin ID &amp; Role</label>
                <span>{currentUser.user_id} &bull; Admin</span>
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
                <span>{students.length} Students</span>
              </div>
            </div>
          </div>
        )}

        {pageAlert && (
          <AlertMessage
            type={pageAlert.type}
            title={pageAlert.title}
            message={pageAlert.message}
          />
        )}

        {/* Login Screen when Admin logs out */}
        {!currentUser || showLoginModal ? (
          <LoginForm
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setShowLoginModal(false);
              setPageAlert({
                type: 'success',
                title: 'Welcome to Admin Portal',
                message: `Logged in as Admin ${user.name} (ID: ${user.user_id})`
              });
            }}
          />
        ) : (
          <div className="content-grid">
            {/* Left Column: Student Registration Form */}
            <StudentForm onSuccess={handleStudentRegistered} />

            {/* Right Column: Registered Students Directory Feed */}
            <div className="students-list-panel">
              <div className="panel-header" style={{ flexDirection: 'column', gap: '0.85rem', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="panel-title">
                    <Users size={20} color="#f59e0b" />
                    <span>Registered Directory</span>
                    <span className="count-chip">{filteredStudents.length}</span>
                  </div>
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
                      userRole="ADMIN"
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Student Modal */}
      {editingStudent && (
        <StudentEditModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSaveSuccess={handleEditSaved}
        />
      )}

      <Footer />
    </div>
  );
}
