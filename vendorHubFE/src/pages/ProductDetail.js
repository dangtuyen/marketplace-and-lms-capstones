import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Star, ArrowLeft } from 'lucide-react';

const ProductDetail = ({ productId, setPage }) => {
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (productId) {
            axios.get(`http://localhost:5000/api/products`).then(res => {
                setProduct(res.data.find(p => p._id === productId));
            });
            axios.get(`http://localhost:5000/api/reviews/${productId}`).then(res => setReviews(res.data));
        }
    }, [productId]);

    const handleReview = async (e) => {
        e.preventDefault();
        if (!token) return alert('Please log in.');
        await axios.post('http://localhost:5000/api/reviews', { productId, rating, comment }, { headers: { Authorization: `Bearer ${token}` } });
        setComment('');
        axios.get(`http://localhost:5000/api/reviews/${productId}`).then(res => setReviews(res.data));
    };

    if (!product) return <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>Loading item details...</div>;

    return (
        <div style={{ width: '100%', maxWidth: '100%', padding: '16px 0', fontFamily: 'sans-serif', backgroundColor: '#f9fafb', height: 'calc(100vh - 110px)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <button onClick={() => setPage('products')} style={{ border: 'none', background: 'none', color: '#4b5563', fontWeight: '700', cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><ArrowLeft size={16}/> Back</button>
            
            <div style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'hidden', alignItems: 'stretch' }}>
                <div style={{ flex: '1', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                    <div>
                        <div style={{ width: '100%', height: '220px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', overflow: 'hidden' }}>
                            {product.image && !product.image.includes('broken') ? (
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    onError={(e) => { 
                                        e.target.style.display = 'none'; 
                                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                                    }} 
                                />
                            ) : null}
                            
                            <div style={{ display: product.image ? 'none' : 'block' }}>
                                <img 
                                    src={`https://dicebear.com{encodeURIComponent(product.name)}`} 
                                    alt="" 
                                    style={{ width: '80px', height: '80px' }} 
                                />
                            </div>
                        </div>

                        <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '800', color: '#111827' }}>{product.name}</h3>
                        <div style={{ fontSize: '24px', fontWeight: '900', color: '#2563eb', marginBottom: '12px' }}>${product.price}</div>
                        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>{product.description || 'No description listed.'}</p>
                    </div>
                    <button onClick={async () => { await axios.post('http://localhost:5000/api/cart', { productId, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } }); alert('Added!'); }} style={{ width: '100%', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '700', padding: '14px', borderRadius: '8px', cursor: 'pointer', marginTop: '16px' }}><ShoppingCart size={14}/> Add to Cart</button>
                </div>

                <div style={{ flex: '1.2', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '800' }}>Buyer Feedback ({reviews.length})</h4>
                    <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px', paddingRight: '4px' }}>
                        {reviews.map(r => (
                            <div key={r._id} style={{ padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '8px', fontSize: '13px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: '#374151', marginBottom: '4px' }}>
                                    <span>{r.customerId?.name || 'Buyer'}</span>
                                    <span style={{ color: '#eab308' }}>{'★'.repeat(r.rating)}</span>
                                </div>
                                <p style={{ margin: '2px 0 0 0', fontStyle: 'italic', color: '#6b7280', lineHeight: '1.4' }}>"{r.comment}"</p>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleReview} style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                        <select value={rating} onChange={e => setRating(Number(e.target.value))} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', outline: 'none', backgroundColor: '#f9fafb', cursor: 'pointer' }}>
                            <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                            <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                            <option value="3">⭐⭐⭐ 3 Stars</option>
                            <option value="2">⭐⭐ 2 Stars</option>
                            <option value="1">⭐ 1 Star</option>
                        </select>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <input type="text" placeholder="Write feedback comment..." value={comment} onChange={e => setComment(e.target.value)} style={{ flex: 1, padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', outline: 'none' }} required />
                            <button type="submit" style={{ border: 'none', backgroundColor: '#2563eb', color: '#ffffff', padding: '0 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>Post</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;