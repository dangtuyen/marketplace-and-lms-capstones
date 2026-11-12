import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
    const [analytics, setAnalytics] = useState(null);
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem('token');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        if (token) {
            fetchAnalytics();
            fetchOrders();
        }
    }, [token]);

    const fetchAnalytics = async () => {
        const res = await axios.get(backendUrl + '/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } });
        setAnalytics(res.data);
    };

    const fetchOrders = async () => {
        const res = await axios.get(backendUrl + '/api/orders', { headers: { Authorization: `Bearer ${token}` } });
        setOrders(res.data);
    };

    const updateStatus = async (orderId, status) => {
        await axios.put(backendUrl + `/api/orders/${orderId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
        fetchOrders();
        fetchAnalytics();
    };

    // API call function to automatically open the invoice print tab with Token attached
    const downloadInvoicePDF = (orderId) => {
        const token = localStorage.getItem('token');
        window.open(backendUrl + `/api/orders/${orderId}/invoice?token=${token}`, '_blank');
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
            <h2 style={{ fontWeight: '900', fontSize: '26px', marginBottom: '24px', color: '#111827' }}>Data Marketplace Admin Dashboard</h2>
            
            {/* REVENUE ANALYTICS CARDS */}
            {analytics && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ flex: '1 1 200px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>Total platform revenue</span>
                        <h2 style={{ fontSize: '32px', margin: '4px 0 0 0', color: '#2563eb', fontWeight: '900' }}>${analytics.totalSales}</h2>
                    </div>
                    <div style={{ flex: '1 1 200px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>Retained commission (10%)</span>
                        <h2 style={{ fontSize: '32px', margin: '4px 0 0 0', color: '#16a34a', fontWeight: '900' }}>${analytics.platformCommission}</h2>
                    </div>
                    <div style={{ flex: '1 1 200px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>Total order volume</span>
                        <h2 style={{ fontSize: '32px', margin: '4px 0 0 0', color: '#111827', fontWeight: '900' }}>{analytics.totalOrders} order</h2>
                    </div>
                </div>
            )}

            {/* ORDER MANAGEMENT AND INVOICE EXPORT BOARD */}
            <h3 style={{ fontWeight: '800', marginBottom: '16px' }}>All-Platform Operations Order List</h3>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f9fafb', fontSize: '12px', textTransform: 'uppercase', color: '#4b5563' }}>
                        <tr>
                            <th style={{ padding: '12px' }}>Order ID</th>
                            <th style={{ padding: '12px' }}>Buyer</th>
                            <th style={{ padding: '12px' }}>Total Amount</th>
                            <th style={{ padding: '12px' }}>Status</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: '14px', color: '#374151' }}>
                        {orders.map(order => (
                            <tr key={order._id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#2563eb' }}>{order._id}</td>
                                <td style={{ padding: '12px' }}>{order.customerId?.name || 'User'}</td>
                                <td style={{ padding: '12px', fontWeight: '700' }}>${order.totalPrice}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', backgroundColor: order.status === 'delivered' ? '#dcfce7' : '#ffedd5', color: order.status === 'delivered' ? '#15803d' : '#c2410c' }}>{order.status}</span>
                                </td>
                                <td style={{ padding: '12px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                    <button onClick={() => updateStatus(order._id, 'packed')} disabled={order.status !== 'placed'} style={{ padding: '6px', fontSize: '12px', cursor: 'pointer' }}>Pack</button>
                                    <button onClick={() => updateStatus(order._id, 'shipped')} disabled={order.status !== 'packed'} style={{ padding: '6px', fontSize: '12px', cursor: 'pointer' }}>Ship</button>
                                    <button onClick={() => updateStatus(order._id, 'delivered')} disabled={order.status !== 'shipped'} style={{ padding: '6px', fontSize: '12px', cursor: 'pointer' }}>Deliver</button>
                                    <button onClick={() => downloadInvoicePDF(order._id)} style={{ padding: '6px 10px', fontSize: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>📄 Print Invoice</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin;