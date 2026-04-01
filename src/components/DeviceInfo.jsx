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

  useEffect(() => {
    setDeviceClass('');
    setDiameter('');
  }, [model, setDeviceClass, setDiameter]);

  useEffect(() => {
    setDiameter('');
  }, [deviceClass, setDiameter]);

  useEffect(() => {
    setDeviceClass('');
    setDiameter('');
  }, [deviceType, setDeviceClass, setDiameter]);

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

  const hasComposition = device?.hasComposition || false;

  // Получаем текущую модель
  const currentModel = model && device.models ? device.models[model] : null;
  
  // Получаем текущий тип (из модели)
  const currentType = deviceType && currentModel?.hasTypes && currentModel?.types 
    ? currentModel.types[deviceType] 
    : null;
  
  // Получаем текущий класс:
  // 1. Если у типа есть classes (WPH-ZF)
  // 2. Если у модели есть classes (55115-13)
  const currentClass = (() => {
    if (currentType?.classes && deviceClass) {
      return currentType.classes[deviceClass];
    }
    if (currentModel?.classes && deviceClass) {
      return currentModel.classes[deviceClass];
    }
    return null;
  })();

  // Определяем, какие данные показывать для диаметров
  const getDiametersForSelect = () => {
    if (currentClass?.diameters) return currentClass.diameters;
    if (currentType?.diameters) return currentType.diameters;
    if (currentModel?.diameters) return currentModel.diameters;
    if (currentData?.diameters) return currentData.diameters;
    return null;
  };

  const diametersForSelect = getDiametersForSelect();
  
  // Показывать ли выбор типа (если у модели есть hasTypes)
  const showTypeSelect = currentModel?.hasTypes && currentModel.types;
  
  // Показывать ли выбор класса:
  // 1. Если у типа есть classes (WPH-ZF)
  // 2. Если у модели есть classes (55115-13)
  const showClassSelect = (currentType?.classes && Object.keys(currentType.classes).length > 0) ||
                          (currentModel?.hasClasses && currentModel.classes);
  
  // Классы для селекта
  const classesForSelect = currentType?.classes || (currentModel?.hasClasses ? currentModel.classes : null);

  return (
    <div>
      {/* Выбор модели прибора (если есть) */}
      {device.models && (
        <ModelSelect 
          models={device.models}
          value={model}
          onChange={setModel}
        />
      )}

      {/* Выбор типа (если у модели есть hasTypes) */}
      {showTypeSelect && (
        <DeviceTypeSelect 
          types={currentModel.types}
          value={deviceType}
          onChange={setDeviceType}
        />
      )}

      {/* Выбор класса (если есть) */}
      {showClassSelect && classesForSelect && (
        <ClassSelect 
          classes={classesForSelect}
          value={deviceClass}
          onChange={setDeviceClass}
        />
      )}

      {/* Диаметр */}
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
          placeholder={hasComposition ? "Введите состав" : "Состав отсутствует"}
          style={hasComposition ? inputStyle : disabledInputStyle}
          disabled={!hasComposition}
        />
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

      <div style={{ marginBottom: '20px' }}>
        <DatePicker
          label="Дата поверки"
          value={verificationDate}
          onChange={setVerificationDate}
          disabled={!manualDate}
        />
      </div>
    </div>
  );
}

export default DeviceInfo;