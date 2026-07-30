import React, { useState, useEffect } from 'react';
import AttendanceTable from '../components/AttendanceTable';
import AttendanceForm from '../components/AttendanceForm';
import { searchAttendanceApi, markAttendanceApi, editAttendanceApi, deleteAttendanceApi } from '../services/attendanceApi';
import { Search, Filter, Plus, RefreshCw } from 'lucide-react';

export default function AttendanceManage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showMarkForm, setShowMarkForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const performSearch = async () => {
    setLoading(true);
    try {
      const res = await searchAttendanceApi({
        query: searchQuery,
        date: dateFilter,
        status: statusFilter
      });

      const payload = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.records)
          ? res.records
          : [];

      setRecords(payload);
      if (!res?.success && res?.message) {
        triggerToast(res.message, 'error');
      }
    } catch (err) {
      console.error('Attendance search failed:', err);
      setRecords([]);
      triggerToast('Could not load attendance directory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
  }, [searchQuery, dateFilter, statusFilter]);

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
        performSearch();
      } else {
        triggerToast(res.message || 'Update failed', 'error');
      }
    } else {
      const res = await markAttendanceApi(formData);
      if (res.success) {
        triggerToast('Attendance marked successfully!');
        setShowMarkForm(false);
        performSearch();
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
      performSearch();
    } else {
      triggerToast(res.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="attendance-page-container">
      {toastMessage && (
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 1000, padding: '0.85rem 1.25rem', borderRadius: '12px', background: toastMessage.type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)', color: '#fff', fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
          {toastMessage.msg}
        </div>
      )}

      {/* Filter and Action Header */}
      <div style={{ background: 'var(--att-card-bg)', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid var(--att-border)', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', flex: 1 }}>
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--att-text-dim)' }} />
              <input
                type="text"
                className="att-input"
                placeholder="Search by Student ID, Name, Date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>

            {/* Date Filter */}
            <input
              type="date"
              className="att-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ width: '160px' }}
            />

            {/* Status Filter */}
            <select
              className="att-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => {
                setSearchQuery('');
                setDateFilter('');
                setStatusFilter('');
              }}
              style={{ padding: '0.65rem 0.85rem', background: 'transparent', border: '1px solid var(--att-border)', color: 'var(--att-text-muted)', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Clear Filters
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
      </div>

      {/* Form Modal / Expansion */}
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

      {/* Filtered Attendance Directory Table */}
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
