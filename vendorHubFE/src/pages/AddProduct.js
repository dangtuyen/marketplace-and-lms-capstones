import React, { useState } from 'react';
import axios from 'axios';
import { PackagePlus, DollarSign, FileText, Image, CreditCard } from 'lucide-react';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [stripeConnectId, setStripeConnectId] = useState('acct_1NJxTestAccount');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const token = localStorage.getItem('token');

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!token) return alert('Session expired. Please log in again.');

        setIsLoading(true);
        setMsg('');

        // Initialize FormData
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('stripeConnectId', stripeConnectId);
        if (selectedFile) formData.append('image', selectedFile);

        try {
            const res = await axios.post('http://localhost:5000/api/products', formData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMsg(`🎉 ${res.data.message}`);
            setName(''); setPrice(''); setDescription(''); setSelectedFile(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Upload failed.');
        } finally { setIsLoading(false); }
    };

    return (
        <div style={{ width: '100%', maxWidth: '100%', padding: '16px 0', fontFamily: 'sans-serif', boxSizing: 'border-box', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '550px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #f3f4f6', paddingBottom: '16px' }}>
                    <div style={{ padding: '10px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '10px', display: 'flex' }}><PackagePlus size={22} /></div>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0 }}>List a new product for sale</h2>
                        <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0 0 0', textTransform: 'uppercase', fontWeight: 'bold' }}>Image storage</p>
                    </div>
                </div>

                {msg && <p style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>{msg}</p>}

                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input type="text" placeholder="Product name..." value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px' }} required />
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <input type="number" placeholder="Price ($)..." value={price} onChange={(e) => setPrice(e.target.value)} style={{ flex: 1, padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px' }} required />
                        <input type="text" placeholder="Stripe ID..." value={stripeConnectId} onChange={(e) => setStripeConnectId(e.target.value)} style={{ flex: 1, padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', backgroundColor: '#f9fafb' }} required />
                    </div>
                    <textarea rows="3" placeholder="Description..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', resize: 'none' }} required />
                    
                    <div style={{ border: '1px dashed #d1d5db', padding: '12px', borderRadius: '10px', backgroundColor: '#f9fafb' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}><Image size={13} /> Upload image from device</label>
                        <input type="file" accept="image/*" onChange={(e) => { if(e.target.files?.[0]) setSelectedFile(e.target.files[0]); }} style={{ fontSize: '13px' }} />
                    </div>

                    <button type="submit" disabled={isLoading} style={{ width: '100%', border: 'none', backgroundColor: isLoading ? '#9ca3af' : '#2563eb', color: '#ffffff', fontWeight: '700', padding: '14px', borderRadius: '10px', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '15px' }}>
                        {isLoading ? "Uploading image..." : "Confirm product upload"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;