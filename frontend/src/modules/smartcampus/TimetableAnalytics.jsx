import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../offline/db';
import { Calendar, User, MapPin, Calculator, Award, TrendingUp, AlertCircle } from 'lucide-react';

export default function TimetableAnalytics() {
  const courses = useLiveQuery(() => db.courses.toArray(), []) || [];
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [targetPercentage, setTargetPercentage] = useState(75);

  const calculateNeededClasses = (attended, total, targetPct) => {
    if (total === 0) return 0;
    const currentPct = (attended / total) * 100;
    if (currentPct >= targetPct) return 0;
    
    // Formula: (attended + x) / (total + x) >= targetPct / 100
    // => attended + x >= 0.75*total + 0.75*x
    // => 0.25*x >= 0.75*total - attended
    // => x >= (targetPct*total - 100*attended) / (100 - targetPct)
    const targetRatio = targetPct / 100;
    const needed = Math.ceil((targetRatio * total - attended) / (1 - targetRatio));
    return Math.max(0, needed);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
      {/* Course Schedule Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="#6366f1" /> Enrolled Courses & Weekly Schedule
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {courses.map((course) => {
            const currentPct = Math.round((course.attended / course.total) * 100);
            const isSelected = selectedCourse?.id === course.id;
            
            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                style={{
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : '#1e293b',
                  border: isSelected ? '2px solid #6366f1' : '1px solid #334155',
                  borderRadius: '14px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ background: course.color || '#6366f1', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                    {course.code}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: currentPct >= 75 ? '#10b981' : '#ef4444' }}>
                    {currentPct}% Attendance
                  </span>
                </div>

                <h4 style={{ margin: '4px 0 8px 0', fontSize: '1rem', color: '#fff', fontWeight: '700' }}>
                  {course.title}
                </h4>

                <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} color="#a5b4fc" /> {course.instructor}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#a5b4fc" /> {course.room} • {course.schedule}
                  </div>
                </div>

                {/* Attendance Progress Bar */}
                <div style={{ marginTop: '12px', background: '#0f172a', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ width: `${currentPct}%`, background: currentPct >= 75 ? '#10b981' : '#f59e0b', height: '100%', borderRadius: '6px' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendance Target Calculator Sidebar */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '20px', color: '#fff' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calculator size={20} color="#10b981" /> Attendance Goal Calculator
        </h3>

        {selectedCourse ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Selected Course</div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#6366f1', marginTop: '2px' }}>{selectedCourse.code} — {selectedCourse.title}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: '#0f172a', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Classes Attended</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#10b981' }}>{selectedCourse.attended}</div>
              </div>
              <div style={{ background: '#0f172a', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total Held</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#38bdf8' }}>{selectedCourse.total}</div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Target Threshold ({targetPercentage}%)
              </label>
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={targetPercentage}
                onChange={(e) => setTargetPercentage(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#6366f1' }}
              />
            </div>

            {/* Calculation Result */}
            {(() => {
              const needed = calculateNeededClasses(selectedCourse.attended, selectedCourse.total, targetPercentage);
              const currentPct = Math.round((selectedCourse.attended / selectedCourse.total) * 100);

              return (
                <div style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: currentPct >= targetPercentage ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  border: currentPct >= targetPercentage ? '1px solid #10b981' : '1px solid #f59e0b',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  {currentPct >= targetPercentage ? (
                    <Award size={24} color="#10b981" style={{ flexShrink: 0 }} />
                  ) : (
                    <AlertCircle size={24} color="#f59e0b" style={{ flexShrink: 0 }} />
                  )}
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: currentPct >= targetPercentage ? '#10b981' : '#f59e0b' }}>
                      {currentPct >= targetPercentage ? 'Target Achieved!' : `Action Required`}
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                      {currentPct >= targetPercentage
                        ? `Great job! Your attendance is currently ${currentPct}%, above your ${targetPercentage}% target.`
                        : `You must attend the next ${needed} consecutive classes to reach ${targetPercentage}%.`}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8', fontSize: '0.85rem' }}>
            👈 Select a course from the list to calculate attendance targets.
          </div>
        )}
      </div>
    </div>
  );
}
