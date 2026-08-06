import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, seedLocalDatabase } from '../../offline/db';
import { syncEngine } from '../../offline/syncEngine';
import CampusMap from './CampusMap';
import AssignmentTracker from './AssignmentTracker';
import TimetableAnalytics from './TimetableAnalytics';
import { Wifi, WifiOff, RefreshCw, CheckCircle, Clock, MapPin, Calendar, Layers, ShieldCheck } from 'lucide-react';

export default function SmartCampusModule() {
  const [activeTab, setActiveTab] = useState('assignments');
  const [networkState, setNetworkState] = useState({ isOnline: navigator.onLine, isSyncing: false });

  // Live Query from IndexedDB
  const assignments = useLiveQuery(() => db.assignments.toArray(), []) || [];
  const pendingCount = assignments.filter((a) => !a.is_completed).length;
  const highPriorityCount = assignments.filter((a) => !a.is_completed && a.priority === 'high').length;
  const offlineUnsyncedCount = assignments.filter((a) => a.sync_status === 'pending').length;

  useEffect(() => {
    // Seed local database on initial mount
    seedLocalDatabase();

    // Subscribe to SyncEngine network & sync status updates
    const unsubscribe = syncEngine.subscribe((state) => {
      setNetworkState(state);
    });

    return () => unsubscribe();
  }, []);

  const handleManualSync = () => {
    syncEngine.triggerSync();
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        borderRadius: '20px',
        padding: '24px 28px',
        color: '#ffffff',
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.4)',
        border: '1px solid #3730a3',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#4f46e5', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Offline-First Architecture
              </span>
              <span style={{ fontSize: '0.8rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} color="#10b981" /> Dexie IndexedDB + FastAPI Sync
              </span>
            </div>
            <h1 style={{ margin: '8px 0 4px 0', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              🎓 Smart Campus & Utility Hub
            </h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>
              Seamless course tracking, assignment deadlines, campus navigation, and attendance analytics.
            </p>
          </div>

          {/* Network Connection & Sync Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '30px',
              fontSize: '0.85rem',
              fontWeight: '700',
              background: networkState.isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.2)',
              border: networkState.isOnline ? '1px solid #10b981' : '1px solid #f59e0b',
              color: networkState.isOnline ? '#34d399' : '#fbbf24'
            }}>
              {networkState.isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
              {networkState.isOnline ? 'ONLINE (SYNCED)' : 'OFFLINE MODE'}
            </div>

            <button
              onClick={handleManualSync}
              disabled={networkState.isSyncing || !networkState.isOnline}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '30px',
                fontSize: '0.85rem',
                fontWeight: '600',
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                cursor: networkState.isOnline ? 'pointer' : 'not-allowed',
                opacity: networkState.isOnline ? 1 : 0.6,
                transition: 'all 0.2s ease'
              }}
            >
              <RefreshCw size={14} className={networkState.isSyncing ? 'spin' : ''} />
              {networkState.isSyncing ? 'Syncing...' : offlineUnsyncedCount > 0 ? `Sync (${offlineUnsyncedCount})` : 'Sync Now'}
            </button>
          </div>
        </div>

        {/* Top Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '12px 16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '0.75rem', color: '#a5b4fc', textTransform: 'uppercase', fontWeight: '700' }}>Pending Tasks</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginTop: '2px' }}>{pendingCount}</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '12px 16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '0.75rem', color: '#fca5a5', textTransform: 'uppercase', fontWeight: '700' }}>High Priority</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ef4444', marginTop: '2px' }}>{highPriorityCount}</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '12px 16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '0.75rem', color: '#fde68a', textTransform: 'uppercase', fontWeight: '700' }}>Offline Queued</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f59e0b', marginTop: '2px' }}>{offlineUnsyncedCount}</div>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('assignments')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'assignments' ? '#6366f1' : '#1e293b',
            color: activeTab === 'assignments' ? '#fff' : '#cbd5e1',
            transition: 'all 0.2s ease'
          }}
        >
          <Clock size={18} /> Assignment & Deadline Tracker
        </button>

        <button
          onClick={() => setActiveTab('map')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'map' ? '#6366f1' : '#1e293b',
            color: activeTab === 'map' ? '#fff' : '#cbd5e1',
            transition: 'all 0.2s ease'
          }}
        >
          <MapPin size={18} /> Interactive Campus Map
        </button>

        <button
          onClick={() => setActiveTab('timetable')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'timetable' ? '#6366f1' : '#1e293b',
            color: activeTab === 'timetable' ? '#fff' : '#cbd5e1',
            transition: 'all 0.2s ease'
          }}
        >
          <Calendar size={18} /> Timetable & Attendance
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === 'assignments' && <AssignmentTracker />}
      {activeTab === 'map' && <CampusMap />}
      {activeTab === 'timetable' && <TimetableAnalytics />}
    </div>
  );
}
