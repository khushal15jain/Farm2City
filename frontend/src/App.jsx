import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Home from './pages/Home';
import Login from './pages/Login';
import FarmerDashboard from './pages/FarmerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CartCheckout from './pages/CartCheckout';
import DeliveryTracker from './pages/DeliveryTracker';
import CommunitySupport from './pages/CommunitySupport';
import Reports from './pages/Reports';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--primary)' }}>
        <div className="pulse" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          Authorizing Session...
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'var(--transition)' }}>
                <Navbar />

                <main style={{ flex: 1 }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/customer-dashboard" element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <CustomerDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/farmer-dashboard" element={
                      <ProtectedRoute allowedRoles={['farmer']}>
                        <FarmerDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/admin-dashboard" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />

                    <Route path="/cart" element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <CartCheckout />
                      </ProtectedRoute>
                    } />

                    <Route path="/delivery-tracking" element={
                      <ProtectedRoute allowedRoles={['customer', 'farmer', 'admin']}>
                        <DeliveryTracker />
                      </ProtectedRoute>
                    } />

                    <Route path="/community" element={<CommunitySupport />} />

                    <Route path="/reports" element={
                      <ProtectedRoute allowedRoles={['farmer', 'customer', 'admin']}>
                        <Reports />
                      </ProtectedRoute>
                    } />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                <AIChatbot />
                <Footer />
              </div>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
