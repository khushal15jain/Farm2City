import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Leaf, ShoppingCart, User as UserIcon, LogOut, Sun, Moon, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isActive = (path) => location.pathname === path;

  const renderRoleLinks = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'farmer':
        return (
          <>
            <Link to="/farmer-dashboard" className={`nav-link ${isActive('/farmer-dashboard') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Farmer Panel</Link>
            <Link to="/community" className={`nav-link ${isActive('/community') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Community Forum</Link>
            <Link to="/reports" className={`nav-link ${isActive('/reports') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Earnings Report</Link>
          </>
        );
      case 'customer':
        return (
          <>
            <Link to="/customer-dashboard" className={`nav-link ${isActive('/customer-dashboard') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Shop Produce</Link>
            <Link to="/community" className={`nav-link ${isActive('/community') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Agri Forum</Link>
            <Link to="/delivery-tracking" className={`nav-link ${isActive('/delivery-tracking') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Track Orders</Link>
          </>
        );
      case 'admin':
        return (
          <>
            <Link to="/admin-dashboard" className={`nav-link ${isActive('/admin-dashboard') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Admin Panel</Link>
            <Link to="/community" className={`nav-link ${isActive('/community') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Manage Bulletins</Link>
            <Link to="/reports" className={`nav-link ${isActive('/reports') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Global Analytics</Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="glass-card" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-color)',
      borderRadius: 0,
      padding: '14px 0',
      transition: 'var(--transition)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* LOGO */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: 'var(--primary)', padding: '8px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center' }}>
            <Leaf size={22} />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>
            FARM<span style={{ color: 'var(--accent-dark)' }}>2</span>CITY
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }} className="desktop-menu">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          {renderRoleLinks()}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', borderLeft: '1px solid var(--border-color)', paddingLeft: '18px' }}>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Toggle Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {(!user || user.role === 'customer') && (
              <Link to="/cart" style={{ position: 'relative', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-10px',
                    backgroundColor: 'var(--accent-dark)',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
                  <span className="badge badge-organic" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>{user.role}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.8rem' }} title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <UserIcon size={16} />
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'none' }}
          className="mobile-toggle"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="glass-card fade-in" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          borderRadius: 0,
          zIndex: 99
        }}>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
          {renderRoleLinks()}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Dark Mode</span>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
          {user ? (
            <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
              <LogOut size={16} /> Log Out
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsOpen(false)}>
              <UserIcon size={16} /> Sign In
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
