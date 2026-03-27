import React from 'react';

function StandardTable({ 
  tableRows, 
  measurements, 
  tableDisabled, 
  handleMeasurementChange,
  diameter 
}) {
  const tableHeaderStyle = {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0'
  };

  const tableCellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center'
  };

  const inputStyle = {
    width: '100%',
    padding: '6px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '13px',
    textAlign: 'center',
    boxSizing: 'border-box'
  };

  return (
    <div>
      {!diameter && (
        <div style={{
          padding: '20px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeeba',
          borderRadius: '4px',
          color: '#856404',
          textAlign: 'center',
          marginBottom: '15px'
        }}>
          ⚠️ Выберите диаметр для отображения расходов и объемов проливки
        </div>
      )}

      {tableDisabled && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24',
          textAlign: 'center',
          marginBottom: '15px'
        }}>
          ⚠️ Таблица недоступна: предыдущие операции не соответствуют
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd',
          fontSize: '14px',
          opacity: tableDisabled ? 0.5 : 1
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ ...tableHeaderStyle, width: '5%' }}>№</th>
              <th style={{ ...tableHeaderStyle, width: '15%' }}>Расход, м³/ч</th>
              <th style={{ ...tableHeaderStyle, width: '20%' }}>Показания установки, л</th>
              <th style={{ ...tableHeaderStyle, width: '20%' }}>Показания счетчика</th>
              <th style={{ ...tableHeaderStyle, width: '20%' }}>Относительная погрешность, %</th>
              <th style={{ ...tableHeaderStyle, width: '20%' }}>Пределы допускаемой относительной погрешности, %</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((rowNum, index) => (
              <tr key={rowNum} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                <td style={tableCellStyle}>{rowNum}</td>
                <td style={tableCellStyle}>
                  <input
                    type="text"
                    value={measurements[`row_${rowNum}_col_1`] || ''}
                    style={{...inputStyle, backgroundColor: '#f0f0f0', fontWeight: 'bold'}}
                    readOnly
                  />
                </td>
                <td style={tableCellStyle}>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={measurements[`row_${rowNum}_col_2`] || ''}
                    onChange={(e) => !tableDisabled && handleMeasurementChange(rowNum, 2, e.target.value)}
                    style={inputStyle}
                    disabled={tableDisabled}
                  />
                </td>
                <td style={tableCellStyle}>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={measurements[`row_${rowNum}_col_3`] || ''}
                    onChange={(e) => !tableDisabled && handleMeasurementChange(rowNum, 3, e.target.value)}
                    style={inputStyle}
                    disabled={tableDisabled}
                  />
                </td>
                <td style={tableCellStyle}>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={measurements[`row_${rowNum}_col_4`] || ''}
                    onChange={(e) => !tableDisabled && handleMeasurementChange(rowNum, 4, e.target.value)}
                    style={{...inputStyle, backgroundColor: '#ffffff', borderColor: '#007bff'}}
                    disabled={tableDisabled}
                  />
                </td>
                <td style={tableCellStyle}>
                  <input
                    type="text"
                    value={measurements[`row_${rowNum}_col_5`] || ''}
                    style={{...inputStyle, backgroundColor: '#f0f0f0', fontWeight: 'bold', color: '#d35400'}}
                    readOnly
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StandardTable;