import React, { useState, useEffect } from 'react';
import AttendanceCard from '../components/AttendanceCard';
import AttendanceTable from '../components/AttendanceTable';
import AttendanceForm from '../components/AttendanceForm';
import { getAttendanceApi, markAttendanceApi, editAttendanceApi, deleteAttendanceApi } from '../services/attendanceApi';
import { Users, UserCheck, UserX, Percent, Plus, RefreshCw } from 'lucide-react';

export default function AttendanceDashboard() {
  const [metrics, setMetrics] = useState({
    totalToday: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0.0
  });

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMarkForm, setShowMarkForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAttendanceApi();
      const payload = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.records)
          ? res.records
          : [];

      setRecords(payload);
      if (res?.metrics) {
        setMetrics(res.metrics);
      }
    } catch (err) {
      console.error('Attendance dashboard load failed:', err);
      setRecords([]);
      triggerToast('Could not load attendance data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFormSubmit = async (formData) => {
    if (editingRecord) {
      const res = await editAttendanceApi(editingRecord.id, formData);
      if (res.success) {
        triggerToast(`Attendance record #${editingRecord.id} updated!`);
        setEditingRecord(null);
        setShowMarkForm(false);
        loadData();
      } else {
        triggerToast(res.message || 'Update failed', 'error');
      }
    } else {
      const res = await markAttendanceApi(formData);
      if (res.success) {
        triggerToast('Attendance marked successfully!');
        setShowMarkForm(false);
        loadData();
      } else {
        triggerToast(res.message || 'Marking failed', 'error');
      }
    }
  };

  const handleDelete = async (id, studentName) => {
    if (!window.confirm(`Delete attendance record for "${studentName}"?`)) return;
    const res = await deleteAttendanceApi(id);
    if (res.success) {
      triggerToast(`Attendance record #${id} deleted!`);
      loadData();
    } else {
      triggerToast(res.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="attendance-page-container">
      {toastMessage && (
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 1000, padding: '0.85rem 1.25rem', borderRadius: '12px', background: toastMessage.type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)', color: '#fff', fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', animation: 'slideDown 0.3s ease' }}>
          {toastMessage.msg}
        </div>
      )}

      {/* Dashboard Analytics Metric Cards */}
      <div className="metrics-cards-grid">
        <AttendanceCard
          title="Today's Attendance"
          value={metrics.totalToday}
          icon={Users}
          color="#3b82f6"
          bg="rgba(59, 130, 246, 0.12)"
        />
        <AttendanceCard
          title="Present Students"
          value={metrics.present}
          icon={UserCheck}
          color="#10b981"
          bg="rgba(16, 185, 129, 0.12)"
        />
        <AttendanceCard
          title="Absent Students"
          value={metrics.absent}
          icon={UserX}
          color="#ef4444"
          bg="rgba(239, 68, 68, 0.12)"
        />
        <AttendanceCard
          title="Attendance %"
          value={`${metrics.percentage}%`}
          icon={Percent}
          color="#f59e0b"
          bg="rgba(245, 158, 11, 0.12)"
        />
      </div>

      {/* Quick Mark Attendance Banner / Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
          Today's Attendance Logs
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={loadData}
            style={{ padding: '0.65rem 1rem', background: 'transparent', border: '1px solid var(--att-border)', color: 'var(--att-text-muted)', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => {
              setEditingRecord(null);
              setShowMarkForm(true);
            }}
            className="btn-mark-submit"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
          >
            <Plus size={16} />
            <span>Mark Attendance</span>
          </button>
        </div>
      </div>

      {/* Mark / Edit Attendance Form Modal / Expansion */}
      {(showMarkForm || editingRecord) && (
        <div style={{ marginBottom: '2rem' }}>
          <AttendanceForm
            initialData={editingRecord}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowMarkForm(false);
              setEditingRecord(null);
            }}
          />
        </div>
      )}

      {/* Today's Attendance Table */}
      <AttendanceTable
        records={records}
        loading={loading}
        onEdit={(r) => {
          setEditingRecord(r);
          setShowMarkForm(true);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
