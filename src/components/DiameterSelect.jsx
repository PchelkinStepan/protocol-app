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

  // Функция для получения числового значения из ключа диаметра
  const getDiameterNumber = (key) => {
    // Для ключей типа "15-0.6", "15-1", "15-1.5" - берем число до дефиса
    if (key.includes('-')) {
      return parseInt(key.split('-')[0], 10);
    }
    // Для простых ключей "15", "20", "25" и т.д.
    return parseInt(key, 10);
  };

  // Функция для получения отображаемого имени диаметра
  const getDiameterDisplayName = (key, diameterData) => {
    if (diameterData.displayName) {
      return diameterData.displayName;
    }
    return `ДУ ${key} мм`;
  };

  // Сортируем ключи диаметров по числовому значению
  const sortedDiameterKeys = Object.keys(diameters).sort((a, b) => {
    return getDiameterNumber(a) - getDiameterNumber(b);
  });

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
        {sortedDiameterKeys.map((key) => (
          <option key={key} value={key}>
            {getDiameterDisplayName(key, diameters[key])}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DiameterSelect;