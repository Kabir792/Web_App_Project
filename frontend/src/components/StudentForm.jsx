import React, { useState } from 'react';
import { User, CreditCard, Building2, Mail, PhoneCall, UserPlus } from 'lucide-react';
import FormInput from './FormInput';
import AlertMessage from './AlertMessage';
import { registerStudent } from '../services/api';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Software Engineering',
  'Electrical & Electronic Engineering',
  'Information Technology',
  'Business Administration',
  'Civil Engineering',
  'Mechanical Engineering'
];

const INITIAL_FORM_STATE = {
  name: '',
  student_id: '',
  department: '',
  email: '',
  phone: ''
};

export default function StudentForm({ onSuccess }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiFeedback, setApiFeedback] = useState(null);

  // Field validation rules
  const validateField = (name, value) => {
    let error = '';
    const val = (value || '').trim();

    switch (name) {
      case 'name':
        if (!val) {
          error = 'Student Name is required.';
        } else if (val.length < 2) {
          error = 'Student Name must be at least 2 characters.';
        } else if (!/^[a-zA-Z\s\.\'-]+$/.test(val)) {
          error = 'Student Name can only contain letters and standard spaces.';
        }
        break;

      case 'student_id':
        if (!val) {
          error = 'Student ID is required.';
        } else if (!/^[a-zA-Z0-9_-]{4,20}$/.test(val)) {
          error = 'Student ID must be 4 to 20 alphanumeric characters (e.g. 2220792).';
        }
        break;

      case 'department':
        if (!val) {
          error = 'Department selection is required.';
        }
        break;

      case 'email':
        if (!val) {
          error = 'Email address is required.';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) {
          error = 'Enter a valid email address (e.g. zahid.utsho@university.edu).';
        }
        break;

      case 'phone':
        if (!val) {
          error = 'Phone number is required.';
        } else if (!/^\+?[0-9]{7,15}$/.test(val)) {
          error = 'Enter a valid phone number (7-15 digits, e.g. +8801712345678).';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validate full form
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) {
        newErrors[field] = err;
      }
    });
    return newErrors;
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time error clearance if touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Input blur handler
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiFeedback(null);

    // Mark all fields touched
    const allTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setApiFeedback({
        type: 'error',
        title: 'Validation Error',
        message: 'Please resolve the highlighted errors before submitting.'
      });
      return;
    }

    setIsSubmitting(true);

    // Call REST API
    const response = await registerStudent(formData);
    setIsSubmitting(false);

    if (response.success) {
      // Show success message
      setApiFeedback({
        type: 'success',
        title: 'Registration Successful!',
        message: response.message || 'Student profile created and saved to students.json.'
      });

      // Clear form inputs
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      setTouched({});

      // Notify parent component to update list
      if (onSuccess) {
        onSuccess(response.data);
      }
    } else {
      // Show registration error
      setApiFeedback({
        type: 'error',
        title: 'Registration Failed',
        message: response.message,
        errors: response.errors
      });

      if (response.errors) {
        setErrors((prev) => ({ ...prev, ...response.errors }));
      }
    }
  };

  return (
    <div className="form-card">
      <div className="form-card-header">
        <UserPlus color="#6366f1" size={26} />
        <div>
          <h2>Student Registration Form</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Fill out all required fields to register a student into the system.
          </p>
        </div>
      </div>

      {apiFeedback && (
        <AlertMessage
          type={apiFeedback.type}
          title={apiFeedback.title}
          message={apiFeedback.message}
          errors={apiFeedback.errors}
        />
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Student Name */}
        <FormInput
          label="Student Full Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. Zahid Kabir Utsho"
          error={errors.name}
          icon={User}
        />

        {/* Student ID */}
        <FormInput
          label="Student ID"
          name="student_id"
          type="text"
          value={formData.student_id}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. 2220792"
          error={errors.student_id}
          icon={CreditCard}
        />

        {/* Department */}
        <FormInput
          label="Department"
          name="department"
          type="select"
          options={DEPARTMENTS}
          value={formData.department}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.department}
          icon={Building2}
        />

        {/* Email */}
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. zahid.utsho@university.edu"
          error={errors.email}
          icon={Mail}
        />

        {/* Phone Number */}
        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. +8801712345678"
          error={errors.phone}
          icon={PhoneCall}
        />

        {/* Submit Button */}
        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="spinner" />
              <span>Registering Student...</span>
            </>
          ) : (
            <>
              <UserPlus size={18} />
              <span>Register Student</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
