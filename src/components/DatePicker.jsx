import React, { useState, useEffect } from 'react';

function DatePicker({ value, onChange, label, disabled = false }) {
  const [dateValue, setDateValue] = useState('');

  useEffect(() => {
    if (value) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      setDateValue(`${year}-${month}-${day}`);
    } else {
      setDateValue('');
    }
  }, [value]);

  const handleChange = (e) => {
    if (disabled) return;
    const newValue = e.target.value;
    setDateValue(newValue);
    
    if (newValue) {
      const [year, month, day] = newValue.split('-').map(Number);
      
      if (year >= 2000 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const newDate = new Date(year, month - 1, day);
        if (newDate.getFullYear() === year && newDate.getMonth() === month - 1) {
          onChange(newDate);
          return;
        }
      }
    } else {
      onChange(null);
    }
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#e0e0e0';
    
    if (dateValue) {
      const [year] = dateValue.split('-').map(Number);
      if (year < 2000 || year > 2100) {
        setDateValue('');
        onChange(null);
        alert('Пожалуйста, введите год от 2000 до 2100');
      }
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    backgroundColor: disabled ? '#f5f5f5' : 'white',
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? '#999' : '#333'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 500,
    fontSize: '14px',
    color: disabled ? '#999' : '#555'
  };

  const handleFocus = (e) => {
    if (!disabled) {
      e.target.style.borderColor = '#007bff';
    }
  };

  return (
    <div>
      <label style={labelStyle}>
        {label}
      </label>
      <input
        type="date"
        value={dateValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        disabled={disabled}
        min="2000-01-01"
        max="2100-12-31"
        style={inputStyle}
      />
    </div>
  );
}

export default DatePicker;