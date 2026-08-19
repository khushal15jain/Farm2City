import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Download, Printer, DollarSign, ShoppingBag, BarChart2 } from 'lucide-react';

const Reports = () => {
  const { token, user } = useAuth();
  const [reportData, setReportData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      if (!user) return;
      try {
        setLoading(true);
        let url = '/api/dashboard/farmer';
        if (user.role === 'customer') url = '/api/dashboard/customer';
        if (user.role === 'admin') url = '/api/dashboard/admin';

        const dashRes = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        const dashData = await dashRes.json();

        const orderRes = await fetch('/api/orders', { headers: { 'Authorization': `Bearer ${token}` } });
        const orderData = await orderRes.json();

        if (dashData.success && orderData.success) {
          setReportData(dashData.data);
          setOrders(orderData.data);
        }
      } catch (err) {
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token && user) {
      fetchReport();
    }
  }, [token, user]);

  const exportToCSV = (headers, rows, filename) => {
    const csvRows = [headers.join(',')];
    for (const row of rows) {
      const values = row.map(val => `"${('' + val).replace(/"/g, '\\"')}"`);
      csvRows.push(values.join(','));
    }
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    if (user?.role === 'farmer' && reportData?.productSales) {
      const headers = ['Crop Produce Name', 'Available Stock (kg)', 'Units Sold (kg)', 'Earnings (INR)'];
      const rows = reportData.productSales.map(p => [p.name, p.stock, p.sold, p.earnings]);
      exportToCSV(headers, rows, 'farmer_earnings_statement');
    } else if (user?.role === 'customer') {
      const headers = ['Order ID', 'Date', 'Crops Count', 'Payment Method', 'Status', 'Total (INR)'];
      const rows = orders.map(o => [o._id.toUpperCase(), new Date(o.createdAt).toLocaleDateString('en-IN'), o.items.length, o.paymentMethod, o.deliveryStatus, o.totalAmount]);
      exportToCSV(headers, rows, 'customer_purchase_ledger');
    } else if (user?.role === 'admin' && reportData?.stats) {
      const headers = ['Metric Indicator', 'Value'];
      const rows = [
        ['Total Sourced Users', reportData.stats.totalUsers],
        ['Registered Farmers', reportData.stats.totalFarmers],
        ['Urban Customers', reportData.stats.totalCustomers],
        ['Gross Sales Turnover', `₹${reportData.stats.totalSales}`],
        ['Platform Commission Revenue (10%)', `₹${reportData.stats.platformRevenue}`]
      ];
      exportToCSV(headers, rows, 'admin_marketplace_master_kpi');
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '40px 0 80px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <span className="badge badge-organic" style={{ marginBottom: '10px' }}>Financial Statements</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
            Marketplace Reports & Audits
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleExport} disabled={loading} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export to CSV
          </button>
          <button onClick={() => window.print()} disabled={loading} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={16} /> Print Ledger (PDF)
          </button>
        </div>
      </div>

      {loading ? (
        <p>Generating analytical report statements...</p>
      ) : (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
            📊 Statement for {user?.name} ({user?.role.toUpperCase()})
          </h3>

          {user?.role === 'farmer' && reportData?.productSales && (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>CROP PRODUCE</th>
                  <th style={{ padding: '10px' }}>STOCK QTY</th>
                  <th style={{ padding: '10px' }}>UNITS DISPATCHED</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>GROSS EARNINGS</th>
                </tr>
              </thead>
              <tbody>
                {reportData.productSales.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{p.name}</td>
                    <td style={{ padding: '10px' }}>{p.stock} kg</td>
                    <td style={{ padding: '10px' }}>{p.sold} sold</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: 'var(--success)' }}>₹{p.earnings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {user?.role === 'customer' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>ORDER ID</th>
                  <th style={{ padding: '10px' }}>DATE</th>
                  <th style={{ padding: '10px' }}>ITEMS PROCURED</th>
                  <th style={{ padding: '10px' }}>PAYMENT METHOD</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>TOTAL PAID</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px', fontFamily: 'monospace', fontWeight: 'bold' }}>#{o._id.substring(o._id.length - 8).toUpperCase()}</td>
                    <td style={{ padding: '10px' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '10px' }}>{o.items.length} crops</td>
                    <td style={{ padding: '10px' }}>{o.paymentMethod}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: 'var(--primary)' }}>₹{o.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
