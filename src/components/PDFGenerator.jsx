import React from 'react';
import { Download } from 'lucide-react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Правильная инициализация шрифтов
if (pdfFonts) {
  pdfMake.vfs = pdfFonts;
}

function PDFGenerator({ 
  fullDevice,
  device, 
  currentData, 
  serialNumber, 
  diameter, 
  deviceType,
  selectedModel,
  deviceClass,
  composition, 
  protocolNumber, 
  operationsResults, 
  measurementData, 
  verificationDate 
}) {
  
  const generatePDF = () => {
    try {
      // Функция для получения случайных значений
      const getRandomFactor = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
      
      // Форматирование даты
      const today = new Date();
      const verificationDateObj = verificationDate || today;
      
      // Берем операции из currentData или device
      const operations = currentData?.operations || device?.operations || [];
      
      // Определяем тип таблицы
      const measurementOperation = operations.find(op => op.hasTable === true);
      const tableType = measurementOperation?.tableType || 'standard';
      const isImpulseTable = tableType === 'impulse';
      
      // Определяем годен/не годен (для заключения)
      const activeOperations = operations.filter(op => !op.disabledByDefault);
      const isAllPassed = activeOperations.length > 0 ? activeOperations.every(op => 
        operationsResults[op.name] === 'Соответствует'
      ) : false;

      // Рассчитываем следующую дату только если прибор годен
      let nextDate = null;
      if (isAllPassed) {
        const period = currentData?.nextVerificationPeriod || device?.nextVerificationPeriod || 1;
        nextDate = new Date(verificationDateObj);
        nextDate.setFullYear(nextDate.getFullYear() + period);
        nextDate.setDate(nextDate.getDate() - 1);
      }

      const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
      };

      // Создаем массив с операциями (название жирным, значение обычным)
      const operationsList = [];
      operations.forEach(op => {
        const result = operationsResults[op.name] || 'Не проводилась';
        operationsList.push({
          text: [
            { text: `${op.name}: `, bold: true },
            { text: result }
          ],
          margin: [10, 2, 0, 0]
        });
      });

      // Создаем таблицу измерений
      let measurementTable = null;
      
      const hasMeasurementData = measurementData && 
        Object.keys(measurementData).some(key => key.includes('col_1') && measurementData[key]);
      
      if (hasMeasurementData) {
        
        // Получаем количество точек из данных
        const pointsCount = Object.keys(measurementData).filter(key => key.includes('col_1')).length;
        
        let tableBody;
        
        if (isImpulseTable) {
          // Impulse таблица (8 столбцов)
          tableBody = [
            [
              { text: '№', style: 'tableHeader' },
              { text: 'Расход,\nм³/ч', style: 'tableHeader' },
              { text: 'Показания\nустановки, л', style: 'tableHeader' },
              { text: 'Показания\nсчетчика, л', style: 'tableHeader' },
              { text: 'Вес\nимпульса', style: 'tableHeader' },
              { text: 'Количество\nимпульсов', style: 'tableHeader' },
              { text: 'Относительная\nпогрешность, %', style: 'tableHeader' },
              { text: 'Пределы допускаемой\nотносительной\nпогрешности, %', style: 'tableHeader' }
            ]
          ];

          for (let row = 1; row <= pointsCount; row++) {
            let errorLimit = measurementData[`row_${row}_col_7`] || '—';
            if (errorLimit !== '—') {
              errorLimit = errorLimit.replace('±', '');
            }

            const rowData = [
              { text: row.toString(), style: 'tableCell' },
              { text: measurementData[`row_${row}_col_1`] || '—', style: 'tableCell' },
              { text: measurementData[`row_${row}_col_2`] || '—', style: 'tableCell' },
              { text: measurementData[`row_${row}_col_3`] || '—', style: 'tableCell' },
              { text: measurementData[`row_${row}_col_4`] || '—', style: 'tableCell' },
              { text: measurementData[`row_${row}_col_5`] || '—', style: 'tableCell' },
              { text: measurementData[`row_${row}_col_6`] || '—', style: 'tableCell' },
              { text: errorLimit, style: 'tableCell' }
            ];
            tableBody.push(rowData);
          }

          measurementTable = {
            table: {
              headerRows: 1,
              widths: ['5%', '10%', '12%', '12%', '10%', '12%', '15%', '24%'],
              body: tableBody
            },
            layout: {
              fillColor: function(rowIndex) {
                return rowIndex === 0 ? '#f0f0f0' : null;
              },
              hLineWidth: function(i) {
                return 0.5;
              },
              vLineWidth: function(i) {
                return 0.5;
              },
              hLineColor: function(i) {
                return '#aaa';
              },
              vLineColor: function(i) {
                return '#aaa';
              },
              paddingLeft: function(i) {
                return 5;
              },
              paddingRight: function(i) {
                return 5;
              },
              paddingTop: function(i) {
                return 5;
              },
              paddingBottom: function(i) {
                return 5;
              }
            },
            margin: [20, 8, 20, 8]
          };
        } else {
          // Standard таблица (6 столбцов)
          tableBody = [
            [
              { text: '№', style: 'tableHeader' },
              { text: 'Расход,\nм³/ч', style: 'tableHeader' },
              { text: 'Показания\nустановки, л', style: 'tableHeader' },
              { text: 'Показания\nсчетчика', style: 'tableHeader' },
              { text: 'Относительная\nпогрешность, %', style: 'tableHeader' },
              { text: 'Пределы допускаемой\nотносительной\nпогрешности, %', style: 'tableHeader' }
            ]
          ];

          for (let row = 1; row <= pointsCount; row++) {
            let errorLimit = measurementData[`row_${row}_col_5`] || '—';
            if (errorLimit !== '—') {
              errorLimit = errorLimit.replace('±', '');
            }

            const rowData = [
              { text: row.toString(), style: 'tableCell' },
              { text: measurementData[`row_${row}_col_1`] || '—', style: 'tableCell' },
              { text: measurementData[`row_${row}_col_2`] || '—', style: 'tableCell' },
              { text: measurementData[`row_${row}_col_3`] || '—', style: 'tableCell' },
              { text: measurementData[`row_${row}_col_4`] || '—', style: 'tableCell' },
              { text: errorLimit, style: 'tableCell' }
            ];
            tableBody.push(rowData);
          }

          measurementTable = {
            table: {
              headerRows: 1,
              widths: ['5%', '15%', '20%', '20%', '20%', '20%'],
              body: tableBody
            },
            layout: {
              fillColor: function(rowIndex) {
                return rowIndex === 0 ? '#f0f0f0' : null;
              },
              hLineWidth: function(i) {
                return 0.5;
              },
              vLineWidth: function(i) {
                return 0.5;
              },
              hLineColor: function(i) {
                return '#aaa';
              },
              vLineColor: function(i) {
                return '#aaa';
              },
              paddingLeft: function(i) {
                return 5;
              },
              paddingRight: function(i) {
                return 5;
              },
              paddingTop: function(i) {
                return 5;
              },
              paddingBottom: function(i) {
                return 5;
              }
            },
            margin: [20, 8, 20, 8]
          };
        }
      }

      // Формируем полное название прибора с учётом модели и класса
      const getFullDeviceName = () => {
        let name = '';
        
        if (fullDevice?.models && selectedModel) {
          const model = fullDevice.models[selectedModel];
          if (model) {
            name = fullDevice.name || '';
            const modelDisplay = model.displayName || model.name || selectedModel;
            name = `${name} ${modelDisplay}`;
          }
        }
        
        if (fullDevice?.hasTypes && deviceType) {
          const type = fullDevice.types[deviceType];
          if (type) {
            name = `${fullDevice.name} (${type.displayName})`;
          }
        }
        
        if (!fullDevice?.models && !fullDevice?.hasTypes) {
          name = fullDevice?.name;
        }
        
        if (deviceClass) {
          const classDisplay = deviceClass === 'classA' ? 'класс А' : (deviceClass === 'classB' ? 'класс В' : 'класс С');
          name = `${name} (${classDisplay})`;
        }
        
        if (diameter) {
          if (diameter.includes('-')) {
            if (currentData && currentData.diameters && currentData.diameters[diameter]) {
              const diameterData = currentData.diameters[diameter];
              const diameterDisplay = diameterData.displayName || `ДУ-${diameter}`;
              name = `${name} ${diameterDisplay}`;
            } else {
              name = `${name} ДУ-${diameter}`;
            }
          } else {
            name = `${name} ДУ-${diameter}`;
          }
        }
        
        return name;
      };

      const deviceFullName = getFullDeviceName();

      // Формируем текст для состава
      const compositionText = composition && composition.trim() !== '' ? composition : '—';

      // Получаем ширину страницы A4 в точках (595.28) и вычисляем центр
      const pageWidth = 595.28;
      const leftMargin = 40;
      const rightMargin = 40;
      const contentWidth = pageWidth - leftMargin - rightMargin;

      // Функция для создания поля с жирным заголовком и курсивным значением
      const createFieldWithLine = (label, value) => {
        const safeValue = value || '—';
        const fullText = `${label} ${safeValue}`;
        
        const charsPerLine = Math.floor(contentWidth / 5.5);
        
        const words = fullText.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          if (testLine.length <= charsPerLine) {
            currentLine = testLine;
          } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          }
        });
        if (currentLine) lines.push(currentLine);
        
        const stackContent = [];
        
        lines.forEach((line, index) => {
          if (index === 0) {
            const valuePart = line.substring(label.length).trim();
            stackContent.push({ 
              text: [
                { text: label, bold: true },
                { text: valuePart ? ' ' + valuePart : '', italics: true }
              ],
              margin: [0, 2, 0, 1] 
            });
          } else {
            stackContent.push({ 
              text: line, 
              italics: true,
              margin: [0, 1, 0, 1] 
            });
          }
          
          stackContent.push({
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: contentWidth,
                y2: 0,
                lineWidth: 0.5,
                lineColor: '#333333'
              }
            ]
          });
        });
        
        return {
          stack: stackContent,
          margin: [0, 1, 0, 1]
        };
      };

      // Формируем содержимое для дат в зависимости от годности
      const datesContent = isAllPassed && nextDate
        ? {
            columns: [
              { width: '50%', text: `Дата поверки: ${formatDate(verificationDateObj)}`, alignment: 'left' },
              { width: '50%', text: `Дата следующей поверки: ${formatDate(nextDate)}`, alignment: 'right' }
            ],
            margin: [0, 3, 0, 15]
          }
        : {
            text: `Дата поверки: ${formatDate(verificationDateObj)}`,
            alignment: 'left',
            margin: [0, 3, 0, 15]
          };

      // Создаем структуру документа
      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [leftMargin, 30, rightMargin, 30],
        defaultStyle: {
          fontSize: 10,
          lineHeight: 1.2
        },
        content: [
          { text: 'ООО «Нижегородский центр метрологии им. Профессора Т.Н. Праховой»', fontSize: 13, bold: true, alignment: 'center' },
          { text: '606040, Нижегородская обл., г. Дзержинск, ул. Зеленая, д.10', fontSize: 9, alignment: 'center', margin: [0, 0, 0, 3] },
          
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: contentWidth,
                y2: 0,
                lineWidth: 1,
                lineColor: '#333333'
              }
            ],
            alignment: 'center',
            margin: [0, 0, 0, 5]
          },
          
          { 
            text: 'Уникальный номер записи об аккредитации в реестре аккредитованных лиц RA.RU.314030', 
            italics: true,
            fontSize: 9,
            alignment: 'center',
            margin: [0, 3, 0, 5]
          },
          
          { text: `ПРОТОКОЛ ПОВЕРКИ ${protocolNumber}`, fontSize: 15, bold: true, alignment: 'center', margin: [0, 5, 0, 8] },
          
          createFieldWithLine('Средство измерений:', deviceFullName),
          createFieldWithLine('Заводской (серийный) номер:', serialNumber),
          createFieldWithLine('В составе:', compositionText),
          createFieldWithLine('Поверено в соответствии с:', device.common?.methodology || device?.methodology || currentData?.methodology || '—'),
          createFieldWithLine('С применением эталонов и рабочих СИ:', device.common?.standards || device?.standards || currentData?.standards || '—'),
          
          { text: '', margin: [0, 5, 0, 0] },
          
          { text: 'При следующих влияющих факторах:', bold: true, margin: [0, 5, 0, 3] },
          
          {
            stack: [
              { text: 'Температура поверочной жидкости: ' + getRandomFactor(15.4, 18.9) + ' °C', margin: [10, 3, 0, 1] },
              { text: 'Температура окружающего воздуха: ' + getRandomFactor(15.4, 22.2) + ' °C', margin: [10, 1, 0, 1] },
              { text: 'Относительная влажность: ' + getRandomFactor(45.2, 50.8) + ' %', margin: [10, 1, 0, 1] },
              { text: 'Атмосферное давление: ' + getRandomFactor(90.1, 102.7) + ' кПа', margin: [10, 1, 0, 3] }
            ],
            background: '#f5f5f5',
            margin: [0, 0, 0, 5]
          },
          
          { text: 'Результаты поверки', fontSize: 11, bold: true, margin: [0, 5, 0, 3] },
          
          ...operationsList,
          
          ...(measurementTable ? [measurementTable] : []),
          
          { 
            text: `Заключение о пригодности: ${isAllPassed ? 'ГОДЕН' : 'НЕ ГОДЕН'}`,
            bold: true,
            margin: [0, 8, 0, 3],
            fontSize: 11,
            color: isAllPassed ? 'green' : 'red'
          },
          
          datesContent,
          
          {
            columns: [
              { width: '25%', text: 'Поверитель:', alignment: 'left' },
              { width: '37%', text: '__________________________', alignment: 'center' },
              { width: '38%', text: '_______________________________', alignment: 'center' }
            ],
            margin: [0, 25, 0, 3]
          },
          
          {
            columns: [
              { width: '25%', text: '', alignment: 'left' },
              { width: '37%', text: '    (подпись)', alignment: 'center', fontSize: 8, color: '#666' },
              { width: '38%', text: '           (ФИО)', alignment: 'center', fontSize: 8, color: '#666' }
            ],
            margin: [0, 0, 0, 0]
          }
        ],
        styles: {
          tableHeader: {
            bold: true,
            fontSize: 9,
            alignment: 'center'
          },
          tableCell: {
            fontSize: 9,
            alignment: 'center'
          }
        }
      };

      // Генерируем PDF
      const fileName = isAllPassed 
        ? `protocol_${serialNumber}_${formatDate(verificationDateObj)}.pdf`
        : `protocol_${serialNumber}_${formatDate(verificationDateObj)}_rejected.pdf`;
      
      pdfMake.createPdf(docDefinition).download(fileName);
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      alert('Ошибка при создании PDF. Проверьте консоль для деталей.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <button
        onClick={generatePDF}
        style={{
          backgroundColor: '#28a745',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          margin: '20px 0'
        }}
      >
        <Download size={20} />
        Сформировать протокол поверки
      </button>
    </div>
  );
}

export default PDFGenerator;