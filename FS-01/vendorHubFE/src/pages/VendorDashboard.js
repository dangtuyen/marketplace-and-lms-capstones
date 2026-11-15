import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VendorDashboard = ({ user, setPage }) => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const prodRes = await axios.get(`${backendUrl}/api/products`, { headers });
            const myProducts = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.products || [];
            setProducts(myProducts);

            const myProductIds = new Set(myProducts.map((p) => String(p._id)));

            if (token) {
                const ordRes = await axios.get(`${backendUrl}/api/orders`, { headers });
                const rawOrders = Array.isArray(ordRes.data) ? ordRes.data : ordRes.data.orders || [];

                const vendorOrders = rawOrders
                    .map((order) => {
                        const matchingItems = (order.items || []).filter((item) => {
                            const prodId = String(item.productId?._id || item.productId || '');
                            return user?.role === 'admin' || myProductIds.has(prodId);
                        });

                        if (matchingItems.length === 0) return null;

                        const vendorSubtotal = matchingItems.reduce(
                            (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
                            0
                        );
                        const unitsCount = matchingItems.reduce(
                            (sum, item) => sum + Number(item.quantity || 1),
                            0
                        );

                        return {
                            ...order,
                            matchingItems,
                            vendorSubtotal,
                            unitsCount
                        };
                    })
                    .filter(Boolean);

                setOrders(vendorOrders);
            }
        } catch (err) {
            console.error('Error loading vendor dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, [token]);

    const updateStatus = async (orderId, status) => {
        try {
            await axios.put(
                `${backendUrl}/api/orders/${orderId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchDashboardData();
        } catch (err) {
            console.error('Failed to update order status:', err);
        }
    };

    const downloadInvoicePDF = (orderId) => {
        const currentToken = localStorage.getItem('token');
        window.open(`${backendUrl}/api/orders/${orderId}/invoice?token=${currentToken}`, '_blank');
    };

    const totalRevenue = orders.reduce((sum, ord) => sum + ord.vendorSubtotal, 0);
    const netEarnings = totalRevenue * 0.9; // Doanh thu thực nhận sau khi trừ 10% phí sàn
    const totalUnitsSold = orders.reduce((sum, ord) => sum + ord.unitsCount, 0);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', fontFamily: 'sans-serif' }}>
                <div style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #2563eb', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
            {/* TIÊU ĐỀ & CÁC NÚT THAO TÁC NHANH */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontWeight: '900', fontSize: '26px', margin: 0, color: '#111827' }}>
                        Vendor Store Dashboard
                    </h2>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
                        Welcome back, <strong>{user?.name || 'Vendor'}</strong> — Track store revenue, customer orders &amp; listings
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setPage('add-product')}
                        style={{ padding: '8px 14px', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                    >
                        + Add New Product
                    </button>
                    <button
                        onClick={() => setPage('manage-products')}
                        style={{ padding: '8px 14px', backgroundColor: '#ffffff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                    >
                        Manage Inventory ({products.length})
                    </button>
                </div>
            </div>

            {/* THẺ THỐNG KÊ DOANH THU (GIỐNG TRANG ADMIN) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                <div style={{ flex: '1 1 200px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>
                        Gross Store Sales
                    </span>
                    <h2 style={{ fontSize: '32px', margin: '4px 0 0 0', color: '#2563eb', fontWeight: '900' }}>
                        ${totalRevenue.toFixed(2)}
                    </h2>
                </div>

                <div style={{ flex: '1 1 200px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>
                        Net Payout (90%)
                    </span>
                    <h2 style={{ fontSize: '32px', margin: '4px 0 0 0', color: '#16a34a', fontWeight: '900' }}>
                        ${netEarnings.toFixed(2)}
                    </h2>
                </div>

                <div style={{ flex: '1 1 200px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>
                        Store Order Volume
                    </span>
                    <h2 style={{ fontSize: '32px', margin: '4px 0 0 0', color: '#111827', fontWeight: '900' }}>
                        {orders.length} orders <span style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>({totalUnitsSold} units)</span>
                    </h2>
                </div>
            </div>

            {/* BẢNG QUẢN LÝ ĐƠN HÀNG CỦA KHÁCH MUA */}
            <h3 style={{ fontWeight: '800', marginBottom: '16px', color: '#111827' }}>
                Customer Orders &amp; Fulfillment
            </h3>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '32px' }}>
                {orders.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                        No customer purchases recorded yet for your products.
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f9fafb', fontSize: '12px', textTransform: 'uppercase', color: '#4b5563' }}>
                            <tr>
                                <th style={{ padding: '12px' }}>Order ID</th>
                                <th style={{ padding: '12px' }}>Buyer</th>
                                <th style={{ padding: '12px' }}>Items Purchased</th>
                                <th style={{ padding: '12px' }}>Vendor Total</th>
                                <th style={{ padding: '12px' }}>Status</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '14px', color: '#374151' }}>
                            {orders.map((order) => (
                                <tr key={order._id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#2563eb' }}>
                                        {order._id}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                                                                {order.customerId?.name || order.customerId?.email || 'User'}
                                    </td>
                                    <td style={{ padding: '12px', fontSize: '13px' }}>
                                        {order.matchingItems.map((it, i) => (
                                            <div key={i}>
                                                {it.name} <strong>x{it.quantity}</strong>
                                            </div>
                                        ))}
                                    </td>
                                    <td style={{ padding: '12px', fontWeight: '700' }}>
                                        ${order.vendorSubtotal.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <span
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                backgroundColor: order.status === 'delivered' ? '#dcfce7' : '#ffedd5',
                                                color: order.status === 'delivered' ? '#15803d' : '#c2410c'
                                            }}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => updateStatus(order._id, 'packed')}
                                            disabled={order.status !== 'placed'}
                                            style={{ padding: '6px', fontSize: '12px', cursor: order.status === 'placed' ? 'pointer' : 'not-allowed' }}
                                        >
                                            Pack
                                        </button>
                                        <button
                                            onClick={() => updateStatus(order._id, 'shipped')}
                                            disabled={order.status !== 'packed'}
                                            style={{ padding: '6px', fontSize: '12px', cursor: order.status === 'packed' ? 'pointer' : 'not-allowed' }}
                                        >
                                            Ship
                                        </button>
                                        <button
                                            onClick={() => updateStatus(order._id, 'delivered')}
                                            disabled={order.status !== 'shipped'}
                                            style={{ padding: '6px', fontSize: '12px', cursor: order.status === 'shipped' ? 'pointer' : 'not-allowed' }}
                                        >
                                            Deliver
                                        </button>
                                        <button
                                            onClick={() => downloadInvoicePDF(order._id)}
                                            style={{ padding: '6px 10px', fontSize: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            📄 Print Invoice
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* BẢNG DANH SÁCH SẢN PHẨM CỦA CỬA HÀNG */}
            <h3 style={{ fontWeight: '800', marginBottom: '16px', color: '#111827' }}>
                Storefront Active Listings
            </h3>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                {products.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                        You haven&apos;t listed any products yet.
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f9fafb', fontSize: '12px', textTransform: 'uppercase', color: '#4b5563' }}>
                            <tr>
                                <th style={{ padding: '12px' }}>Product Name</th>
                                <th style={{ padding: '12px' }}>Description</th>
                                <th style={{ padding: '12px' }}>Unit Price</th>
                                <th style={{ padding: '12px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '14px', color: '#374151' }}>
                            {products.map((prod) => (
                                <tr key={prod._id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px', fontWeight: '700', color: '#111827' }}>{prod.name}</td>
                                    <td style={{ padding: '12px', color: '#6b7280' }}>{prod.description || '—'}</td>
                                    <td style={{ padding: '12px', fontWeight: '700', color: '#2563eb' }}>${Number(prod.price).toFixed(2)}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', backgroundColor: '#dcfce7', color: '#15803d' }}>
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default VendorDashboard;

