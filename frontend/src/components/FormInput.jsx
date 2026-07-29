import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  icon: Icon,
  required = true,
  options = [] // Used if type === 'select'
}) {
  const hasError = Boolean(error);

  return (
    <div className={`form-group ${hasError ? 'has-error' : ''}`}>
      <label htmlFor={name} className="form-label">
        <span>{label}</span>
        {required && <span className="required-star">*</span>}
      </label>

      <div className="input-wrapper">
        {Icon && <Icon className="input-icon" size={18} />}

        {type === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className="form-select"
          >
            <option value="">-- Select {label} --</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className="form-input"
            autoComplete="off"
          />
        )}
      </div>

      {hasError && (
        <div className="error-message">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
