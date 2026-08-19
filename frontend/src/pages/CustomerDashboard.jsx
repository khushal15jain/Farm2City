import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Clock, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Farmer Star Rating Modal state
  const [ratingModal, setRatingModal] = useState(false);
  const [selectedFarmerName, setSelectedFarmerName] = useState('');
  const [starCount, setStarCount] = useState(5);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const dashRes = await fetch('/api/dashboard/customer', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dashData = await dashRes.json();
        if (dashData.success) {
          setStats(dashData.data.stats);
        }

        const orderRes = await fetch('/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const orderData = await orderRes.json();
        if (orderData.success) {
          setOrders(orderData.data);
        }
      } catch (err) {
        console.error('Error fetching customer data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token && user) {
      fetchCustomerData();
    }
  }, [token, user]);

  const handleOpenRating = (farmerName) => {
    setSelectedFarmerName(farmerName || 'Rural Farmer');
    setRatingModal(true);
  };

  const handleSubmitRating = (e) => {
    e.preventDefault();
    alert(`Thank you! Your ${starCount}-star review for ${selectedFarmerName} has been recorded.`);
    setRatingModal(false);
    setFeedback('');
  };

  return (
    <div className="container fade-in" style={{ padding: '40px 0 80px 0' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <span className="badge badge-organic" style={{ marginBottom: '10px' }}>Customer Portal</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
            Welcome, {user?.name || 'Customer'}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Track direct farm orders, rate rural growers, and review your urban purchases ledger.
          </p>
        </div>

        <Link to="/" className="btn btn-primary" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Shop Produce Catalog <ArrowRight size={16} />
        </Link>
      </div>

      {/* STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '12px', borderRadius: '50%' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Orders</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{stats?.totalOrders || 0}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent-dark)', padding: '12px', borderRadius: '50%' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Active Deliveries</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.activeOrders || 0}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: 'var(--success-glow)', color: 'var(--success)', padding: '12px', borderRadius: '50%' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Amount Spent</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>₹{stats?.totalSpent || 0}</h3>
          </div>
        </div>
      </div>

      {/* ORDER HISTORY TABLE */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700 }}>
            🛍️ Direct Purchase Ledger ({orders.length})
          </h3>
          <Link to="/delivery-tracking" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
            Open Live SVG Delivery Tracker ➔
          </Link>
        </div>

        {loading ? (
          <p>Loading purchase records...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '15px', display: 'inline-flex' }}>Explore Produce</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 6px' }}>ORDER ID</th>
                  <th style={{ padding: '10px 6px' }}>DATE</th>
                  <th style={{ padding: '10px 6px' }}>ITEMS PROCURED</th>
                  <th style={{ padding: '10px 6px' }}>LOGISTICS STATUS</th>
                  <th style={{ padding: '10px 6px' }}>TOTAL PAID</th>
                  <th style={{ padding: '10px 6px', textAlign: 'right' }}>REVIEW FARMER</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 6px', fontFamily: 'monospace', fontWeight: 'bold' }}>#{o._id.substring(o._id.length - 8).toUpperCase()}</td>
                    <td style={{ padding: '12px 6px' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '12px 6px' }}>
                      <strong>{o.items.length} crops</strong> ({o.items.map(i => i.productName).join(', ')})
                    </td>
                    <td style={{ padding: '12px 6px' }}>
                      <span className={`badge ${o.deliveryStatus === 'Delivered' ? 'badge-success' : 'badge-organic'}`}>
                        {o.deliveryStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px 6px', color: 'var(--primary)', fontWeight: 'bold' }}>₹{o.totalAmount}</td>
                    <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleOpenRating(o.items[0]?.farmerName)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Star size={13} style={{ color: '#f39c12' }} /> Rate Grower
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RATING MODAL */}
      {ratingModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '10px' }}>Rate Farmer: {selectedFarmerName}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>Help urban buyers identify reliable organic farmers.</p>

            <form onSubmit={handleSubmitRating} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={28} 
                    onClick={() => setStarCount(star)} 
                    style={{ cursor: 'pointer', color: star <= starCount ? '#f39c12' : 'var(--border-color)', fill: star <= starCount ? '#f39c12' : 'none' }} 
                  />
                ))}
              </div>
              <textarea placeholder="Write feedback on freshness & packaging..." value={feedback} onChange={(e) => setFeedback(e.target.value)} style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none', rows: 3 }} />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setRatingModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
