import React, { useState, useEffect } from 'react';
import DeviceSearch from './components/DeviceSearch';
import DeviceInfo from './components/DeviceInfo';
import OperationsList from './components/OperationsList';
import PDFGenerator from './components/PDFGenerator';

function App() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceType, setDeviceType] = useState('');
  const [model, setModel] = useState('');
  const [deviceClass, setDeviceClass] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [diameter, setDiameter] = useState('');
  const [composition, setComposition] = useState('');
  const [operationsResults, setOperationsResults] = useState({});
  const [measurementData, setMeasurementData] = useState({});
  const [protocolNumber, setProtocolNumber] = useState('№П-____.___-____');
  const [verificationDate, setVerificationDate] = useState(null);
  const [manualDate, setManualDate] = useState(false);

  useEffect(() => {
    setDeviceType('');
    setModel('');
    setDeviceClass('');
    setDiameter('');
    setVerificationDate(null);
    setManualDate(false);
  }, [selectedDevice]);

  useEffect(() => {
    setDeviceClass('');
    setDiameter('');
  }, [model]);

  useEffect(() => {
    setDiameter('');
  }, [deviceClass]);

  const handleSearchChange = () => {
    setSelectedDevice(null);
    setDeviceType('');
    setModel('');
    setDeviceClass('');
    setSerialNumber('');
    setDiameter('');
    setComposition('');
    setOperationsResults({});
    setMeasurementData({});
    setProtocolNumber('№П-____.___-____');
    setVerificationDate(null);
    setManualDate(false);
  };

  const getCurrentDeviceData = () => {
    if (!selectedDevice) return null;
    
    if (selectedDevice.models) {
      if (model && deviceClass) {
        return selectedDevice.models[model]?.classes[deviceClass];
      }
      if (model) {
        return selectedDevice.models[model];
      }
      return selectedDevice;
    }
    
    if (selectedDevice.hasTypes && deviceType) {
      return selectedDevice.types[deviceType];
    }
    
    return selectedDevice;
  };

  const currentData = getCurrentDeviceData();

  const appStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px'
  };

  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto'
  };

  const headerStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#343a40'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '20px',
    marginBottom: '20px'
  };

  return (
    <div style={appStyle}>
      <div style={containerStyle}>
        <h1 style={headerStyle}>
          Протокол поверки СИ
        </h1>

        <div style={cardStyle}>
          <DeviceSearch 
            onDeviceSelect={setSelectedDevice}
            onSearchChange={handleSearchChange}
          />
          
          {selectedDevice && (
            <DeviceInfo 
              device={selectedDevice}
              currentData={currentData}
              deviceType={deviceType}
              setDeviceType={setDeviceType}
              model={model}
              setModel={setModel}
              deviceClass={deviceClass}
              setDeviceClass={setDeviceClass}
              serialNumber={serialNumber}
              setSerialNumber={setSerialNumber}
              protocolNumber={protocolNumber}
              setProtocolNumber={setProtocolNumber}
              diameter={diameter}
              setDiameter={setDiameter}
              composition={composition}
              setComposition={setComposition}
              verificationDate={verificationDate}
              setVerificationDate={setVerificationDate}
              manualDate={manualDate}
              setManualDate={setManualDate}
            />
          )}
        </div>

        {currentData && diameter && (
          <div style={cardStyle}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Операции поверки</h2>
            <OperationsList 
              device={selectedDevice}
              currentData={currentData}
              diameter={diameter}
              onResultsChange={setOperationsResults}
              onMeasurementDataChange={setMeasurementData}
            />
          </div>
        )}

        {currentData && diameter && (
          <div style={cardStyle}>
            <PDFGenerator 
              device={selectedDevice}
              currentData={currentData}
              serialNumber={serialNumber}
              diameter={diameter}
              deviceType={deviceType}
              selectedModel={model}
              deviceClass={deviceClass}
              composition={composition}
              protocolNumber={protocolNumber}
              operationsResults={operationsResults}
              measurementData={measurementData}
              verificationDate={verificationDate}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;