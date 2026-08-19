import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, TrendingUp, DollarSign, Package, CheckCircle, Sliders } from 'lucide-react';

const FarmerDashboard = () => {
  const { token, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // AI Price Calculator States
  const [selectedCrop, setSelectedCrop] = useState('Spinach');
  const [mandiPrice, setMandiPrice] = useState(20);
  const [transportCost, setTransportCost] = useState(5);
  const [cityMargin, setCityMargin] = useState(15);

  // New Product Modal State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [isOrganic, setIsOrganic] = useState(true);
  const [description, setDescription] = useState('');

  const fetchFarmerData = async () => {
    try {
      setLoading(true);
      const dashRes = await fetch('/api/dashboard/farmer', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dashData = await dashRes.json();
      if (dashData.success) {
        setStats(dashData.data.stats);
      }

      const prodRes = await fetch(`/api/products?farmerId=${user._id}`);
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.data);
      }
    } catch (err) {
      console.error('Error fetching farmer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) {
      fetchFarmerData();
    }
  }, [token, user]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, category, price, quantity, unit, isOrganic, description })
      });
      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        setName('');
        setPrice('');
        setQuantity('');
        fetchFarmerData();
      }
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product listing?')) return;
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setProducts(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const recommendedPrice = Number(mandiPrice) + Number(transportCost) + Number(cityMargin);

  return (
    <div className="container fade-in" style={{ padding: '40px 0 80px 0' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <span className="badge badge-organic" style={{ marginBottom: '10px' }}>Farmer Portal</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
            Welcome, {user?.name || 'Farmer'}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage sown crop listings, check sales profits, and calculate direct city prices.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Crop Produce
        </button>
      </div>

      {/* STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '12px', borderRadius: '50%' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Net Earnings</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>₹{stats?.totalRevenue || 0}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: 'var(--success-glow)', color: 'var(--success)', padding: '12px', borderRadius: '50%' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Delivered Orders</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.completedOrders || 0}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent-dark)', padding: '12px', borderRadius: '50%' }}>
            <Package size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Active Yields</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{products.length} Listed</h3>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }} className="grid-responsive">
        
        {/* LEFT: PRODUCTS LIST TABLE */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
            Your Listed Crops ({products.length})
          </h3>

          {loading ? (
            <p>Loading yields inventory...</p>
          ) : products.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No crops listed yet. Click "Add Crop Produce" to create your first yield listing.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 6px' }}>CROP NAME</th>
                    <th style={{ padding: '10px 6px' }}>CATEGORY</th>
                    <th style={{ padding: '10px 6px' }}>PRICE / UNIT</th>
                    <th style={{ padding: '10px 6px' }}>STOCK QTY</th>
                    <th style={{ padding: '10px 6px', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 6px', fontWeight: 'bold' }}>{p.name}</td>
                      <td style={{ padding: '12px 6px' }}><span className="badge badge-organic">{p.category}</span></td>
                      <td style={{ padding: '12px 6px', color: 'var(--primary)', fontWeight: 'bold' }}>₹{p.price} / {p.unit}</td>
                      <td style={{ padding: '12px 6px' }}>{p.quantity} {p.unit}</td>
                      <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                        <button onClick={() => handleDeleteProduct(p._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }} title="Delete Product">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT: AI PRICE ADVISOR CALCULATOR */}
        <div className="card" style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--primary-glow) 100%)' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} /> AI Price Trend Recommender
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
            Adjust Mandi benchmarks and logistics charges to determine fair city retail rates without middlemen exploitation.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Wholesale Mandi Rate: ₹{mandiPrice}/kg</label>
              <input type="range" min="10" max="200" value={mandiPrice} onChange={(e) => setMandiPrice(e.target.value)} style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Village Transport Fee: ₹{transportCost}/kg</label>
              <input type="range" min="2" max="30" value={transportCost} onChange={(e) => setTransportCost(e.target.value)} style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Desired Farmer Profit Margin: ₹{cityMargin}/kg</label>
              <input type="range" min="5" max="50" value={cityMargin} onChange={(e) => setCityMargin(e.target.value)} style={{ width: '100%' }} />
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '6px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>RECOMMENDED CITY RETAIL PRICE</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>₹{recommendedPrice} / kg</div>
            </div>
          </div>
        </div>

      </div>

      {/* ADD PRODUCT MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '16px' }}>List New Harvest Produce</h3>
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" required placeholder="Crop Produce Name (e.g. Organic Tomatoes)" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }} />
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Dairy">Dairy</option>
                <option value="Grains">Grains</option>
                <option value="Organic Products">Organic Products</option>
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="number" required placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }} />
                <input type="number" required placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }} />
                <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}>
                  <option value="kg">kg</option>
                  <option value="dozen">dozen</option>
                  <option value="liter">liter</option>
                  <option value="bundle">bundle</option>
                </select>
              </div>
              <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none', rows: 3 }} />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Yield</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 850px) {
          .grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default FarmerDashboard;
