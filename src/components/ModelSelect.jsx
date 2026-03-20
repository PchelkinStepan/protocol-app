import React from 'react';

function ModelSelect({ models, value, onChange }) {
  if (!models || Object.keys(models).length === 0) return null;

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
        Модель прибора
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={selectStyle}
      >
        <option value="" disabled>Выберите модель прибора</option>
        {Object.entries(models).map(([key, model]) => (
          <option key={key} value={key}>
            {model.displayName || model.name || key}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ModelSelect;