import React, { useState, useEffect } from 'react';
import { Award, Plus, Trash2, BookOpen, Calculator, Search, ArrowLeft, Printer, FileText, UserCheck } from 'lucide-react';
import StudentTranscriptModal from '../../components/StudentTranscriptModal';
import { fetchStudents } from '../../services/api';

const API_URL = 'http://127.0.0.1:5000/api/grades';

export default function GradeManagement({ user, onLogout, onSwitchModule }) {
  const [grades, setGrades] = useState([]);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [selectedFormStudentId, setSelectedFormStudentId] = useState('');
  const [searchStudentId, setSearchStudentId] = useState('');
  const [studentSummary, setStudentSummary] = useState(null);
  const [selectedReportStudentId, setSelectedReportStudentId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    student_id: '',
    student_name: '',
    course_code: '',
    course_title: '',
    credit_hours: 3,
    marks: 85,
    semester: 'Spring 2026'
  });

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) {
        setGrades(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch grades:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRegisteredStudents = async () => {
    try {
      const list = await fetchStudents();
      if (Array.isArray(list)) {
        setRegisteredStudents(list);
      }
    } catch (err) {
      console.error('Error fetching registered students:', err);
    }
  };

  useEffect(() => {
    fetchGrades();
    loadRegisteredStudents();
  }, []);

  const handleFormStudentSelect = (e) => {
    const sid = e.target.value;
    setSelectedFormStudentId(sid);
    if (!sid) return;

    const found = registeredStudents.find(
      (s) => String(s.student_id || s.id) === String(sid)
    );
    if (found) {
      setFormData((prev) => ({
        ...prev,
        student_id: found.student_id || sid,
        student_name: found.name || ''
      }));
    }
  };

  const handleSearchStudentSelect = async (e) => {
    const sid = e.target.value;
    setSearchStudentId(sid);
    if (!sid) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${sid}`);
      const data = await res.json();
      if (data.success) {
        setStudentSummary(data.data);
      } else {
        alert(data.message || 'No grade records found for this Student ID.');
        setStudentSummary(null);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchStudentId.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${searchStudentId}`);
      const data = await res.json();
      if (data.success) {
        setStudentSummary(data.data);
      } else {
        alert(data.message || 'No grade records found for this Student ID.');
        setStudentSummary(null);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        alert('Grade record added successfully!');
        setFormData({
          student_id: '',
          student_name: '',
          course_code: '',
          course_title: '',
          credit_hours: 3,
          marks: 85,
          semester: 'Spring 2026'
        });
        fetchGrades();
        if (searchStudentId) {
          handleSearch(e);
        }
      }
    } catch (err) {
      console.error('Error adding grade:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this grade record?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchGrades();
        if (studentSummary) {
          setStudentSummary(prev => prev ? {
            ...prev,
            grades: prev.grades.filter(g => g.id !== id)
          } : null);
        }
      }
    } catch (err) {
      console.error('Delete grade error:', err);
    }
  };

  const getGradePreview = (m) => {
    const marks = parseFloat(m) || 0;
    if (marks >= 90) return { letter: 'A', point: 4.00, color: '#10b981' };
    if (marks >= 85) return { letter: 'A-', point: 3.70, color: '#10b981' };
    if (marks >= 80) return { letter: 'B+', point: 3.30, color: '#6366f1' };
    if (marks >= 75) return { letter: 'B', point: 3.00, color: '#6366f1' };
    if (marks >= 70) return { letter: 'B-', point: 2.70, color: '#f59e0b' };
    if (marks >= 65) return { letter: 'C+', point: 2.30, color: '#f59e0b' };
    if (marks >= 60) return { letter: 'C', point: 2.00, color: '#f59e0b' };
    if (marks >= 50) return { letter: 'D', point: 1.00, color: '#ef4444' };
    return { letter: 'F', point: 0.00, color: '#ef4444' };
  };

  const preview = getGradePreview(formData.marks);

  const reportHeaders = [
    { label: 'Student ID', key: 'student_id' },
    { label: 'Student Name', key: 'student_name' },
    { label: 'Course Code', key: 'course_code' },
    { label: 'Course Title', key: 'course_title' },
    { label: 'Credits', key: 'credit_hours' },
    { label: 'Marks', key: 'marks' },
    { label: 'Grade Letter', key: 'grade_letter' },
    { label: 'Grade Point', key: 'grade_point' },
    { label: 'Semester', key: 'semester' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Bar */}
      <div style={{ background: '#ffffff', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {onSwitchModule && (
            <button
              onClick={onSwitchModule}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#334155', fontWeight: '600', cursor: 'pointer' }}
            >
              <ArrowLeft size={16} /> Main Modules
            </button>
          )}
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award style={{ color: '#6366f1' }} size={24} /> Academic Grades &amp; Transcript Management
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user && (
            <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>
              User: <strong style={{ color: '#6366f1' }}>{user?.name || 'Admin'}</strong> ({user?.role || 'ADMIN'})
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', maxWidth: '1300px', margin: '0 auto' }}>
        {/* Add Grade Entry Form */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} style={{ color: '#6366f1' }} /> Add Course Grade Entry
          </h3>

          <form onSubmit={handleAddGrade} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Registered Student Select Dropdown */}
            <div style={{ background: '#f5f3ff', padding: '10px 12px', borderRadius: '10px', border: '1px solid #c7d2fe' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#4338ca', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <UserCheck size={16} color="#4338ca" />
                <span>⚡ Select Registered Student (Auto-fills ID &amp; Name) *</span>
              </label>
              <select
                value={selectedFormStudentId}
                onChange={handleFormStudentSelect}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #6366f1', fontSize: '0.9rem', fontWeight: '700', color: '#312e81', background: '#ffffff' }}
              >
                <option value="">-- Choose Student from Directory ({registeredStudents.length} Registered) --</option>
                {registeredStudents.map((s, idx) => (
                  <option key={s.student_id || idx} value={s.student_id}>
                    🎓 {s.student_id} - {s.name} ({s.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569' }}>Student ID *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2220792"
                value={formData.student_id}
                onChange={e => setFormData({ ...formData, student_id: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569' }}>Student Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Zahid Kabir Utsho"
                value={formData.student_name}
                onChange={e => setFormData({ ...formData, student_name: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569' }}>Course Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE401"
                  value={formData.course_code}
                  onChange={e => setFormData({ ...formData, course_code: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569' }}>Credit Hours</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={formData.credit_hours}
                  onChange={e => setFormData({ ...formData, credit_hours: parseInt(e.target.value) || 3 })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569' }}>Course Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Software Engineering"
                value={formData.course_title}
                onChange={e => setFormData({ ...formData, course_title: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569' }}>Marks (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.marks}
                  onChange={e => setFormData({ ...formData, marks: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569' }}>Semester</label>
                <input
                  type="text"
                  value={formData.semester}
                  onChange={e => setFormData({ ...formData, semester: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Grade Preview:</span>
              <span style={{ fontWeight: '800', fontSize: '1rem', color: preview.color, background: '#ffffff', padding: '4px 10px', borderRadius: '6px', border: `1px solid ${preview.color}` }}>
                {preview.letter} ({preview.point.toFixed(2)} GP)
              </span>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '8px',
                padding: '11px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              Add Grade Entry
            </button>
          </form>
        </div>

        {/* Search GPA & Records List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '14px', fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={18} style={{ color: '#10b981' }} /> GPA / CGPA Transcript Search
            </h3>

            {/* Registered Student Quick Select for CGPA Calculation */}
            <div style={{ marginBottom: '12px', background: '#ecfdf5', padding: '10px 12px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#047857', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <UserCheck size={16} color="#047857" />
                <span>⚡ Quick Select Student (Auto Calculates CGPA)</span>
              </label>
              <select
                value={searchStudentId}
                onChange={handleSearchStudentSelect}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #10b981', fontSize: '0.9rem', fontWeight: '700', color: '#065f46', background: '#ffffff' }}
              >
                <option value="">-- Select Student to View Transcript &amp; CGPA --</option>
                {registeredStudents.map((s, idx) => (
                  <option key={s.student_id || idx} value={s.student_id}>
                    🎓 {s.student_id} - {s.name} ({s.department})
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Enter Student ID (e.g. 2220792)"
                value={searchStudentId}
                onChange={e => setSearchStudentId(e.target.value)}
                style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
              <button
                type="submit"
                style={{
                  padding: '9px 16px',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Search size={16} /> Calculate GPA
              </button>
            </form>

            {/* Searched Student Full Transcript Result Box */}
            {studentSummary && (
              <div style={{ marginTop: '16px', background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)', padding: '18px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.2rem', fontWeight: '800' }}>{studentSummary.student_name}</h4>
                    <span style={{ fontSize: '0.85rem', color: '#047857', fontWeight: '700' }}>Student ID: {studentSummary.student_id}</span>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.85rem', color: '#065f46', fontWeight: '600' }}>
                      <span>Courses: {studentSummary.total_courses}</span>
                      <span>Total Credits: {studentSummary.total_credits}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#047857', fontWeight: '800', textTransform: 'uppercase' }}>Calculated CGPA</div>
                      <div style={{ fontSize: '1.9rem', fontWeight: '900', color: '#047857', lineHeight: 1 }}>{studentSummary.cgpa.toFixed(2)}</div>
                    </div>

                    <button
                      onClick={() => setSelectedReportStudentId(studentSummary.student_id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '800',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(30, 64, 175, 0.3)'
                      }}
                    >
                      <Printer size={15} /> Print IUB Official Transcript (PDF)
                    </button>
                  </div>
                </div>

                {/* Per-Course Grade Breakdown Table for Searched Student */}
                <div style={{ marginTop: '14px', borderTop: '1px solid #bbf7d0', paddingTop: '12px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#065f46', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Course Grade Breakdown:
                  </div>

                  {studentSummary.grades && studentSummary.grades.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', background: '#ffffff', borderRadius: '8px', overflow: 'hidden' }}>
                      <thead>
                        <tr style={{ background: '#0f172a', color: '#ffffff', textAlign: 'left' }}>
                          <th style={{ padding: '7px 10px' }}>Course Code</th>
                          <th style={{ padding: '7px 10px' }}>Course Title</th>
                          <th style={{ padding: '7px 10px', textAlign: 'center' }}>Credits</th>
                          <th style={{ padding: '7px 10px', textAlign: 'center' }}>Marks</th>
                          <th style={{ padding: '7px 10px', textAlign: 'center' }}>Grade</th>
                          <th style={{ padding: '7px 10px', textAlign: 'center' }}>GP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentSummary.grades.map((g, idx) => (
                          <tr key={g.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '7px 10px', fontWeight: '800', color: '#1e40af' }}>{g.course_code}</td>
                            <td style={{ padding: '7px 10px', color: '#334155' }}>{g.course_title}</td>
                            <td style={{ padding: '7px 10px', textAlign: 'center' }}>{g.credit_hours}</td>
                            <td style={{ padding: '7px 10px', textAlign: 'center', fontWeight: '600' }}>{g.marks}</td>
                            <td style={{ padding: '7px 10px', textAlign: 'center', fontWeight: '800' }}>
                              <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '4px' }}>
                                {g.grade_letter}
                              </span>
                            </td>
                            <td style={{ padding: '7px 10px', textAlign: 'center', fontWeight: '800', color: '#059669' }}>{(parseFloat(g.grade_point) || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic' }}>
                      No individual course grade entries available for this student.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
            <h3 style={{ marginTop: 0, marginBottom: '14px', fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} style={{ color: '#6366f1' }} /> All Recorded Grades ({grades.length})
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '10px' }}>Student</th>
                  <th style={{ padding: '10px' }}>Course</th>
                  <th style={{ padding: '10px' }}>Marks</th>
                  <th style={{ padding: '10px' }}>Grade</th>
                  <th style={{ padding: '10px' }}>GP</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(g => (
                  <tr key={g.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: '600', color: '#334155' }}>
                      {g.student_id}
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{g.student_name}</div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ fontWeight: '700', color: '#4f46e5' }}>{g.course_code}</span>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{g.course_title}</div>
                    </td>
                    <td style={{ padding: '10px', fontWeight: '600' }}>{g.marks}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ fontWeight: '800', background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '6px' }}>
                        {g.grade_letter}
                      </span>
                    </td>
                    <td style={{ padding: '10px', fontWeight: '700', color: '#059669' }}>{floatOrFixed(g.grade_point)}</td>
                    <td style={{ padding: '10px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => setSelectedReportStudentId(g.student_id)}
                        style={{ background: 'rgba(30, 64, 175, 0.1)', border: '1px solid rgba(30, 64, 175, 0.3)', color: '#1e40af', borderRadius: '6px', cursor: 'pointer', padding: '4px 8px', fontSize: '0.78rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Print Transcript for this student"
                      >
                        <Printer size={12} /> Transcript
                      </button>
                      <button
                        onClick={() => handleDelete(g.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        title="Delete Grade"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Searched Student Official IUB Transcript PDF Modal */}
      {selectedReportStudentId && (
        <StudentTranscriptModal
          studentId={selectedReportStudentId}
          onClose={() => setSelectedReportStudentId(null)}
        />
      )}
    </div>
  );
}

function floatOrFixed(val) {
  try {
    return (parseFloat(val) || 0.0).toFixed(2);
  } catch (e) {
    return '0.00';
  }
}
