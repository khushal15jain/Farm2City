import React, { useState, useEffect } from 'react';
import { Sun, CloudRain, Wind, Thermometer } from 'lucide-react';

const WeatherWidget = () => {
  const [weather] = useState({
    temp: 28,
    condition: 'Sunny & Clear',
    humidity: '65%',
    windSpeed: '12 km/h',
    cropTip: 'Optimal climate for harvesting Leafy Greens & Tomatoes today!'
  });

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--primary-glow) 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>
          🌤️ Live Agronomic Weather
        </h4>
        <span className="badge badge-organic" style={{ fontSize: '0.65rem' }}>Updated</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
        <Sun size={36} style={{ color: '#f39c12' }} />
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{weather.temp}°C</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{weather.condition}</div>
        </div>
      </div>

      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', gap: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
        <span>💧 Humidity: {weather.humidity}</span>
        <span>💨 Wind: {weather.windSpeed}</span>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginTop: '8px', backgroundColor: 'var(--bg-tertiary)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
        🌱 {weather.cropTip}
      </p>
    </div>
  );
};

export default WeatherWidget;
