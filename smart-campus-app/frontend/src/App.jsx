import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, seedLocalDatabase, IUB_LOGO_URL } from './offline/db';
import { syncEngine } from './offline/syncEngine';
import { notificationService } from './offline/notificationService';
import CampusMap from './components/CampusMap';
import AssignmentTracker from './components/AssignmentTracker';
import TimetableAnalytics from './components/TimetableAnalytics';
import AuthModal from './components/AuthModal';
import { Wifi, WifiOff, RefreshCw, Clock, MapPin, Calendar, ShieldCheck, GraduationCap, LogOut, UserCheck, Bell, BellRing } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('assignments');
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [networkState, setNetworkState] = useState({ isOnline: navigator.onLine, isSyncing: false });
  const [notifEnabled, setNotifEnabled] = useState(Notification ? Notification.permission === 'granted' : false);
  const [alertTasks, setAlertTasks] = useState([]);

  const assignments = useLiveQuery(() => db.assignments.toArray(), []) || [];
  const pendingCount = assignments.filter((a) => !a.is_completed).length;
  const highPriorityCount = assignments.filter((a) => !a.is_completed && a.priority === 'high').length;
  const offlineUnsyncedCount = assignments.filter((a) => a.sync_status === 'pending').length;

  useEffect(() => {
    seedLocalDatabase();

    // Restore user session
    try {
      const stored = localStorage.getItem('iubAuthUser');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        const defaultUser = {
          id: 'usr-1',
          student_id: '2220792',
          full_name: 'Zahid Kabir Utsho',
          email: 'utsho@iub.edu.bd',
          department: 'SETS / CSE',
          role: 'STUDENT'
        };
        setCurrentUser(defaultUser);
        localStorage.setItem('iubAuthUser', JSON.stringify(defaultUser));
      }
    } catch (e) {
      console.error('Session restore error:', e);
    }

    const unsubscribe = syncEngine.subscribe((state) => {
      setNetworkState(state);
    });

    // Check upcoming deadline alerts
    notificationService.checkUpcomingDeadlines().then((tasks) => {
      setAlertTasks(tasks);
    });

    return () => unsubscribe();
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await notificationService.requestPermission();
    setNotifEnabled(granted);
    if (granted) {
      const tasks = await notificationService.checkUpcomingDeadlines();
      setAlertTasks(tasks);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('iubAuthUser', JSON.stringify(user));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('iubAuthUser');
    setShowAuthModal(true);
  };

  const handleManualSync = () => {
    syncEngine.triggerSync();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Auth Modal overlay */}
      {(!currentUser || showAuthModal) && (
        <AuthModal
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              background: '#ffffff',
              padding: '6px 14px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
              border: '2px solid #d4af37'
            }}>
              <img
                src={IUB_LOGO_URL}
                alt="Independent University, Bangladesh Official Logo"
                style={{ height: '52px', width: 'auto', display: 'block' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: '#4f46e5', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Independent University, Bangladesh
                </span>
                <span style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                  <ShieldCheck size={14} color="#10b981" /> IUB IRAS Portal (Live Synced)
                </span>
              </div>
              <h1 style={{ margin: '6px 0 2px 0', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                IUB Smart Campus & Utility App
              </h1>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
                Bashundhara Campus • All Offered Courses Catalog, Assignment Tracker, Campus Map & Attendance Analytics.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {currentUser && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <UserCheck size={16} color="#38bdf8" />
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                  ID: <strong style={{ color: '#f59e0b' }}>{currentUser.student_id}</strong> ({currentUser.full_name})
                </span>
                <button
                  onClick={handleLogout}
                  style={{ background: 'rgba(239, 68, 68, 0.2)', border: 'none', color: '#fca5a5', padding: '4px 8px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '4px' }}
                  title="Sign Out"
                >
                  <LogOut size={12} /> Sign Out
                </button>
              </div>
            )}

            {/* Deadline Notification Toggle Button */}
            <button
              onClick={handleEnableNotifications}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '30px',
                fontSize: '0.85rem',
                fontWeight: '600',
                background: notifEnabled ? 'rgba(16, 185, 129, 0.2)' : '#334155',
                color: notifEnabled ? '#34d399' : '#cbd5e1',
                border: notifEnabled ? '1px solid #10b981' : 'none',
                cursor: 'pointer'
              }}
              title="Enable Native Desktop Deadline Alerts"
            >
              {notifEnabled ? <BellRing size={16} /> : <Bell size={16} />}
              {notifEnabled ? `Alerts Active (${alertTasks.length})` : 'Enable Alerts'}
            </button>

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
                opacity: networkState.isOnline ? 1 : 0.6
              }}
            >
              <RefreshCw size={14} className={networkState.isSyncing ? 'spin' : ''} />
              {networkState.isSyncing ? 'Syncing...' : offlineUnsyncedCount > 0 ? `Sync (${offlineUnsyncedCount})` : 'Sync Now'}
            </button>
          </div>
        </div>

        {/* Approaching Deadline Warning Pill */}
        {alertTasks.length > 0 && (
          <div style={{
            marginTop: '16px',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            borderRadius: '12px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fca5a5',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#ef4444" />
              <span>
                <strong>Deadline Alert:</strong> You have {alertTasks.length} task(s) due within 24 hours or overdue!
              </span>
            </div>
            <button
              onClick={() => setActiveTab('assignments')}
              style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '0.75rem' }}
            >
              View Assignments
            </button>
          </div>
        )}

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
            color: activeTab === 'assignments' ? '#fff' : '#cbd5e1'
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
            color: activeTab === 'map' ? '#fff' : '#cbd5e1'
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
            color: activeTab === 'timetable' ? '#fff' : '#cbd5e1'
          }}
        >
          <Calendar size={18} /> Offered Courses & Timetable
        </button>
      </div>

      {activeTab === 'assignments' && <AssignmentTracker />}
      {activeTab === 'map' && <CampusMap />}
      {activeTab === 'timetable' && <TimetableAnalytics />}
    </div>
  );
}
