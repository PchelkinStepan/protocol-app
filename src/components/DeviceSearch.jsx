import React, { useState } from 'react';
import { Search } from 'lucide-react';
import devicesData from '../data/devices';

function DeviceSearch({ onDeviceSelect, onSearchChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (onSearchChange) {
      onSearchChange();
    }
    
    if (query.length >= 3) {
      const devicesArray = Object.values(devicesData);
      const results = devicesArray.filter(device => {
        const matchesId = device.id.toLowerCase().includes(query.toLowerCase());
        const matchesName = device.name.toLowerCase().includes(query.toLowerCase());
        return matchesId || matchesName;
      });
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const selectDevice = (device) => {
    onDeviceSelect(device);
    setSearchQuery(device.id);
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    if (onSearchChange) {
      onSearchChange();
    }
  };

  return (
    <div style={{ marginBottom: '20px', position: 'relative' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
        Поиск по госреестру или названию
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Введите номер госреестра (например: 15820-07)"
          style={{
            width: '100%',
            padding: '12px',
            paddingRight: '40px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '16px',
            transition: 'border-color 0.3s',
            outline: 'none'
          }}
          onFocus={() => searchQuery.length >= 3 && setShowResults(true)}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            style={{
              position: 'absolute',
              right: '40px',
              top: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#999',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        )}
        <Search style={{ position: 'absolute', right: '12px', top: '12px', color: '#999' }} size={20} />
      </div>

      {showResults && searchResults.length > 0 && (
        <div style={{
          position: 'absolute',
          zIndex: 1000,
          width: '100%',
          marginTop: '5px',
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {searchResults.map((device) => (
            <div
              key={device.id}
              onClick={() => selectDevice(device)}
              style={{
                padding: '12px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <div style={{ fontWeight: 500, color: '#333' }}>{device.name}</div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                Госреестр № {device.id}
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && searchResults.length === 0 && searchQuery.length >= 3 && (
        <div style={{
          position: 'absolute',
          zIndex: 1000,
          width: '100%',
          marginTop: '5px',
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          color: '#666'
        }}>
          Прибор с таким номером не найден
        </div>
      )}
    </div>
  );
}

export default DeviceSearch;