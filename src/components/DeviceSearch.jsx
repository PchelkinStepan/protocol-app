import React, { useState } from 'react';
import { Search } from 'lucide-react';
import devicesData from '../data/devices';

// Функция для транслитерации кириллицы в латиницу (простая версия)
function transliterate(text) {
  const map = {
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E',
    'Ж': 'ZH', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'H', 'Ц': 'TS', 'Ч': 'CH', 'Ш': 'SH', 'Щ': 'SCH',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'YU', 'Я': 'YA',
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  return text.split('').map(char => map[char] || char).join('');
}

// Функция для сбора всех названий моделей прибора
function getAllModelNames(device) {
  const names = new Set(); // используем Set для уникальности
  
  // Если есть модели
  if (device.models) {
    Object.entries(device.models).forEach(([key, model]) => {
      // Добавляем ключ модели (например, "mtkin", "mtwf")
      names.add(key);
      
      // Добавляем displayName и name
      if (model.displayName) names.add(model.displayName);
      if (model.name) names.add(model.name);
      
      // Транслитерируем русские названия
      if (model.displayName) names.add(transliterate(model.displayName));
      if (model.name) names.add(transliterate(model.name));
      
      // Если у модели есть типы
      if (model.types) {
        Object.entries(model.types).forEach(([typeKey, type]) => {
          names.add(typeKey);
          if (type.displayName) names.add(type.displayName);
          if (type.name) names.add(type.name);
          if (type.displayName) names.add(transliterate(type.displayName));
        });
      }
    });
  }
  
  // Если есть типы напрямую
  if (device.types) {
    Object.entries(device.types).forEach(([key, type]) => {
      names.add(key);
      if (type.displayName) names.add(type.displayName);
      if (type.name) names.add(type.name);
      if (type.displayName) names.add(transliterate(type.displayName));
    });
  }
  
  return Array.from(names);
}

function DeviceSearch({ onDeviceSelect, onSearchChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (onSearchChange) {
      onSearchChange();
    }
    
    if (query.length >= 2) {
      const searchLower = query.toLowerCase();
      const devicesArray = Object.values(devicesData);
      const results = devicesArray.filter(device => {
        // Поиск по ID
        const matchesId = device.id.toLowerCase().includes(searchLower);
        
        // Поиск по названию прибора
        const matchesName = device.name.toLowerCase().includes(searchLower);
        
        // Поиск по названиям моделей
        const modelNames = getAllModelNames(device);
        const matchesModel = modelNames.some(name => 
          name.toLowerCase().includes(searchLower)
        );
        
        return matchesId || matchesName || matchesModel;
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

  const allDevices = Object.values(devicesData);

  const buttonStyle = {
    padding: '8px 0',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 500,
    color: '#007bff',
    flex: '1 1 calc(16.666% - 12px)',
    minWidth: '100px'
  };

  const buttonHoverStyle = {
    borderColor: '#007bff',
    backgroundColor: '#f0f7ff',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
          Поиск по госреестру или названию
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Введите номер госреестра или название прибора/модели (например: WTC, MTK, ВСКМ90)"
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
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
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

        {showResults && searchResults.length === 0 && searchQuery.length >= 2 && (
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
            Прибор с таким названием не найден
          </div>
        )}
      </div>

      {allDevices.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 500, fontSize: '13px', color: '#888' }}>
            Быстрый выбор:
          </label>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '12px',
            justifyContent: 'flex-start'
          }}>
            {allDevices.map((device) => (
              <button
                key={device.id}
                onClick={() => selectDevice(device)}
                style={buttonStyle}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, buttonHoverStyle);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {device.id}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DeviceSearch;