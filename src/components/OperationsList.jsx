import React, { useState, useEffect, useMemo } from 'react';
import StandardTable from './tables/StandardTable';
import ImpulseTable from './tables/ImpulseTable';

function OperationsList({ device, currentData, diameter, deviceClass, onResultsChange, onMeasurementDataChange }) {
  const [results, setResults] = useState({});
  const [measurements, setMeasurements] = useState({});

  // Берем операции из device и мемоизируем их
  const operations = useMemo(() => device?.operations || [], [device]);

  // Инициализация результатов для disabled операций
  useEffect(() => {
    if (operations.length) {
      const defaultResults = {};
      operations.forEach(op => {
        if (op.disabledByDefault) {
          defaultResults[op.name] = 'Не проводилась';
        }
      });
      if (Object.keys(defaultResults).length > 0) {
        setResults(prev => ({ ...prev, ...defaultResults }));
        onResultsChange({ ...results, ...defaultResults });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operations, onResultsChange]);

  // Определяем, заблокирована ли операция
  const isOperationDisabled = (operation) => {
    if (operation.disabledByDefault) return true;
    
    const previousOperations = operations.filter(op => op.order < operation.order);
    return previousOperations.some(op => results[op.name] === 'Не соответствует');
  };

  // Определяем, заблокирована ли таблица
  const isTableDisabled = () => {
    if (!operations.length) return false;
    
    const measurementOperation = operations.find(op => op.hasTable === true);
    if (!measurementOperation) return false;
    
    const previousOperations = operations.filter(op => op.order < measurementOperation.order);
    
    return previousOperations.some(op => {
      if (op.disabledByDefault) return false;
      return results[op.name] === 'Не соответствует';
    });
  };

  // При выборе диаметра автоматически заполняем расходы и объемы
  useEffect(() => {
    if (diameter && currentData && currentData.diameters && currentData.diameters[diameter]) {
      const diameterData = currentData.diameters[diameter];
      
      if (diameterData && diameterData.points && Array.isArray(diameterData.points)) {
        const points = diameterData.points;
        const newMeasurements = {};
        
        const measurementOperation = operations.find(op => op.hasTable === true);
        const tableType = measurementOperation?.tableType || 'standard';
        const isImpulseTable = tableType === 'impulse';
        
        points.forEach((point, index) => {
          const rowNum = index + 1;
          
          newMeasurements[`row_${rowNum}_col_1`] = point.flow ? point.flow.toString() : '';
          
          if (currentData.errorLimits && currentData.errorLimits[index]) {
            if (isImpulseTable) {
              newMeasurements[`row_${rowNum}_col_7`] = currentData.errorLimits[index];
            } else {
              newMeasurements[`row_${rowNum}_col_5`] = currentData.errorLimits[index];
            }
          } else {
            if (isImpulseTable) {
              newMeasurements[`row_${rowNum}_col_7`] = '±2.00';
            } else {
              newMeasurements[`row_${rowNum}_col_5`] = '±2.00';
            }
          }
          
          if (point.volume) {
            newMeasurements[`row_${rowNum}_volume`] = point.volume;
          }
          
          if (isImpulseTable && diameterData.pulseWeight) {
            newMeasurements[`row_${rowNum}_col_4`] = diameterData.pulseWeight.toString();
          }
        });
        
        setMeasurements(newMeasurements);
        onMeasurementDataChange(newMeasurements);
      }
    }
  }, [currentData, diameter, onMeasurementDataChange, operations]);

  // Функция для расчета относительной погрешности
  const calculateError = (installValue, meterValue) => {
    if (installValue && meterValue && parseFloat(installValue) !== 0) {
      const install = parseFloat(installValue);
      const meter = parseFloat(meterValue);
      const error = ((meter - install) / install) * 100;
      return error.toFixed(2);
    }
    return '';
  };

  // Функция для генерации значения в пределах допуска
  const generateValueInRange = (baseValue, errorLimit, isGood) => {
    if (!errorLimit) return baseValue;
    
    const limit = parseFloat(errorLimit.replace('±', ''));
    
    if (isGood) {
      const percent = Math.random() * limit * 0.8;
      return baseValue * (1 + (Math.random() > 0.5 ? percent / 100 : -percent / 100));
    } else {
      const multiplier = 1.1 + (Math.random() * 1.9);
      const percent = limit * multiplier;
      return baseValue * (1 + (Math.random() > 0.5 ? percent / 100 : -percent / 100));
    }
  };

  const handleRandomFill = () => {
    if (!diameter || !currentData || !currentData.diameters || !currentData.diameters[diameter]) {
      alert('Сначала выберите диаметр');
      return;
    }
  
    if (!operations.length) {
      alert('Ошибка: нет данных об операциях');
      return;
    }
  
    if (isTableDisabled()) {
      alert('Невозможно сгенерировать значения: предыдущие операции не соответствуют');
      return;
    }
  
    const measurementOp = operations.find(op => op.hasTable === true);
    const isGood = results[measurementOp?.name] === 'Соответствует';
    const tableType = measurementOp?.tableType || 'standard';
    const isImpulseTable = tableType === 'impulse';
    
    const diameterData = currentData.diameters[diameter];
    const pointsCount = diameterData.points?.length || 3;
    
    const newMeasurements = { ...measurements };
    
    // Массив для хранения результатов точек (для импульсной таблицы)
    const pointResults = [];
  
    for (let row = 1; row <= pointsCount; row++) {
      const targetVolume = parseFloat(newMeasurements[`row_${row}_volume`]) || 100;
      const errorLimitField = isImpulseTable ? `row_${row}_col_7` : `row_${row}_col_5`;
      const errorLimit = newMeasurements[errorLimitField] || '2.00';
      const limitValue = parseFloat(errorLimit.replace('±', ''));
      
      if (isImpulseTable) {
        const pulseWeight = parseFloat(diameterData.pulseWeight) || 1;
        
        // 1. Показания счетчика = targetVolume + от 0.1% до 30%
        const minMeter = targetVolume * 1.001;   // +0.1%
        const maxMeter = targetVolume * 1.30;    // +30%
        const meterVolume = minMeter + Math.random() * (maxMeter - minMeter);
        
        // 2. Количество импульсов = целая часть от показаний счетчика / вес импульса
        const impulseCount = Math.floor(meterVolume / pulseWeight);
        
        // 3. Подбираем показания установки (эталон) с нужной погрешностью
        let installValue;
        let actualError;
        
        if (isGood) {
          // Соответствует - погрешность не более ±2% для всех точек
          const maxAllowedError = limitValue * 0.9;
          const errorPercent = (Math.random() * 2 - 1) * maxAllowedError;
          installValue = meterVolume / (1 + errorPercent / 100);
          actualError = errorPercent;
        } else {
          // Не соответствует - 70% вероятность ошибки в каждой точке
          // 30% точек будут в допуске
          const makeError = Math.random() < 0.7;
          
          if (makeError) {
            // Погрешность за пределами допуска
            const minError = limitValue + 0.1;
            const maxError = limitValue * 3;
            const errorPercent = (Math.random() > 0.5 ? 1 : -1) * (minError + Math.random() * (maxError - minError));
            installValue = meterVolume / (1 + errorPercent / 100);
            actualError = errorPercent;
          } else {
            // Погрешность в пределах допуска
            const maxAllowedError = limitValue * 0.9;
            const errorPercent = (Math.random() * 2 - 1) * maxAllowedError;
            installValue = meterVolume / (1 + errorPercent / 100);
            actualError = errorPercent;
          }
        }
        
        newMeasurements[`row_${row}_col_2`] = installValue.toFixed(3);
        newMeasurements[`row_${row}_col_3`] = meterVolume.toFixed(3);
        newMeasurements[`row_${row}_col_4`] = pulseWeight.toString();
        newMeasurements[`row_${row}_col_5`] = impulseCount.toString();
        newMeasurements[`row_${row}_col_6`] = actualError.toFixed(2);
        
        // Сохраняем результат точки
        pointResults.push({
          row,
          actualError: actualError,
          isError: Math.abs(actualError) > limitValue
        });
        
      } else {
        // Стандартная таблица (6 столбцов)
        const deviation = 1.001 + (Math.random() * 0.029);
        const installValue = targetVolume * deviation;
        newMeasurements[`row_${row}_col_2`] = installValue.toFixed(2);
        
        const meterValue = generateValueInRange(installValue, errorLimit, isGood);
        newMeasurements[`row_${row}_col_3`] = meterValue.toFixed(2);
        
        const errorValue = calculateError(installValue.toFixed(2), meterValue.toFixed(2));
        newMeasurements[`row_${row}_col_4`] = errorValue;
      }
    }
    
    // Для импульсной таблицы и "Не соответствует" - проверяем, есть ли хотя бы одна точка с ошибкой
    if (isImpulseTable && !isGood) {
      const hasAnyError = pointResults.some(p => p.isError);
      
      // Если нет ни одной точки с ошибкой - перегенерируем последнюю точку с ошибкой
      if (!hasAnyError && pointResults.length > 0) {
        const lastRow = pointsCount;
        const targetVolume = parseFloat(newMeasurements[`row_${lastRow}_volume`]) || 100;
        const errorLimit = newMeasurements[`row_${lastRow}_col_7`] || '2.00';
        const limitValue = parseFloat(errorLimit.replace('±', ''));
        const pulseWeight = parseFloat(diameterData.pulseWeight) || 1;
        
        // Перегенерируем последнюю точку с ошибкой
        const minMeter = targetVolume * 1.001;
        const maxMeter = targetVolume * 1.30;
        const meterVolume = minMeter + Math.random() * (maxMeter - minMeter);
        const impulseCount = Math.floor(meterVolume / pulseWeight);
        
        // Генерируем погрешность за пределами допуска
        const minError = limitValue + 0.1;
        const maxError = limitValue * 3;
        const errorPercent = (Math.random() > 0.5 ? 1 : -1) * (minError + Math.random() * (maxError - minError));
        const installValue = meterVolume / (1 + errorPercent / 100);
        const actualError = errorPercent;
        
        newMeasurements[`row_${lastRow}_col_2`] = installValue.toFixed(3);
        newMeasurements[`row_${lastRow}_col_3`] = meterVolume.toFixed(3);
        newMeasurements[`row_${lastRow}_col_4`] = pulseWeight.toString();
        newMeasurements[`row_${lastRow}_col_5`] = impulseCount.toString();
        newMeasurements[`row_${lastRow}_col_6`] = actualError.toFixed(2);
      }
    }
  
    setMeasurements(newMeasurements);
    onMeasurementDataChange(newMeasurements);
  };

  const handleOperationResult = (operationName, result) => {
    const newResults = { ...results, [operationName]: result };
    setResults(newResults);
    onResultsChange(newResults);
  };

  const handleMeasurementChange = (rowIndex, colIndex, value) => {
    const key = `row_${rowIndex}_col_${colIndex}`;
    const newMeasurements = { ...measurements, [key]: value };
    
    const measurementOp = operations.find(op => op.hasTable === true);
    const tableType = measurementOp?.tableType || 'standard';
    const isImpulseTable = tableType === 'impulse';
    
    if (isImpulseTable) {
      const installKey = `row_${rowIndex}_col_2`;
      const pulseWeightKey = `row_${rowIndex}_col_4`;
      const impulseCountKey = `row_${rowIndex}_col_5`;
      const errorKey = `row_${rowIndex}_col_6`;
      
      const installVolume = parseFloat(newMeasurements[installKey]);
      const pulseWeight = parseFloat(newMeasurements[pulseWeightKey]);
      const impulseCount = parseFloat(newMeasurements[impulseCountKey]);
      
      if (installVolume && !isNaN(installVolume) && impulseCount && !isNaN(impulseCount) && pulseWeight && !isNaN(pulseWeight)) {
        const meterVolume = impulseCount * pulseWeight;
        const errorValue = ((meterVolume - installVolume) / installVolume) * 100;
        newMeasurements[errorKey] = errorValue.toFixed(2);
        newMeasurements[`row_${rowIndex}_col_3`] = meterVolume.toFixed(2);
      }
      
      if (colIndex === 2 || colIndex === 4) {
        const currentImpulseCount = parseFloat(newMeasurements[impulseCountKey]);
        if (currentImpulseCount && !isNaN(currentImpulseCount)) {
          const currentPulseWeight = parseFloat(newMeasurements[pulseWeightKey]);
          const currentInstallVolume = parseFloat(newMeasurements[installKey]);
          
          if (currentPulseWeight && currentInstallVolume) {
            const meterVolume = currentImpulseCount * currentPulseWeight;
            const errorValue = ((meterVolume - currentInstallVolume) / currentInstallVolume) * 100;
            newMeasurements[errorKey] = errorValue.toFixed(2);
            newMeasurements[`row_${rowIndex}_col_3`] = meterVolume.toFixed(2);
          }
        }
      }
      
      if (colIndex === 5) {
        const currentPulseWeight = parseFloat(newMeasurements[pulseWeightKey]);
        const currentInstallVolume = parseFloat(newMeasurements[installKey]);
        const currentImpulseCount = parseFloat(value);
        
        if (currentPulseWeight && currentInstallVolume && currentImpulseCount && !isNaN(currentImpulseCount)) {
          const meterVolume = currentImpulseCount * currentPulseWeight;
          const errorValue = ((meterVolume - currentInstallVolume) / currentInstallVolume) * 100;
          newMeasurements[errorKey] = errorValue.toFixed(2);
          newMeasurements[`row_${rowIndex}_col_3`] = meterVolume.toFixed(2);
        }
      }
      
    } else {
      if (colIndex === 2 || colIndex === 3) {
        const installKey = `row_${rowIndex}_col_2`;
        const meterKey = `row_${rowIndex}_col_3`;
        
        const installValue = colIndex === 2 ? value : newMeasurements[installKey];
        const meterValue = colIndex === 3 ? value : newMeasurements[meterKey];
        
        const errorValue = calculateError(installValue, meterValue);
        if (errorValue) {
          newMeasurements[`row_${rowIndex}_col_4`] = errorValue;
        }
      }
    }
    
    setMeasurements(newMeasurements);
    onMeasurementDataChange(newMeasurements);
  };

  const getButtonStyle = (operationName, buttonType, isDisabled) => {
    const isActive = results[operationName] === buttonType;
    
    if (isDisabled) {
      return {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'not-allowed',
        backgroundColor: '#e9ecef',
        color: '#adb5bd',
        marginRight: '8px',
        opacity: 0.6
      };
    }
    
    return {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: isActive 
        ? (buttonType === 'Соответствует' ? '#28a745' : '#dc3545')
        : (buttonType === 'Соответствует' ? '#d4edda' : '#f8d7da'),
      color: isActive ? 'white' : (buttonType === 'Соответствует' ? '#155724' : '#721c24'),
      marginRight: '8px'
    };
  };

  const shortenOperationName = (name) => {
    if (name.length > 55) {
      return name.substring(0, 52) + '...';
    }
    return name;
  };

  const getPointsCount = () => {
    if (diameter && currentData?.diameters?.[diameter]?.points) {
      return currentData.diameters[diameter].points.length;
    }
    return 0;
  };

  const pointsCount = getPointsCount();
  const tableRows = pointsCount > 0 ? Array.from({ length: pointsCount }, (_, i) => i + 1) : [];
  const tableDisabled = isTableDisabled();

  const measurementOperation = operations.find(op => op.hasTable === true);
  const tableType = measurementOperation?.tableType || 'standard';

  return (
    <div>
      {operations.sort((a, b) => a.order - b.order).map((operation) => {
        const disabled = isOperationDisabled(operation);
        
        return (
          <div key={operation.order} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            opacity: disabled ? 0.7 : 1,
            backgroundColor: disabled ? '#f8f9fa' : 'white'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '15px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '16px',
                fontWeight: 500,
                flex: 1,
                minWidth: '200px',
                lineHeight: '1.4',
                color: '#333'
              }} title={operation.name}>
                {shortenOperationName(operation.name)}
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  onClick={() => !disabled && handleOperationResult(operation.name, 'Соответствует')}
                  style={getButtonStyle(operation.name, 'Соответствует', disabled)}
                  disabled={disabled}
                >
                  ✓ Соответствует
                </button>
                <button
                  onClick={() => !disabled && handleOperationResult(operation.name, 'Не соответствует')}
                  style={getButtonStyle(operation.name, 'Не соответствует', disabled)}
                  disabled={disabled}
                >
                  ✗ Не соответствует
                </button>
              </div>
            </div>

            {operation.hasTable && (
              <div style={{ marginTop: '15px' }}>
                <h4 style={{ marginBottom: '10px' }}>
                  Результаты измерений {pointsCount > 0 ? `(${pointsCount} точки):` : ':'}
                </h4>
                
                {pointsCount > 0 ? (
                  tableType === 'impulse' ? (
                    <ImpulseTable 
                      tableRows={tableRows}
                      measurements={measurements}
                      tableDisabled={tableDisabled}
                      handleMeasurementChange={handleMeasurementChange}
                      diameter={diameter}
                    />
                  ) : (
                    <StandardTable 
                      tableRows={tableRows}
                      measurements={measurements}
                      tableDisabled={tableDisabled}
                      handleMeasurementChange={handleMeasurementChange}
                      diameter={diameter}
                    />
                  )
                ) : (
                  <div style={{
                    padding: '20px',
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffeeba',
                    borderRadius: '4px',
                    color: '#856404',
                    textAlign: 'center',
                    marginBottom: '15px'
                  }}>
                    ⚠️ Выберите диаметр для отображения таблицы измерений
                  </div>
                )}
                
                {diameter && pointsCount > 0 && !tableDisabled && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '15px'
                  }}>
                    <button
                      onClick={handleRandomFill}
                      style={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                        padding: '10px 24px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
                    >
                      Сгенерировать значения
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default OperationsList;