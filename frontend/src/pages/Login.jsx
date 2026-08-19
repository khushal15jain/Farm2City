import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, User, Lock, Mail, Phone, MapPin, KeyRound, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, register, forgotPassword, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // login, signup, forgot
  const [role, setRole] = useState('customer');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [villageName, setVillageName] = useState('');
  const [cityName, setCityName] = useState('');
  
  // Forgot password OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const userData = { name, email, password, role, phone, villageName, cityName };
    const result = await register(userData);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!otpSent) {
      const res = await forgotPassword(email);
      setLoading(false);
      if (res.success) {
        setOtpSent(true);
        setMessage(res.message);
      } else {
        setError(res.message);
      }
    } else {
      const res = await verifyOtp(email, otp, newPassword);
      setLoading(false);
      if (res.success) {
        setMessage(res.message);
        setTimeout(() => {
          setMode('login');
          setOtpSent(false);
        }, 1500);
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
        
        {/* LOGO HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ backgroundColor: 'var(--primary)', color: 'white', width: '48px', height: '48px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <Leaf size={24} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--primary)' }}>
            FARM2CITY Portal
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {mode === 'login' && 'Sign in to access your direct marketplace panel'}
            {mode === 'signup' && 'Create your free account as Farmer or Customer'}
            {mode === 'forgot' && 'Reset your account security credentials'}
          </p>
        </div>

        {error && <div style={{ backgroundColor: 'rgba(230, 57, 70, 0.1)', color: 'var(--danger)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ backgroundColor: 'var(--success-glow)', color: 'var(--success)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '16px', textAlign: 'center' }}>{message}</div>}

        {/* MODE TABS */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <button 
            type="button"
            onClick={() => { setMode('login'); setError(''); setMessage(''); }}
            style={{ flex: 1, padding: '10px', border: 'none', background: 'none', fontWeight: mode === 'login' ? 'bold' : 'normal', color: mode === 'login' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: mode === 'login' ? '2px solid var(--primary)' : 'none', cursor: 'pointer' }}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setMode('signup'); setError(''); setMessage(''); }}
            style={{ flex: 1, padding: '10px', border: 'none', background: 'none', fontWeight: mode === 'signup' ? 'bold' : 'normal', color: mode === 'signup' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: mode === 'signup' ? '2px solid var(--primary)' : 'none', cursor: 'pointer' }}
          >
            Sign Up
          </button>
        </div>

        {/* 1. LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>EMAIL ADDRESS</label>
              <input type="email" required placeholder="e.g. customer@city.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>PASSWORD</label>
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '12px' }}>
              {loading ? 'Authenticating...' : 'Sign In to Panel'}
            </button>

            <div style={{ textAlign: 'right', marginTop: '6px' }}>
              <button type="button" onClick={() => { setMode('forgot'); setError(''); setMessage(''); }} style={{ background: 'none', border: 'none', fontSize: '0.78rem', color: 'var(--primary)', cursor: 'pointer' }}>
                Forgot Password?
              </button>
            </div>
          </form>
        )}

        {/* 2. SIGNUP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>SELECT ROLE</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setRole('customer')} style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', border: role === 'customer' ? '2px solid var(--primary)' : '1px solid var(--border-color)', backgroundColor: role === 'customer' ? 'var(--primary-glow)' : 'var(--bg-tertiary)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                  Urban Customer
                </button>
                <button type="button" onClick={() => setRole('farmer')} style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', border: role === 'farmer' ? '2px solid var(--primary)' : '1px solid var(--border-color)', backgroundColor: role === 'farmer' ? 'var(--primary-glow)' : 'var(--bg-tertiary)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                  Rural Farmer
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>FULL NAME</label>
              <input type="text" required placeholder="e.g. Ramu Kaka" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>EMAIL ADDRESS</label>
              <input type="email" required placeholder="e.g. farmer@farm.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>PASSWORD</label>
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>

            {role === 'farmer' && (
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>VILLAGE NAME</label>
                <input type="text" placeholder="e.g. Sonapur Village" value={villageName} onChange={(e) => setVillageName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} />
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '12px' }}>
              {loading ? 'Creating Account...' : `Register as ${role === 'farmer' ? 'Farmer' : 'Customer'}`}
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>REGISTERED EMAIL</label>
              <input type="email" required placeholder="e.g. customer@city.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={otpSent} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>

            {otpSent && (
              <>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>ENTER OTP (USE: 123456)</label>
                  <input type="text" required placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>NEW PASSWORD</label>
                  <input type="password" required placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '12px' }}>
              {loading ? 'Processing...' : otpSent ? 'Update Password' : 'Send OTP Code'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;
