import React, { useState, useEffect, useRef } from 'react';
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
  
  // Состояния для радио
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState(0);
  const audioRef = useRef(null);
  
  const stations = [
    { name: 'Европа Плюс', url: 'https://ep256.hostingradio.ru:8052/europaplus256.mp3' },
    { name: 'Радио Рекорд', url: 'https://radiorecord.hostingradio.ru/rr_main96.aacp' },
    { name: 'Наше Радио', url: 'https://nashe1.hostingradio.ru/nashe-256' },
    { name: 'DFM', url: 'https://dfm.hostingradio.ru/dfm96.aacp' },
    { name: 'Love Radio', url: 'https://love.hostingradio.ru/love96.aacp' }
  ];

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

  // Управление радио
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeStation = (index) => {
    setCurrentStation(index);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.load();
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    }
  };

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

  const getCurrentModel = () => {
    if (!selectedDevice) return null;
    if (selectedDevice.models && model) {
      return selectedDevice.models[model];
    }
    return selectedDevice;
  };

  const currentModel = getCurrentModel();

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

  const radioStyle = {
    backgroundColor: '#1a1a2e',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '15px',
    color: 'white'
  };

  const stationButtonStyle = (isActive) => ({
    backgroundColor: isActive ? '#e94560' : '#0f3460',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    margin: '0 4px 4px 0',
    transition: 'all 0.2s'
  });

  const playButtonStyle = {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '18px',
    marginRight: '15px'
  };

  return (
    <div style={appStyle}>
      <div style={containerStyle}>
        {/* Радио плеер */}
        <div style={radioStyle}>
          <audio
            ref={audioRef}
            src={stations[currentStation].url}
            onEnded={() => setIsPlaying(false)}
            onError={() => setIsPlaying(false)}
          />
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={togglePlay} style={playButtonStyle}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {stations[currentStation].name}
              </div>
              <div>
                {stations.map((station, idx) => (
                  <button
                    key={idx}
                    onClick={() => changeStation(idx)}
                    style={stationButtonStyle(currentStation === idx)}
                  >
                    {station.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

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
              device={currentModel}
              currentData={currentData}
              diameter={diameter}
              deviceClass={deviceClass}
              onResultsChange={setOperationsResults}
              onMeasurementDataChange={setMeasurementData}
            />
          </div>
        )}

        {currentData && diameter && (
          <div style={cardStyle}>
            <PDFGenerator 
              fullDevice={selectedDevice}
              device={currentModel}
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