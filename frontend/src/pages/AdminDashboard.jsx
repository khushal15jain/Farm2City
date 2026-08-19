import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, DollarSign, Landmark, ShieldAlert, Lock, Unlock, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setAdminData(result.data);
        setUsersList(result.data.users || []);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) {
      fetchAdminDetails();
    }
  }, [token, user]);

  const handleToggleBlock = async (userId) => {
    try {
      const res = await fetch(`/api/auth/user/${userId}/block`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setUsersList(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
      }
    } catch (err) {
      console.error('Error toggling block user:', err);
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '40px 0 80px 0' }}>
      {/* HEADER */}
      <div style={{ marginBottom: '30px' }}>
        <span className="badge badge-organic" style={{ marginBottom: '10px' }}>Platform Administration</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
          Market System Control
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Monitor global marketplace turnovers, platform commission revenue, and govern account permissions.
        </p>
      </div>

      {/* STATS METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '12px', borderRadius: '50%' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Gross Marketplace Turnovers</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>₹{adminData?.stats?.totalSales || 0}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: 'var(--success-glow)', color: 'var(--success)', padding: '12px', borderRadius: '50%' }}>
            <Landmark size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Platform Commission (10%)</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>₹{adminData?.stats?.platformRevenue || 0}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent-dark)', padding: '12px', borderRadius: '50%' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Sourced Users</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{adminData?.stats?.totalUsers || 0} Active</h3>
          </div>
        </div>
      </div>

      {/* USER MANAGEMENT & BLOCK/UNBLOCK DIRECTORY */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
          Registered User Directory & Governance
        </h3>

        {loading ? (
          <p>Loading user directory...</p>
        ) : usersList.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No users found in directory.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 6px' }}>NAME</th>
                  <th style={{ padding: '10px 6px' }}>EMAIL</th>
                  <th style={{ padding: '10px 6px' }}>ROLE</th>
                  <th style={{ padding: '10px 6px' }}>STATUS</th>
                  <th style={{ padding: '10px 6px', textAlign: 'right' }}>GOVERNANCE ACTION</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 6px', fontWeight: 'bold' }}>{u.name}</td>
                    <td style={{ padding: '12px 6px' }}>{u.email}</td>
                    <td style={{ padding: '12px 6px' }}>
                      <span className="badge badge-organic" style={{ textTransform: 'capitalize' }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '12px 6px' }}>
                      {u.isBlocked ? (
                        <span className="badge" style={{ backgroundColor: 'rgba(230,57,70,0.1)', color: 'var(--danger)' }}>Blocked</span>
                      ) : (
                        <span className="badge badge-success">Active</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => handleToggleBlock(u._id)}
                          className={`btn ${u.isBlocked ? 'btn-primary' : 'btn-danger'}`}
                          style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          {u.isBlocked ? <Unlock size={14} /> : <Lock size={14} />}
                          {u.isBlocked ? 'Unblock User' : 'Block User'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
