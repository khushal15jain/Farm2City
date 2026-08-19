import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import VoiceSearch from '../components/VoiceSearch';
import WeatherWidget from '../components/WeatherWidget';
import { Search, MapPin, Navigation, ShieldCheck, ShoppingBag, Star } from 'lucide-react';

const Home = () => {
  const { t } = useLanguage();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [userCity, setUserCity] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [closestFarmers, setClosestFarmers] = useState([]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const url = `/api/products?search=${searchQuery}&category=${selectedCategory}`;
        const response = await fetch(url);
        const result = await response.json();
        if (result.success) {
          setProducts(result.data);
        }
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [searchQuery, selectedCategory]);

  const detectLocation = () => {
    setDetectingLocation(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      setDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTimeout(() => {
          setUserCity('Pune (Mandi Hub)');
          setDetectingLocation(false);
          setClosestFarmers([
            { name: 'Ramu Kaka (Sonapur Farm)', distance: '12 km', charge: '₹40' },
            { name: 'Sanjay Deshmukh (Maval Green)', distance: '24 km', charge: '₹60' },
            { name: 'Patil Organic Orchard', distance: '35 km', charge: '₹75' }
          ]);
        }, 1000);
      },
      (error) => {
        setUserCity('Pune (Mandi Hub)');
        setClosestFarmers([
          { name: 'Ramu Kaka (Sonapur Farm)', distance: '8 km', charge: '₹30' },
          { name: 'Sanjay Deshmukh (Maval Green)', distance: '15 km', charge: '₹45' }
        ]);
        setDetectingLocation(false);
      }
    );
  };

  const handleVoiceSearch = (text) => {
    setSearchQuery(text);
  };

  const categories = [
    { id: '', name: 'All Produce' },
    { id: 'Vegetables', name: 'Vegetables' },
    { id: 'Fruits', name: 'Fruits' },
    { id: 'Dairy', name: 'Dairy' },
    { id: 'Grains', name: 'Grains' },
    { id: 'Organic Products', name: 'Organic' }
  ];

  return (
    <div className="fade-in" style={{ paddingBottom: '80px' }}>
      
      {/* HERO BANNER */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(27,67,50,0.95) 0%, rgba(45,106,79,0.85) 100%), url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200") center/cover',
        padding: '80px 0 100px 0',
        color: 'white',
        borderBottom: '5px solid var(--accent)',
        position: 'relative'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
          
          <div className="slide-up">
            <span className="badge" style={{ backgroundColor: 'var(--accent)', color: '#1b4332', marginBottom: '20px', padding: '6px 12px', fontWeight: 'bold' }}>
              Direct Farm to Fork
            </span>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              lineHeight: '1.15',
              marginBottom: '20px',
              color: 'white'
            }}>
              {t('heroTitle')}
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#d8f3dc', marginBottom: '30px', lineHeight: '1.6' }}>
              {t('heroSub')}
            </p>

            <div className="glass-card" style={{ padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: 'var(--radius-lg)' }}>
              <Search size={20} style={{ color: 'var(--primary)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <VoiceSearch onSearchComplete={handleVoiceSearch} />
            </div>
          </div>

          <div className="desktop-menu" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card slide-up" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: 'var(--accent)', padding: '10px', borderRadius: '50%', color: '#1b4332' }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem', marginBottom: '6px' }}>Zero Middlemen Commission</h4>
                  <p style={{ fontSize: '0.85rem', color: '#d8f3dc' }}>100% of purchase value directly benefits rural farming families.</p>
                </div>
              </div>
            </div>

            <div className="glass-card slide-up" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: 'var(--success)', padding: '10px', borderRadius: '50%', color: 'white' }}>
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h4 style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem', marginBottom: '6px' }}>Fresh 24-Hour Delivery</h4>
                  <p style={{ fontSize: '0.85rem', color: '#d8f3dc' }}>Crops harvested in village farms after order confirmation.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="container" style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' }} className="grid-responsive">
        
        <div>
          {/* LOCATION MATCHING BAR */}
          <div className="card" style={{
            background: 'linear-gradient(90deg, var(--primary-glow) 0%, var(--bg-secondary) 100%)',
            border: '1px dashed var(--primary-light)',
            padding: '20px',
            marginBottom: '40px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin size={28} style={{ color: 'var(--primary)' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Location Freshness Matching</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {userCity ? `Showing active harvest loops near: ${userCity}` : 'Find closest rural farms near your city.'}
                </p>
              </div>
            </div>

            <button onClick={detectLocation} disabled={detectingLocation} className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
              <Navigation size={14} />
              {detectingLocation ? 'Locating...' : 'Find Nearby Farms'}
            </button>

            {closestFarmers.length > 0 && (
              <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '10px', display: 'flex', gap: '10px', overflowX: 'auto' }}>
                {closestFarmers.map((f, i) => (
                  <div key={i} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>
                    <strong style={{ color: 'var(--primary)' }}>{f.name}</strong> • {f.distance}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CATEGORIES */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '30px' }}>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                style={{
                  backgroundColor: selectedCategory === c.id ? 'var(--primary)' : 'var(--bg-secondary)',
                  color: selectedCategory === c.id ? 'white' : 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  padding: '8px 16px',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)'
                }}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* PRODUCE GRID */}
          {loading ? (
            <p>Loading produce catalog...</p>
          ) : products.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Star size={40} style={{ color: 'var(--text-muted)', marginBottom: '15px' }} />
              <h3>No Produce Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>
                We couldn't find any produce matching "{searchQuery}".
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR WIDGETS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="desktop-menu">
          <WeatherWidget />
        </div>

      </section>

      <style>{`
        @media (max-width: 850px) {
          .grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
