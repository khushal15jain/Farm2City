import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ShieldCheck, CreditCard, QrCode, CheckCircle, ArrowRight } from 'lucide-react';

const CartCheckout = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [address, setAddress] = useState('Flat 402, Green Acre Apartments, Pune');
  const [phone, setPhone] = useState(user?.phone || '+91 98230 67890');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const deliveryCharge = cartTotal > 300 || cartTotal === 0 ? 0 : 40;
  const finalTotal = Math.max(cartTotal + deliveryCharge - discount, 0);

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === 'FARM2CITY' || coupon.toUpperCase() === 'ORGANIC50') {
      setDiscount(50);
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code. Try FARM2CITY for ₹50 off!');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);

    try {
      const items = cart.map(item => ({
        productId: item._id,
        quantity: item.quantity
      }));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items,
          totalAmount: finalTotal,
          deliveryCharge,
          tax: 0,
          discountAmount: discount,
          couponCode: couponApplied ? coupon : '',
          deliveryAddress: address,
          phone,
          paymentMethod
        })
      });

      const result = await response.json();
      if (result.success) {
        setOrderComplete(result.data);
        clearCart();
      } else {
        alert(result.message || 'Checkout failed');
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="container fade-in" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '540px', margin: '0 auto', padding: '40px' }}>
          <div style={{ backgroundColor: 'var(--success-glow)', color: 'var(--success)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <CheckCircle size={40} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--primary)', marginBottom: '10px' }}>Order Placed Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px' }}>
            Order ID: <strong style={{ fontFamily: 'monospace' }}>#{orderComplete._id.toUpperCase()}</strong>
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '30px' }}>
            Your fresh crop yields have been booked directly with the farm. You can track your shipment on the SVG live road map.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/delivery-tracking" className="btn btn-primary">
              Track Order via SVG Map <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '40px 0 80px 0' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '30px' }}>
        🛒 Agricultural Checkout & Review
      </h1>

      {cart.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '0 auto' }}>
          <ShoppingCart size={44} style={{ color: 'var(--text-muted)', marginBottom: '15px' }} />
          <h3>Your cart is empty</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>Browse our organic produce catalogue and add items to proceed.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>Explore Produce</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }} className="grid-responsive">
          
          {/* LEFT: CART ITEMS LIST */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
              Procured Crops ({cart.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item) => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: '54px', height: '54px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>₹{item.price} / {item.unit} • Sold by: {item.farmerName}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ padding: '4px 10px', border: 'none', background: 'var(--bg-tertiary)', cursor: 'pointer' }}>-</button>
                      <span style={{ padding: '4px 10px', fontSize: '0.85rem', fontWeight: 'bold' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ padding: '4px 10px', border: 'none', background: 'var(--bg-tertiary)', cursor: 'pointer' }}>+</button>
                    </div>

                    <span style={{ fontWeight: 'bold', fontSize: '0.95rem', minWidth: '60px', textAlign: 'right' }}>₹{item.price * item.quantity}</span>

                    <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: BILLING & PAYMENT FORM */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
              Billing Summary & Delivery
            </h3>

            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>DELIVERY ADDRESS</label>
                <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>PHONE NUMBER</label>
                <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>

              {/* COUPON */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>APPLY COUPON (PROMO: FARM2CITY)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" placeholder="FARM2CITY" value={coupon} onChange={(e) => setCoupon(e.target.value)} disabled={couponApplied} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }} />
                  <button type="button" onClick={handleApplyCoupon} disabled={couponApplied} className="btn btn-secondary">Apply</button>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>PAYMENT METHOD</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setPaymentMethod('COD')} style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', border: paymentMethod === 'COD' ? '2px solid var(--primary)' : '1px solid var(--border-color)', backgroundColor: paymentMethod === 'COD' ? 'var(--primary-glow)' : 'var(--bg-tertiary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                    Cash on Delivery
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('Razorpay')} style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', border: paymentMethod === 'Razorpay' ? '2px solid var(--primary)' : '1px solid var(--border-color)', backgroundColor: paymentMethod === 'Razorpay' ? 'var(--primary-glow)' : 'var(--bg-tertiary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                    UPI / Razorpay
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('Stripe')} style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', border: paymentMethod === 'Stripe' ? '2px solid var(--primary)' : '1px solid var(--border-color)', backgroundColor: paymentMethod === 'Stripe' ? 'var(--primary-glow)' : 'var(--bg-tertiary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                    Credit Card
                  </button>
                </div>
              </div>

              {/* COST BREAKDOWN */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Produce Subtotal:</span><span>₹{cartTotal}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Delivery Fee:</span><span>{deliveryCharge === 0 ? 'FREE (Over ₹300)' : `₹${deliveryCharge}`}</span></div>
                {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}><span>Coupon Savings:</span><span>-₹{discount}</span></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '4px' }}>
                  <span>Total Payable:</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px' }}>
                {submitting ? 'Processing Order...' : `Confirm & Pay ₹${finalTotal}`}
              </button>
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

export default CartCheckout;
