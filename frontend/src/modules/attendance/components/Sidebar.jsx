import React from 'react';
import { LayoutDashboard, CalendarCheck, ClipboardList, CheckCircle2, GraduationCap, Award } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onSwitchModule, onOpenGrades }) {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <CheckCircle2 size={24} />
        </div>
        <div className="sidebar-logo-text">
          <h2>SMS Attendance</h2>
          <span>Attendance Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {onSwitchModule && (
          <button className="sidebar-link" onClick={onSwitchModule}>
            <GraduationCap size={18} />
            <span>Student Registration</span>
          </button>
        )}

        {onOpenGrades && (
          <button className="sidebar-link" onClick={onOpenGrades}>
            <Award size={18} />
            <span>Grades &amp; CGPA</span>
          </button>
        )}

        <button
          className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard Overview</span>
        </button>

        <button
          className={`sidebar-link ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          <CalendarCheck size={18} />
          <span>Manage Attendance</span>
        </button>

        <button
          className={`sidebar-link ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          <ClipboardList size={18} />
          <span>Attendance Directory</span>
        </button>
      </nav>
    </aside>
  );
}
