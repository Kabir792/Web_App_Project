import React from 'react';

export default function AttendanceCard({ title, value, icon: Icon, color = '#10b981', bg = 'rgba(16, 185, 129, 0.12)' }) {
  return (
    <div className="metric-card-box">
      <div className="metric-icon-wrapper" style={{ background: bg, color: color }}>
        {Icon && <Icon size={24} />}
      </div>
      <div className="metric-info">
        <label>{title}</label>
        <span style={{ color: color }}>{value}</span>
      </div>
    </div>
  );
}
