import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, TASK_TYPES } from '../offline/db';
import { syncEngine } from '../offline/syncEngine';
import confetti from 'canvas-confetti';
import { Clock, CheckCircle2, Plus, Trash2, Cloud, CloudOff, BookPlus, Tag, FileText, HelpCircle, Target, Trophy, FlaskConical } from 'lucide-react';

export default function AssignmentTracker() {
  const assignments = useLiveQuery(() => db.assignments.toArray(), []) || [];
  const courses = useLiveQuery(() => db.courses.toArray(), []) || [];

  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  
  // Task Form State
  const [selectedCourseCode, setSelectedCourseCode] = useState('CSC401');
  const [taskType, setTaskType] = useState('assignment');
  const [isCustomCourse, setIsCustomCourse] = useState(false);
  const [customCourseCode, setCustomCourseCode] = useState('');
  const [customCourseTitle, setCustomCourseTitle] = useState('');
  
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDesc, setNewDesc] = useState('');

  const triggerConfetti = () => {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
  };

  const handleToggleComplete = async (assignment) => {
    const updated = { ...assignment, is_completed: !assignment.is_completed };
    if (updated.is_completed) triggerConfetti();
    await syncEngine.saveAssignment(updated);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this task?')) {
      await syncEngine.deleteAssignment(id);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newTitle || !newDueDate) return;

    let finalCourseCode = selectedCourseCode;

    if (isCustomCourse) {
      if (!customCourseCode.trim()) return;
      finalCourseCode = customCourseCode.trim().toUpperCase();

      const newCourseObj = {
        id: `iub-custom-${Date.now()}`,
        code: finalCourseCode,
        title: customCourseTitle.trim() || `${finalCourseCode} - Custom Course`,
        department: 'SETS / Custom',
        instructor: 'Faculty Member',
        room: 'Campus Room',
        schedule: 'TBA Schedule',
        color: '#6366f1',
        attended: 0,
        total: 0
      };

      await db.courses.put(newCourseObj);
    }

    await syncEngine.saveAssignment({
      course_code: finalCourseCode,
      task_type: taskType,
      title: newTitle,
      description: newDesc,
      due_date: newDueDate,
      priority: newPriority,
      is_completed: false
    });

    setNewTitle('');
    setNewDesc('');
    setNewDueDate('');
    setCustomCourseCode('');
    setCustomCourseTitle('');
    setIsCustomCourse(false);
    setShowModal(false);
  };

  const filteredAssignments = assignments.filter((a) => {
    const matchesType = filterType === 'all' || a.task_type === filterType;
    const matchesPriority = filterPriority === 'all' || a.priority === filterPriority;
    return matchesType && matchesPriority;
  });

  const getTaskTypeBadge = (type) => {
    switch (type) {
      case 'quiz':
        return <span style={{ background: '#a855f7', color: '#fff', padding: '3px 9px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><HelpCircle size={12}/> QUIZ</span>;
      case 'midterm':
        return <span style={{ background: '#f59e0b', color: '#fff', padding: '3px 9px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Target size={12}/> MIDTERM</span>;
      case 'final':
        return <span style={{ background: '#ef4444', color: '#fff', padding: '3px 9px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Trophy size={12}/> FINAL EXAM</span>;
      case 'lab_report':
        return <span style={{ background: '#06b6d4', color: '#fff', padding: '3px 9px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><FlaskConical size={12}/> LAB REPORT</span>;
      default:
        return <span style={{ background: '#3b82f6', color: '#fff', padding: '3px 9px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><FileText size={12}/> ASSIGNMENT</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span style={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: '800' }}>● HIGH</span>;
      case 'medium':
        return <span style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: '800' }}>● MED</span>;
      default:
        return <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: '800' }}>● LOW</span>;
    }
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return 'No Date';
    const due = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.round((due - now) / (1000 * 60 * 60));
    
    if (diffHours < 0) return <span style={{ color: '#ef4444', fontWeight: '700' }}>Overdue</span>;
    if (diffHours < 24) return <span style={{ color: '#f59e0b', fontWeight: '700' }}>Due Today ({diffHours}h left)</span>;
    return <span>Due in {Math.ceil(diffHours / 24)} days</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Category Filter Pills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterType('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              background: filterType === 'all' ? '#6366f1' : '#1e293b',
              color: filterType === 'all' ? '#fff' : '#cbd5e1',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.8rem'
            }}
          >
            All Tasks ({assignments.length})
          </button>
          
          {TASK_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterType(t.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                background: filterType === t.id ? t.color : '#1e293b',
                color: filterType === t.id ? '#fff' : '#cbd5e1',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}
        >
          <Plus size={18} /> Add Academic Event / Task
        </button>
      </div>

      {/* Task Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredAssignments.map((a) => (
          <div
            key={a.id}
            style={{
              background: a.is_completed ? 'rgba(15, 23, 42, 0.6)' : '#1e293b',
              border: a.is_completed ? '1px solid #334155' : '1px solid #475569',
              borderRadius: '14px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              opacity: a.is_completed ? 0.75 : 1
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: '800', fontSize: '0.85rem', color: '#fff', background: '#0f172a', padding: '3px 8px', borderRadius: '6px', border: '1px solid #334155' }}>
                    {a.course_code}
                  </span>
                  {getTaskTypeBadge(a.task_type)}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {getPriorityBadge(a.priority)}
                  {a.sync_status === 'synced' ? (
                    <Cloud size={14} color="#10b981" title="Synced to Server" />
                  ) : (
                    <CloudOff size={14} color="#f59e0b" title="Saved Offline" />
                  )}
                </div>
              </div>

              <h4 style={{ margin: '6px 0 4px 0', fontSize: '1.05rem', color: '#f8fafc', textDecoration: a.is_completed ? 'line-through' : 'none' }}>
                {a.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                {a.description}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #334155', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <Clock size={14} color="#6366f1" />
                {formatDueDate(a.due_date)}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleToggleComplete(a)}
                  style={{
                    background: a.is_completed ? '#10b981' : '#334155',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <CheckCircle2 size={14} />
                  {a.is_completed ? 'Done' : 'Complete'}
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1100
        }}>
          <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '480px', color: '#fff', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.2rem', marginBottom: '16px' }}>Add Academic Task / Exam</h3>
            <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Task Type / Academic Event</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontWeight: '700' }}
                >
                  {TASK_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Course Selection</label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCourse(!isCustomCourse)}
                    style={{ background: 'none', border: 'none', color: '#a5b4fc', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <BookPlus size={14} />
                    {isCustomCourse ? 'Select Existing Course' : '+ Add New Course'}
                  </button>
                </div>

                {!isCustomCourse ? (
                  <select
                    value={selectedCourseCode}
                    onChange={(e) => {
                      if (e.target.value === 'ADD_NEW') {
                        setIsCustomCourse(true);
                      } else {
                        setSelectedCourseCode(e.target.value);
                      }
                    }}
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.code}>{c.code} - {c.title}</option>
                    ))}
                    <option value="ADD_NEW">➕ Add Unlisted/New Course...</option>
                  </select>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #6366f1' }}>
                    <input
                      type="text"
                      required
                      placeholder="Course Code (e.g., CSC309, EEE201)"
                      value={customCourseCode}
                      onChange={(e) => setCustomCourseCode(e.target.value)}
                      style={{ padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Course Title (e.g., Operating Systems)"
                      value={customCourseTitle}
                      onChange={(e) => setCustomCourseTitle(e.target.value)}
                      style={{ padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Written Exam / Lab Report 2"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Description & Venue</label>
                <textarea
                  rows={3}
                  placeholder="Syllabus chapters, room number, or submission link..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '8px 16px', background: '#334155', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
                >
                  Save Academic Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
