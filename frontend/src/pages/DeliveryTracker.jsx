import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Truck, CheckCircle, Clock, RefreshCw, MapPinned, Phone, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DeliveryTracker = () => {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async (selectLatest = true) => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
        if (result.data.length > 0 && selectLatest) {
          setSelectedOrder(result.data[0]);
        } else if (result.data.length > 0 && selectedOrder) {
          const updated = result.data.find(o => o._id === selectedOrder._id);
          if (updated) setSelectedOrder(updated);
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const advanceMockStatus = async () => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    
    const statuses = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = statuses.indexOf(selectedOrder.deliveryStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];

    try {
      const response = await fetch(`/api/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      
      const result = await response.json();
      if (result.success) {
        setSelectedOrder(result.data);
        setOrders(prev => prev.map(o => o._id === result.data._id ? result.data : o));
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const steps = [
    { key: 'Ordered', title: 'Harvest Ordered', desc: 'Order received by village farm' },
    { key: 'Packed', title: 'Freshly Packed', desc: 'Cleaned and sealed in organic crates' },
    { key: 'Shipped', title: 'Transit to City', desc: 'Truck dispatched via rural highway' },
    { key: 'Out for Delivery', title: 'Local Delivery', desc: 'Mandi agent route drop' },
    { key: 'Delivered', title: 'Delivered', desc: 'Freshness served at your table' }
  ];

  const getStepStatus = (stepKey) => {
    const statuses = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const orderStatusIndex = statuses.indexOf(selectedOrder?.deliveryStatus || 'Ordered');
    const stepIndex = statuses.indexOf(stepKey);

    if (stepIndex < orderStatusIndex) return 'completed';
    if (stepIndex === orderStatusIndex) return 'active';
    return 'pending';
  };

  const getTruckPosition = () => {
    const status = selectedOrder?.deliveryStatus || 'Ordered';
    switch (status) {
      case 'Ordered': return { x: 50, y: 110, progress: 0 };
      case 'Packed': return { x: 140, y: 75, progress: 25 };
      case 'Shipped': return { x: 250, y: 105, progress: 50 };
      case 'Out for Delivery': return { x: 360, y: 85, progress: 75 };
      case 'Delivered': return { x: 450, y: 110, progress: 100 };
      default: return { x: 50, y: 110, progress: 0 };
    }
  };

  const truckPos = getTruckPosition();

  return (
    <div className="container fade-in" style={{ padding: '40px 0 80px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <span className="badge badge-organic" style={{ marginBottom: '10px' }}>Logistics Telemetry</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
            Direct Produce SVG Road Map
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Real-time visual monitoring of harvests moving from rural soil layers to urban kitchen tables.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => fetchOrders(false)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={16} /> Refresh
          </button>
          
          {selectedOrder && (
            <button onClick={advanceMockStatus} disabled={updatingStatus} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Truck size={16} /> Simulate Transit Update
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p>Loading delivery telemetry...</p>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '0 auto' }}>
          <MapPinned size={44} style={{ color: 'var(--text-muted)', marginBottom: '15px' }} />
          <h3>No Active Deliveries</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>Place an order from the produce catalog to track your direct farm delivery.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>Explore Produce</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }} className="grid-responsive">
          {/* ORDERS SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px' }}>Your Orders ({orders.length})</h3>
            {orders.map((o) => {
              const isActive = selectedOrder?._id === o._id;
              return (
                <div 
                  key={o._id}
                  onClick={() => setSelectedOrder(o)}
                  className="card"
                  style={{
                    padding: '16px',
                    cursor: 'pointer',
                    border: isActive ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: isActive ? 'var(--primary-glow)' : 'var(--bg-secondary)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace' }}>#{o._id.substring(o._id.length - 8).toUpperCase()}</span>
                    <span className="badge badge-organic" style={{ fontSize: '0.65rem' }}>{o.deliveryStatus}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{o.items.length} Crop Yields</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', marginTop: '4px' }}>₹{o.totalAmount}</div>
                </div>
              );
            })}
          </div>

          {/* MONITOR PANEL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* SVG ROAD MAP */}
            <div className="card" style={{ padding: '24px', overflow: 'hidden' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
                🛣️ Direct Harvest Highway Telemetry
              </h4>

              <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <svg viewBox="0 0 500 180" width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <path d="M 50 110 Q 140 40 250 110 T 450 110" fill="none" stroke="var(--border-color)" strokeWidth="8" strokeLinecap="round" />
                  <path 
                    d="M 50 110 Q 140 40 250 110 T 450 110" 
                    fill="none" 
                    stroke="var(--primary)" 
                    strokeWidth="5" 
                    strokeLinecap="round"
                    strokeDasharray="500"
                    strokeDashoffset={500 - (500 * truckPos.progress) / 100}
                    style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
                  />
                  <circle cx="50" cy="110" r="6" fill="var(--primary)" />
                  <circle cx="140" cy="75" r="5" fill="var(--primary)" />
                  <circle cx="250" cy="105" r="5" fill="var(--primary)" />
                  <circle cx="360" cy="85" r="5" fill="var(--primary)" />
                  <circle cx="450" cy="110" r="6" fill="var(--accent-dark)" />
                </svg>

                {/* ANIMATED TRUCK */}
                <div style={{
                  position: 'absolute',
                  left: `${truckPos.x}px`,
                  top: `${truckPos.y}px`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'left 1.5s ease-in-out, top 1.5s ease-in-out',
                  zIndex: 2
                }}>
                  {selectedOrder.deliveryStatus === 'Delivered' ? <CheckCircle size={18} /> : <Truck size={18} />}
                </div>

                <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '0.7rem', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
                  Transit Completion: {truckPos.progress}%
                </div>
              </div>
            </div>

            {/* STEPPER TIMELINE */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {steps.map((step, idx) => {
                  const status = getStepStatus(step.key);
                  return (
                    <div key={step.key} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '50%',
                        backgroundColor: status === 'completed' ? 'var(--primary)' : status === 'active' ? 'var(--accent-dark)' : 'var(--border-color)',
                        color: status === 'completed' || status === 'active' ? 'white' : 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem'
                      }}>
                        {status === 'completed' ? <CheckCircle size={14} /> : idx + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: status === 'active' ? 'bold' : '600', fontSize: '0.9rem' }}>{step.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{step.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

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

export default DeliveryTracker;
