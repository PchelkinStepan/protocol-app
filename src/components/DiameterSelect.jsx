import React from 'react';

function DiameterSelect({ diameters, value, onChange }) {
  if (!diameters || Object.keys(diameters).length === 0) return null;

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
    cursor: 'pointer'
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

  // Функция для получения отображаемого имени диаметра
  const getDiameterDisplayName = (key, diameterData) => {
    // Если у диаметра есть displayName, показываем его
    if (diameterData.displayName) {
      return diameterData.displayName;
    }
    // Иначе стандартное "ДУ {ключ} мм"
    return `ДУ ${key} мм`;
  };

  return (
    <div>
      <label style={labelStyle}>
        Диаметр ДУ (мм)
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={selectStyle}
      >
        <option value="" disabled>Выберите диаметр</option>
        {Object.entries(diameters).map(([key, data]) => (
          <option key={key} value={key}>
            {getDiameterDisplayName(key, data)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DiameterSelect;