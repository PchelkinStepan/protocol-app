import React, { useState, useEffect } from 'react';

function ProtocolNumberInput({ value, onChange }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleFocus = () => {
    if (displayValue === '№П-____.___-____') {
      setDisplayValue('№П-____.___-____');
    }
  };

  const handleBlur = () => {
    if (displayValue === '№П-____.___-____' || displayValue === '№П-') {
      setDisplayValue('№П-____.___-____');
      onChange('№П-____.___-____');
    }
  };

  const handleChange = (e) => {
    let input = e.target.value;
    
    // Извлекаем только цифры из ввода
    let numbers = input.replace(/[^\d]/g, '');
    
    // Ограничиваем до 11 цифр
    numbers = numbers.slice(0, 11);
    
    // Создаем маску с цифрами
    let formatted = '№П-';
    
    // Первые 4 цифры
    for (let i = 0; i < 4; i++) {
      formatted += numbers[i] || '_';
    }
    
    formatted += '.';
    
    // Следующие 3 цифры
    for (let i = 4; i < 7; i++) {
      formatted += numbers[i] || '_';
    }
    
    formatted += '-';
    
    // Последние 4 цифры
    for (let i = 7; i < 11; i++) {
      formatted += numbers[i] || '_';
    }

    setDisplayValue(formatted);
    onChange(formatted);
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
    fontFamily: 'monospace',
    letterSpacing: '1px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 500,
    fontSize: '14px',
    color: '#555'
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#007bff';
    handleFocus();
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#e0e0e0';
    handleBlur();
  };

  return (
    <div>
      <label style={labelStyle}>
        Номер протокола
      </label>
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder="№П-____.___-____"
        style={inputStyle}
      />
      <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
        Формат: №П-XXXX.XXX-XXXX (где X - цифры)
      </div>
    </div>
  );
}

export default ProtocolNumberInput;