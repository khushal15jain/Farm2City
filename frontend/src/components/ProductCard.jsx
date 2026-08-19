import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, CheckCircle, MapPin, Clock } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px', position: 'relative' }}>
      {product.isOrganic && (
        <span className="badge badge-organic" style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 1, boxShadow: 'var(--shadow-sm)' }}>
          🌱 100% Organic
        </span>
      )}

      <div style={{ width: '100%', height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '14px', backgroundColor: 'var(--bg-tertiary)' }}>
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400'} 
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{product.name}</h3>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
          <MapPin size={13} style={{ color: 'var(--primary)' }} />
          <span>{product.farmerName} • {product.villageName || 'Sonapur Farm'}</span>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description || 'Freshly harvested organic produce directly from rural farms.'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{product.price}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> / {product.unit || 'kg'}</span>
          </div>

          <button 
            onClick={() => addToCart(product)}
            disabled={!product.inStock || product.quantity <= 0}
            className="btn btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          >
            <ShoppingBag size={14} />
            {product.inStock && product.quantity > 0 ? 'Add' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
