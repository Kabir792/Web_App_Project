import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../offline/db';
import { syncEngine } from '../../offline/syncEngine';
import confetti from 'canvas-confetti';
import { Clock, CheckCircle2, AlertTriangle, Plus, Trash2, Cloud, CloudOff, Tag, Calendar } from 'lucide-react';

export default function AssignmentTracker() {
  // Live query from Dexie IndexedDB
  const assignments = useLiveQuery(() => db.assignments.toArray(), []) || [];
  const courses = useLiveQuery(() => db.courses.toArray(), []) || [];

  const [showModal, setShowModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [newTitle, setNewTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('CSE401');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDesc, setNewDesc] = useState('');

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleToggleComplete = async (assignment) => {
    const updated = { ...assignment, is_completed: !assignment.is_completed };
    if (updated.is_completed) triggerConfetti();
    await syncEngine.saveAssignment(updated);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this assignment?')) {
      await syncEngine.deleteAssignment(id);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newTitle || !newDueDate) return;

    await syncEngine.saveAssignment({
      course_code: newCourseCode,
      title: newTitle,
      description: newDesc,
      due_date: newDueDate,
      priority: newPriority,
      is_completed: false
    });

    setNewTitle('');
    setNewDesc('');
    setNewDueDate('');
    setShowModal(false);
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filterPriority === 'all') return true;
    return a.priority === filterPriority;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span style={{ background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700' }}>HIGH PRIORITY</span>;
      case 'medium':
        return <span style={{ background: '#f59e0b', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700' }}>MEDIUM PRIORITY</span>;
      default:
        return <span style={{ background: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700' }}>LOW PRIORITY</span>;
    }
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return 'No Deadline';
    const due = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.round((due - now) / (1000 * 60 * 60));
    
    if (diffHours < 0) return <span style={{ color: '#ef4444' }}>Overdue</span>;
    if (diffHours < 24) return <span style={{ color: '#f59e0b', fontWeight: '700' }}>Due Today ({diffHours}h left)</span>;
    return <span>Due in {Math.ceil(diffHours / 24)} days</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #334155',
                background: filterPriority === p ? '#6366f1' : '#1e293b',
                color: filterPriority === p ? '#fff' : '#cbd5e1',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'capitalize'
              }}
            >
              {p} Priorities
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
          <Plus size={18} /> New Assignment
        </button>
      </div>

      {/* Assignments List */}
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
              opacity: a.is_completed ? 0.75 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.8rem', color: '#6366f1', background: 'rgba(99, 102, 241, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                  {a.course_code}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {getPriorityBadge(a.priority)}
                  {a.sync_status === 'synced' ? (
                    <Cloud size={14} color="#10b981" title="Synced to Server" />
                  ) : (
                    <CloudOff size={14} color="#f59e0b" title="Saved Offline" />
                  )}
                </div>
              </div>

              <h4 style={{ margin: '8px 0 4px 0', fontSize: '1.05rem', color: '#f8fafc', textDecoration: a.is_completed ? 'line-through' : 'none' }}>
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

      {/* Create Modal */}
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
            <h3 style={{ marginTop: 0, fontSize: '1.2rem', marginBottom: '16px' }}>Add New Assignment</h3>
            <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Course</label>
                <select
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.code}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Report 3"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Details or instructions..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Due Date</label>
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
                    <option value="high">High</option>
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
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
