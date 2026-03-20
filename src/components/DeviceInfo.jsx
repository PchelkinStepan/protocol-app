import React, { useEffect } from 'react';
import ProtocolNumberInput from './ProtocolNumberInput';
import DiameterSelect from './DiameterSelect';
import DeviceTypeSelect from './DeviceTypeSelect';
import ModelSelect from './ModelSelect';
import ClassSelect from './ClassSelect';
import DatePicker from './DatePicker';

function DeviceInfo({ 
  device, 
  currentData,
  serialNumber, 
  setSerialNumber, 
  protocolNumber, 
  setProtocolNumber,
  diameter,
  setDiameter,
  composition,
  setComposition,
  deviceType,
  setDeviceType,
  model,
  setModel,
  deviceClass,
  setDeviceClass,
  verificationDate,
  setVerificationDate,
  manualDate,
  setManualDate
}) {

  // Все хуки ДО проверки на device
  useEffect(() => {
    setDeviceClass('');
    setDiameter('');
  }, [model, setDeviceClass, setDiameter]);

  useEffect(() => {
    setDiameter('');
  }, [deviceClass, setDiameter]);

  if (!device) return null;

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const disabledInputStyle = {
    ...inputStyle,
    backgroundColor: '#f5f5f5',
    color: '#999',
    cursor: 'not-allowed',
    borderColor: '#ddd'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 500,
    fontSize: '14px',
    color: '#555'
  };

  const checkboxStyle = {
    marginRight: '8px',
    cursor: 'pointer',
    width: '16px',
    height: '16px'
  };

  // Определяем, есть ли состав у прибора (на уровне госреестра)
  const hasComposition = device?.hasComposition || false;

  // Получаем текущую модель
  const currentModel = model && device.models ? device.models[model] : null;
  
  // Получаем текущий класс
  const currentClass = deviceClass && currentModel?.classes ? currentModel.classes[deviceClass] : null;

  // Определяем, какие данные показывать для диаметров
  const diametersForSelect = currentClass?.diameters || currentModel?.diameters || currentData?.diameters || null;

  return (
    <div>
      {/* Выбор типа прибора (если есть) - для WP-Dynamic */}
      {device.hasTypes && device.types && !device.models && (
        <DeviceTypeSelect 
          types={device.types}
          value={deviceType}
          onChange={setDeviceType}
        />
      )}

      {/* Выбор модели прибора (если есть) - для 40607-09 */}
      {device.models && (
        <ModelSelect 
          models={device.models}
          value={model}
          onChange={setModel}
        />
      )}

      {/* Выбор класса прибора (если есть у модели) */}
      {currentModel?.hasClasses && currentModel.classes && (
        <ClassSelect 
          classes={currentModel.classes}
          value={deviceClass}
          onChange={setDeviceClass}
        />
      )}

      {/* Диаметр ДУ */}
      {diametersForSelect && (
        <div style={{ marginBottom: '20px' }}>
          <DiameterSelect 
            diameters={diametersForSelect}
            value={diameter}
            onChange={setDiameter}
          />
        </div>
      )}

      {/* Заводской номер */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          Заводской номер
        </label>
        <input
          type="text"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          placeholder="Введите заводской номер"
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = '#007bff'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />
      </div>

      {/* В составе */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          В составе
        </label>
        <input
          type="text"
          value={composition}
          onChange={(e) => hasComposition && setComposition(e.target.value)}
          placeholder={hasComposition ? "Введите состав (например: Теплосчетчик, датчик давления, датчик температуры)" : "Состав отсутствует для данного прибора"}
          style={hasComposition ? inputStyle : disabledInputStyle}
          disabled={!hasComposition}
          onFocus={(e) => hasComposition && (e.target.style.borderColor = '#007bff')}
          onBlur={(e) => hasComposition && (e.target.style.borderColor = '#e0e0e0')}
        />
        {!hasComposition && (
          <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
            ⚠️ Для данного прибора состав не предусмотрен
          </div>
        )}
        {hasComposition && (
          <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
            Укажите состав комплекса (если есть)
          </div>
        )}
      </div>

      {/* Номер протокола */}
      <div style={{ marginBottom: '20px' }}>
        <ProtocolNumberInput 
          value={protocolNumber}
          onChange={setProtocolNumber}
        />
      </div>

      {/* Чекбокс для ручного ввода даты */}
      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          id="manualDate"
          checked={manualDate}
          onChange={(e) => {
            setManualDate(e.target.checked);
            if (!e.target.checked) {
              setVerificationDate(null);
            }
          }}
          style={checkboxStyle}
        />
        <label htmlFor="manualDate" style={{ cursor: 'pointer', fontSize: '14px', color: '#555' }}>
          Ввести дату поверки вручную
        </label>
      </div>

      {/* Дата поверки */}
      <div style={{ marginBottom: '20px' }}>
        <DatePicker
          label="Дата поверки"
          value={verificationDate}
          onChange={setVerificationDate}
          disabled={!manualDate}
        />
        <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
          {manualDate 
            ? "Укажите дату поверки" 
            : "Если не указана дата, будет использована текущая дата"}
        </div>
      </div>
    </div>
  );
}

export default DeviceInfo;