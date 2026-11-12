import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Save, X, Layers, Image, Upload, ChevronLeft, ChevronRight } from 'lucide-react';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editFile, setEditFile] = useState(null);
    const [isUpdating, setIsLoading] = useState(false);
    const token = localStorage.getItem('token');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => { if (token) loadItems(); }, [token]);

    const loadItems = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
        } catch (err) {
            console.error("Failed loading vendor-specific stock entries:", err);
        }
    };

    const commitUpdate = async (id) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', editName);
        formData.append('price', editPrice);
        formData.append('description', editDescription);
        if (editFile) {
            formData.append('image', editFile);
        }

        try {
            await axios.put(backendUrl + `/api/products/${id}`, formData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setEditingId(null);
            setEditFile(null);
            loadItems();
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        } finally {
            setIsLoading(false);
        }
    };

    const commitPurge = async (id) => {
        if (!window.confirm("Purge permanently?")) return;
        await axios.delete(backendUrl + `/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        loadItems();
    };

    const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', padding: '16px 40px', fontFamily: 'sans-serif', backgroundColor: '#f9fafb', height: 'calc(100vh - 90px)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', width: '100%' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexShrink: 0, borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
                    <div style={{ padding: '8px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '10px', display: 'flex' }}><Layers size={18} /></div>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#111827', margin: 0 }}>Vendor product Manager</h2>
                        <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0 0 0' }}>Manage specifications, detailed descriptions, and physical product images</p>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e5e7eb', textAlign: 'center', color: '#6b7280', fontSize: '14px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        No product records linked to your account profile.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'hidden', width: '100%', paddingBottom: '4px' }}>
                        {currentProducts.map(p => {
                            const isCurrentEditing = editingId === p._id;
                            return (
                                <div key={p._id} style={{ padding: '14px 20px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.01)', boxSizing: 'border-box', width: '100%', maxHeight: '120px' }}>
                                    
                                    {!isCurrentEditing ? (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '50px', height: '56px', backgroundColor: '#f3f4f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #e5e7eb', flexShrink: 0 }}>
                                                    {p.image && !p.image.includes('broken') ? (
                                                        <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                             onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'block'; }} />
                                                    ) : null}
                                                    <div style={{ display: p.image ? 'none' : 'block' }}>
                                                        <img src={`https://dicebear.com{encodeURIComponent(p.name)}`} alt="" style={{ width: '32px', height: '36px' }} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: '800', color: '#111827' }}>{p.name}</h4>
                                                    <div style={{ color: '#2563eb', fontWeight: '800', fontSize: '14px', marginBottom: '2px' }}>${p.price}</div>
                                                    <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{p.description || 'No description listed.'}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => { setEditingId(p._id); setEditName(p.name); setEditPrice(p.price); setEditDescription(p.description || ''); setEditFile(null); }} style={{ cursor: 'pointer', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '8px', backgroundColor: '#fff', fontSize: '12px', fontWeight: '600' }}><Pencil size={12}/> Edit</button>
                                                <button onClick={() => commitPurge(p._id)} style={{ cursor: 'pointer', border: 'none', padding: '6px 12px', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '12px', fontWeight: '600' }}><Trash2 size={12}/></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}>
                                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                                                
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                                    <div style={{ width: '40px', height: '40px', backgroundColor: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                        {editFile ? <img src={URL.createObjectURL(editFile)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Image size={14} color="#9ca3af" />}
                                                    </div>
                                                    <label style={{ cursor: 'pointer', padding: '4px 8px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '11px', fontWeight: '700', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                        <Upload size={10} /> Change Image
                                                        <input type="file" accept="image/*" onChange={(e) => { if(e.target.files && e.target.files) setEditFile(e.target.files[0]); }} style={{ display: 'none' }} />
                                                    </label>
                                                </div>

                                                <div style={{ flex: 1, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                                    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#4b5563' }}>Product Title</label>
                                                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', outline: 'none' }} placeholder="Product Title..." />
                                                    </div>
                                                    
                                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#4b5563' }}>Price ($)</label>
                                                        <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', outline: 'none' }} placeholder="Price ($)..." />
                                                    </div>
                                                    
                                                    <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#4b5563' }}>Product description</label>
                                                        <input type="text" value={editDescription} onChange={e => setEditDescription(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', outline: 'none' }} placeholder="Product specifications logs..." />
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginTop: '16px' }}>
                                                    <button onClick={() => { setEditingId(null); setEditFile(null); }} style={{ border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#4b5563', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><X size={12}/> Cancel</button>
                                                    <button onClick={() => commitUpdate(p._id)} disabled={isUpdating} style={{ border: 'none', backgroundColor: '#16a34a', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
                                                        {isUpdating ? "Saving..." : "Save"}
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    )}

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', borderTop: '1px solid #e5e7eb', padding: '12px 0 0 0', marginTop: '8px', flexShrink: 0, width: '100%' }}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #d1d5db', backgroundColor: currentPage === 1 ? '#e5e7eb' : '#ffffff', color: currentPage === 1 ? '#9ca3af' : '#374151', padding: '6px 12px', borderRadius: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: '600' }}><ChevronLeft size={12} /> Prev</button>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#4b5563' }}>Page <span style={{ color: '#2563eb' }}>{currentPage}</span> of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #d1d5db', backgroundColor: currentPage === totalPages ? '#e5e7eb' : '#ffffff', color: currentPage === totalPages ? '#9ca3af' : '#374151', padding: '6px 12px', borderRadius: '8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: '600' }}>Next <ChevronRight size={12} /></button>
            </div>
        </div>
    );
};

export default ManageProducts;