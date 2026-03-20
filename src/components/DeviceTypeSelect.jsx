import React from 'react';

function DeviceTypeSelect({ types, value, onChange }) {
  if (!types || Object.keys(types).length === 0) return null;

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

  // Функция для правильного склонения слова "год"
  const getYearsText = (years) => {
    if (years === 1) return 'год';
    if (years >= 2 && years <= 4) return 'года';
    return 'лет';
  };

  return (
    <div>
      <label style={labelStyle}>
        Тип прибора
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={selectStyle}
      >
        <option value="" disabled>Выберите тип прибора</option>
        {Object.entries(types).map(([key, type]) => (
          <option key={key} value={key}>
            {type.displayName} (МПИ {type.nextVerificationPeriod} {getYearsText(type.nextVerificationPeriod)})
          </option>
        ))}
      </select>
    </div>
  );
}

export default DeviceTypeSelect;