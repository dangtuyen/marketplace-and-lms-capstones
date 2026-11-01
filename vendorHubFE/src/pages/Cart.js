import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../components/StripePaymentForm';
import { ShoppingBag, Trash2, Plus, Minus, MapPin, CreditCard, Ticket } from 'lucide-react';

const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(publishableKey);

const Cart = () => {
    const [cart, setCart] = useState({ items: [], totalPrice: 0 });
    const [shippingAddress, setShippingAddress] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [stripeClientSecret, setStripeClientSecret] = useState('');
    const token = localStorage.getItem('token');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    // Coupons Integration States
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponStatusMsg, setCouponStatusMsg] = useState('');

    useEffect(() => { if (token) fetchCart(); }, [token]);

    const fetchCart = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/cart', { headers: { Authorization: `Bearer ${token}` } });
            setCart(res.data);
        } catch (err) { console.error(err); }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (!token) return;
        try {
            const res = await axios.post(backendUrl + '/api/cart', 
                { productId, quantity: newQuantity }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data && res.data.cart) {
                setCart(res.data.cart);
            } else if (res.data) {
                setCart(res.data);
            }
        } catch (err) { 
            console.error('Error modifying quantity parameters:', err); 
        }
    };

    const finalCalculatedTotalPrice = Math.max(0, cart.totalPrice - couponDiscount);

    const handleInitializePayment = async (e) => {
        e.preventDefault();
        if (!shippingAddress.trim()) return alert('Shipping address is required.');

        setIsLoading(true);
        setMessage('');
        try {
            const res = await axios.post(backendUrl + '/api/orders/checkout', 
                { shippingAddress, finalPrice: finalCalculatedTotalPrice }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStripeClientSecret(res.data.clientSecret);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to initialize payment.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessfulPaymentFlow = () => {
        setMessage('Secure multi-vendor split payment authorized successfully!');
        setStripeClientSecret('');
        setShippingAddress('');
        setCouponCode('');
        setCouponDiscount(0);
        setCouponStatusMsg('');
        setCart({ items: [], totalPrice: 0 });
    };

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        if (!couponCode.trim()) return;
        try {
            const res = await axios.post(backendUrl + '/api/coupons/validate', 
                { code: couponCode }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCouponDiscount(res.data.discountValue);
            setCouponStatusMsg(`Discount applied successfully: -$${res.data.discountValue}`);
        } catch (err) {
            setCouponDiscount(0);
            setCouponStatusMsg(`❌ ${err.response?.data?.message || 'Invalid coupon code'}`);
        }
    };

    if (!token) return <p style={{ textAlign: 'center', padding: '40px', fontFamily: 'sans-serif' }}>Please log in to view your cart.</p>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px', fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <div style={{ padding: '12px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
                    <ShoppingBag size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#111827', margin: 0 }}>Shopping cart</h1>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', margin: '4px 0 0 0' }}>List product ready to payment</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>
                <div style={{ flex: '1 1 650px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', boxSizing: 'border-box' }}>
                    <h3 style={{ fontWeight: '800', fontSize: '18px', marginBottom: '20px', color: '#1f2937', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px' }}>Your Items Details</h3>
                    
                    {cart.items.length === 0 ? (
                        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Your cart is empty.</p>
                    ) : (
                        cart.items.map((item) => (
                            <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f3f4f6', flexWrap: 'wrap', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '56px', height: '56px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : <ShoppingBag size={20} style={{ color: '#d1d5db' }} />}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '800', color: '#111827' }}>
                                            {item.name || "Premium Marketplace Product"}
                                        </h4>
                                        <p style={{ margin: 0, color: '#2563eb', fontWeight: '700', fontSize: '14px' }}>${item.price} x {item.quantity}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '2px', backgroundColor: '#ffffff' }}>
                                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                                        <span style={{ width: '32px', textAlign: 'center', fontWeight: '700', fontSize: '14px' }}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                                    </div>
                                    <button 
                                        onClick={() => updateQuantity(item.productId, 0)}
                                        style={{ border: 'none', background: 'none', padding: '6px', color: '#9ca3af', cursor: 'pointer' }}
                                        title="Remove item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div style={{ flex: '1 1 320px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 16px 0', color: '#1f2937' }}><CreditCard size={18} /> Checkout Summary</h3>
                    
                    <div style={{ borderBottom: '1px dashed #e5e7eb', paddingBottom: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4b5563' }}>
                            <span>Basket Subtotal:</span>
                            <span style={{ fontWeight: '600' }}>${cart.totalPrice}</span>
                        </div>
                        {couponDiscount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#dc2626', fontWeight: '600' }}>
                                <span>Coupon Discount:</span>
                                <span>-${couponDiscount}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                            <span style={{ fontSize: '14px', color: '#111827', fontWeight: '700' }}>Total Net Due:</span>
                            <h2 style={{ fontSize: '28px', margin: 0, color: '#2563eb', fontWeight: '900' }}>${finalCalculatedTotalPrice}</h2>
                        </div>
                    </div>

                    {message && <p style={{ color: '#166534', backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '8px', fontSize: '14px', margin: '0 0 16px 0', lineHeight: '1.4' }}>{message}</p>}

                    {!stripeClientSecret && cart.items.length > 0 && (
                        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px dashed #e5e7eb' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#4b5563', marginBottom: '6px', textTransform: 'uppercase' }}>
                                <Ticket size={12} /> Claim Promo Voucher
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input 
                                    type="text" 
                                    placeholder="e.g., WINTER10" 
                                    value={couponCode} 
                                    onChange={(e) => setCouponCode(e.target.value)} 
                                    style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', outline: 'none' }} 
                                />
                                <button onClick={handleApplyCoupon} style={{ border: 'none', backgroundColor: '#4b5563', color: '#ffffff', fontWeight: '600', padding: '0 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Apply</button>
                            </div>
                            {couponStatusMsg && <p style={{ fontSize: '12px', margin: '6px 0 0 0', fontWeight: '600' }}>{couponStatusMsg}</p>}
                        </div>
                    )}

                    {!stripeClientSecret ? (
                        <form onSubmit={handleInitializePayment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '700', color: '#4b5563' }}><MapPin size={12} /> Target Shipping Address</label>
                            <textarea 
                                rows="2" 
                                placeholder="Enter complete physical delivery coordinates..." 
                                value={shippingAddress} 
                                onChange={(e) => setShippingAddress(e.target.value)}
                                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #d1d5db', padding: '10px', borderRadius: '8px', resize: 'none', fontSize: '14px', outline: 'none' }}
                                required
                            />
                            <button type="submit" disabled={isLoading || cart.items.length === 0} style={{ width: '100%', border: 'none', backgroundColor: cart.items.length === 0 ? '#9ca3af' : '#2563eb', color: '#ffffff', fontWeight: '700', padding: '14px', borderRadius: '8px', cursor: cart.items.length === 0 ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
                                {isLoading ? "Syncing Pipelines..." : "Generate Invoice & Open Stripe Terminal"}
                            </button>
                        </form>
                    ) : (
                        <Elements stripe={stripePromise}>
                            <StripePaymentForm clientSecret={stripeClientSecret} onPaymentSuccess={handleSuccessfulPaymentFlow} />
                        </Elements>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Cart;