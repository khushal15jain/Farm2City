import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Leaf, Heart, Globe } from 'lucide-react';

const Footer = () => {
  const { lang, setLang } = useLanguage();

  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '40px 0 20px 0',
      marginTop: 'auto',
      color: 'var(--text-secondary)'
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px', marginBottom: '30px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Leaf style={{ color: 'var(--primary)' }} size={20} />
            <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--primary)' }}>FARM2CITY</strong>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
            Direct agricultural marketplace empowering rural farmers and delivering farm-fresh produce to city tables without middlemen.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '0.95rem' }}>Quick Portals</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <li><a href="/">Fresh Harvest Catalog</a></li>
            <li><a href="/community">Krishi Welfare Schemes</a></li>
            <li><a href="/delivery-tracking">Live Delivery Tracker</a></li>
            <li><a href="/reports">Financial Reports</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '0.95rem' }}>Language Switcher</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Globe size={18} />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', textAlign: 'center', fontSize: '0.8rem' }}>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          Crafted with <Heart size={14} style={{ color: 'var(--danger)' }} /> for Sustainable Rural Agriculture • FARM2CITY © 2026
        </p>
      </div>
    </footer>
  );
};

export default Footer;
