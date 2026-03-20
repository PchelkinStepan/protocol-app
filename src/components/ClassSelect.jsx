import React from 'react';

function ClassSelect({ classes, value, onChange }) {
  if (!classes || Object.keys(classes).length === 0) return null;

  const selectStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    cursor: 'pointer',
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 500,
    fontSize: '14px',
    color: '#555'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#007bff';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#e0e0e0';
  };

  return (
    <div>
      <label style={labelStyle}>
        Класс прибора
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={selectStyle}
      >
        <option value="" disabled>Выберите класс прибора</option>
        {Object.entries(classes).map(([key, cls]) => (
          <option key={key} value={key}>
            {cls.displayName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ClassSelect;