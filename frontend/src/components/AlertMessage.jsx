import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function AlertMessage({ type = 'success', title, message, errors }) {
  if (!message && !title) return null;

  const isSuccess = type === 'success';

  return (
    <div className={`alert-banner ${isSuccess ? 'success' : 'error'}`}>
      <div className="alert-icon" style={{ marginTop: '2px' }}>
        {isSuccess ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
      </div>
      <div>
        {title && <div className="alert-title">{title}</div>}
        {message && <div className="alert-body">{message}</div>}
        {errors && typeof errors === 'object' && (
          <ul style={{ marginTop: '0.4rem', paddingLeft: '1.2rem', fontSize: '0.84rem' }}>
            {Object.entries(errors).map(([field, errText]) => (
              <li key={field}>{errText}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
