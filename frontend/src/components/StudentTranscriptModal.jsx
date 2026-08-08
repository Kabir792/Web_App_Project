import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X } from 'lucide-react';

export default function StudentTranscriptModal({ studentId, onClose }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!studentId) return;

    const fetchReport = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/reports/student/${studentId}`);
        const data = await res.json();
        if (data.success) {
          setReport(data);
        } else {
          setError(data.message || 'Could not fetch transcript report');
        }
      } catch (err) {
        console.error('Fetch transcript error:', err);
        setError('Connection error fetching student transcript report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [studentId]);

  const handlePrint = () => {
    window.print();
  };

  if (!studentId) return null;

  return createPortal(
    <div
      className="modal-overlay-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
    >
      {/* Modal Container */}
      <div
        className="transcript-modal-box"
        style={{
          background: '#ffffff',
          color: '#0f172a',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '94vh',
          overflowY: 'auto',
          borderRadius: '16px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          padding: '2rem 2.25rem',
          fontFamily: "'Times New Roman', Times, serif, system-ui"
        }}
      >
        {/* Top Control Bar (Hidden during PDF Print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ fontWeight: '700', color: '#475569', fontSize: '0.88rem' }}>
            Independent University, Bangladesh &bull; Student Academic Transcript
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(30, 64, 175, 0.35)'
              }}
            >
              <Printer size={16} /> Print / Save as PDF
            </button>

            <button
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#475569',
                padding: '9px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontFamily: 'system-ui, sans-serif' }}>
            Fetching academic transcript for ID: <strong>{studentId}</strong>...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444', background: '#fef2f2', borderRadius: '10px', fontFamily: 'system-ui, sans-serif' }}>
            {error}
          </div>
        ) : report ? (
          <div id="printable-transcript-area" style={{ padding: '0.25rem' }}>
            {/* IUB Main Logo & Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #002147', paddingBottom: '0.65rem', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '4px' }}>
                <img
                  src="/iub-logo.png"
                  alt="Independent University, Bangladesh (IUB) Logo"
                  style={{ height: '62px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://iub.ac.bd/media-backend/media/iub-logo_2024_color-c303e48f-7406-4c63-8e53-51fb791b2167.png';
                  }}
                />
              </div>
              <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '600', fontStyle: 'italic' }}>
                Plot 16, Block B, Aftabuddin Ahmed Road, Bashundhara, Dhaka-1229, Bangladesh
              </div>
              <div style={{ marginTop: '0.4rem', display: 'inline-block', background: '#002147', color: '#ffffff', padding: '4px 20px', borderRadius: '3px', fontWeight: '800', fontSize: '0.88rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                ACADEMIC TRANSCRIPT
              </div>
            </div>

            {/* Student Information Grid */}
            <div style={{ border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '5px', marginBottom: '0.85rem', background: '#fafafa', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ color: '#002147' }}>Student Name:</strong> {report.student.name}
              </div>
              <div>
                <strong style={{ color: '#002147' }}>Student ID:</strong> <span style={{ fontWeight: '800', color: '#002147' }}>{report.student.student_id}</span>
              </div>
              <div>
                <strong style={{ color: '#002147' }}>Degree Program:</strong> {report.student.department || 'B.Sc. in Computer Science & Engineering'}
              </div>
              <div>
                <strong style={{ color: '#002147' }}>School / Dept:</strong> School of Engineering, Technology &amp; Sciences
              </div>
              <div>
                <strong style={{ color: '#002147' }}>Contact Email:</strong> {report.student.email}
              </div>
              <div>
                <strong style={{ color: '#002147' }}>Date Issued:</strong> {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>

            {/* Academic Course & Grade Sheet Table */}
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#002147', borderBottom: '2px solid #002147', paddingBottom: '3px', marginBottom: '6px', textTransform: 'uppercase' }}>
                I. Academic Course Grades &amp; Performance
              </div>

              {report.academic.grades.length === 0 ? (
                <div style={{ padding: '8px', background: '#f8fafc', color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>
                  No course grade entries recorded for this student ID.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', border: '1px solid #94a3b8' }}>
                  <thead>
                    <tr style={{ background: '#002147', color: '#ffffff', textAlign: 'left' }}>
                      <th style={{ padding: '5px 8px', border: '1px solid #94a3b8' }}>Course Code</th>
                      <th style={{ padding: '5px 8px', border: '1px solid #94a3b8' }}>Course Title</th>
                      <th style={{ padding: '5px 8px', border: '1px solid #94a3b8', textAlign: 'center' }}>Credits</th>
                      <th style={{ padding: '5px 8px', border: '1px solid #94a3b8', textAlign: 'center' }}>Marks</th>
                      <th style={{ padding: '5px 8px', border: '1px solid #94a3b8', textAlign: 'center' }}>Grade</th>
                      <th style={{ padding: '5px 8px', border: '1px solid #94a3b8', textAlign: 'center' }}>Grade Point</th>
                      <th style={{ padding: '5px 8px', border: '1px solid #94a3b8', textAlign: 'center' }}>Quality Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.academic.grades.map((g, idx) => {
                      const credits = parseFloat(g.credit_hours) || 3.0;
                      const gp = parseFloat(g.grade_point) || 0.0;
                      const qp = (credits * gp).toFixed(2);
                      return (
                        <tr key={g.id || idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                          <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1', fontWeight: '800', color: '#002147' }}>{g.course_code}</td>
                          <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>{g.course_title}</td>
                          <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{credits.toFixed(1)}</td>
                          <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{g.marks}</td>
                          <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: '800' }}>{g.grade_letter}</td>
                          <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{gp.toFixed(2)}</td>
                          <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: '700' }}>{qp}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Cumulative CGPA Summary Box */}
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ border: '2px solid #002147', padding: '8px 14px', borderRadius: '5px', background: '#f8fafc' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#002147', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Cumulative Grade Summary
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.82rem' }}>
                    <span style={{ color: '#64748b' }}>Total Courses Attempted:</span> <strong style={{ color: '#0f172a' }}>{report.academic.total_courses}</strong>
                  </div>
                  <div style={{ fontSize: '0.82rem' }}>
                    <span style={{ color: '#64748b' }}>Total Credits Earned:</span> <strong style={{ color: '#0f172a' }}>{report.academic.total_credits.toFixed(1)} Credits</strong>
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#002147', textAlign: 'right' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginRight: '6px' }}>CGPA:</span>
                    <span style={{ color: '#059669', background: '#ecfdf5', padding: '3px 10px', borderRadius: '5px', border: '1px solid #a7f3d0' }}>{report.academic.cgpa.toFixed(2)} / 4.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official IUB Grading Policy Scale Box */}
            <div style={{ border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '5px', background: '#f8fafc', marginBottom: '1rem', fontSize: '0.72rem', fontFamily: 'system-ui, sans-serif' }}>
              <strong style={{ color: '#002147' }}>IUB Official Grading System (Scale 4.00):</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', marginTop: '3px', color: '#475569' }}>
                <span><strong>A</strong> (90%+ = 4.00)</span>
                <span><strong>A-</strong> (85-89% = 3.70)</span>
                <span><strong>B+</strong> (80-84% = 3.30)</span>
                <span><strong>B</strong> (75-79% = 3.00)</span>
                <span><strong>B-</strong> (70-74% = 2.70)</span>
                <span><strong>C+</strong> (65-69% = 2.30)</span>
                <span><strong>C</strong> (60-64% = 2.00)</span>
                <span><strong>D</strong> (50-59% = 1.00)</span>
                <span><strong>F</strong> (&lt;50% = 0.00)</span>
              </div>
            </div>

            {/* Official Signatures & Verification */}
            <div style={{ marginTop: '1.5rem', paddingTop: '0.75rem', borderTop: '1px solid #94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: 'system-ui, sans-serif' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                <div><strong>Independent University, Bangladesh</strong> &bull; Office of the Controller of Examinations</div>
                <div>This document is generated directly from the Student Management System.</div>
              </div>

              <div style={{ display: 'flex', gap: '35px' }}>
                <div style={{ textAlign: 'center', width: '140px', borderTop: '1px solid #0f172a', paddingTop: '3px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a' }}>Controller of Examinations</span>
                </div>
                <div style={{ textAlign: 'center', width: '130px', borderTop: '1px solid #0f172a', paddingTop: '3px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a' }}>Registrar, IUB</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Strict 1-Page Print CSS for Pure Transcript PDF Output */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 10mm;
        }

        @media print {
          /* Hide all top-level elements except modal container */
          body > *:not(.modal-overlay-container) {
            display: none !important;
          }

          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: 100% !important;
            overflow: visible !important;
          }

          /* Ensure modal container and modal box are visible and positioned correctly */
          .modal-overlay-container {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: #ffffff !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            visibility: visible !important;
            z-index: 999999 !important;
          }

          .transcript-modal-box {
            position: relative !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            max-height: none !important;
            overflow: visible !important;
            visibility: visible !important;
          }

          #printable-transcript-area,
          #printable-transcript-area * {
            visibility: visible !important;
            color: #000000 !important;
          }

          #printable-transcript-area {
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
