import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, CheckCircle, XCircle, Grid, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';

const Products = (props) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; 
    
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sort, setSort] = useState('');

    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    });

    const token = localStorage.getItem('token');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search.trim()) params.search = search;
            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;
            if (sort) params.sort = sort;

            const res = await axios.get(backendUrl + '/api/products', { params });
            setProducts(res.data);
            setCurrentPage(1);
        } catch (err) {
            console.error('Error fetching marketplace inventory arrays:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [sort]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const triggerAlert = (type, title, message) => {
        setAlertConfig({ isOpen: true, type, title, message });
    };

    const closeAlert = () => {
        setAlertConfig({ ...alertConfig, isOpen: false });
    };

    const addToCart = async (productId) => {
        if (!token) {
            triggerAlert('error', 'Authentication Required', 'You must log in to an active account before purchasing catalog items.');
            return;
        }

        try {
            await axios.post(backendUrl + '/api/cart', 
                { productId, quantity: 1 }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            triggerAlert('success', 'Item Added!', 'This product has been added to shopping cart.');
        } catch (err) {
            console.error('Redis synchronous push exception caught:', err);
            triggerAlert('error', 'Process Execution Failure', err.response?.data?.message || 'We could not cache this item state parameter registry row.');
        }
    };

    const navigateToDetail = (productId) => {
        if (typeof props.setSelectedProductId === 'function' && typeof props.setPage === 'function') {
            props.setSelectedProductId(productId);
            props.setPage('product-detail');
        } else {
            console.warn("Required page routing validation parameters missing on App state layers wrapper.");
        }
    };

    const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', fontFamily: 'sans-serif' }}>
                <div style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #2563eb', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '16px', fontFamily: 'sans-serif', backgroundColor: '#eaf2fa', minHeight: 'calc(100vh - 90px)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexShrink: 0 }}>
                    <div style={{ padding: '10px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
                        <Grid size={20} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#111827', margin: 0 }}>Marketplace Catalog Showcase</h1>
                        <p style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', margin: '2px 0 0 0', letterSpacing: '0.05em' }}>Explore authentic vendor inventory</p>
                    </div>
                </div>

                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', backgroundColor: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid #e5e7eb', marginBottom: '20px', alignItems: 'center' }}>
                    <div style={{ flex: '1 1 250px', position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input 
                            type="text" 
                            placeholder="Search names or descriptions..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ width: '110px' }}>
                        <input 
                            type="number" 
                            placeholder="Min Price" 
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ width: '110px' }}>
                        <input 
                            type="number" 
                            placeholder="Max Price" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ width: '160px' }}>
                        <select 
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
                        >
                            <option value="">Latest Items</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>

                    <button 
                        type="submit"
                        style={{ border: 'none', backgroundColor: '#2563eb', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <SlidersHorizontal size={14} /> Filter
                    </button>
                </form>

                {products.length === 0 ? (
                    <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e5e7eb', textAlign: 'center', color: '#6b7280', fontSize: '14px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                        No listings found matching search parameters.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', flex: 1, alignItems: 'flex-start' }}>
                        {currentProducts.map((product) => (
                            <div key={product._id} style={{ flex: '1 1 calc(25% - 16px)', minWidth: '220px', maxWidth: '400px', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box', height: '330px' }}>
                                
                                <div onClick={() => navigateToDetail(product._id)} style={{ width: '100%', height: '65%', backgroundColor: '#f3f4f6', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, cursor: 'pointer', padding: '8px', boxSizing: 'border-box' }}>
                                    {product.image && !product.image.includes('broken') ? (
                                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                    ) : null}
                                    <div style={{ display: product.image ? 'none' : 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#9ca3af', fontFamily: 'monospace', fontSize: '11px' }}>
                                        <span>150 x 150</span>
                                    </div>
                                </div>

                                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box', overflow: 'hidden' }}>
                                    <div style={{ marginBottom: '4px' }}>
                                        <h3 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '800', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.name}>
                                            {product.name}
                                        </h3>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {product.description || 'No descriptive features log supplied by owner.'}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f9fafb', paddingTop: '4px', marginTop: 'auto' }}>
                                        <span style={{ fontSize: '16px', fontWeight: '900', color: '#2563eb' }}>${product.price}</span>
                                        <button 
                                            onClick={() => addToCart(product._id)}
                                            style={{ border: 'none', backgroundColor: '#2563eb', color: '#ffffff', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            <ShoppingCart size={12} /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {products.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', borderTop: '1px solid #e5e7eb', padding: '12px 0 0 0', marginTop: '16px', flexShrink: 0 }}>
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #d1d5db', backgroundColor: currentPage === 1 ? '#e5e7eb' : '#ffffff', color: currentPage === 1 ? '#9ca3af' : '#374151', padding: '6px 12px', borderRadius: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: '600' }}
                    >
                        <ChevronLeft size={14} /> Prev
                    </button>
                    
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#4b5563' }}>
                        Page <span style={{ color: '#2563eb' }}>{currentPage}</span> of {totalPages}
                    </span>

                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #d1d5db', backgroundColor: currentPage === totalPages ? '#e5e7eb' : '#ffffff', color: currentPage === totalPages ? '#9ca3af' : '#374151', padding: '6px 12px', borderRadius: '8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: '600' }}
                    >
                        Next <ChevronRight size={14} />
                    </button>
                </div>
            )}

            {/* Alerts Modal System */}
            {alertConfig.isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', maxWidth: '350px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        {alertConfig.type === 'success' ? (
                            <div style={{ color: '#22c55e', backgroundColor: '#f0fdf4', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><CheckCircle size={28} /></div>
                        ) : (
                            <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><XCircle size={28} /></div>
                        )}
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: '0 0 6px 0' }}>{alertConfig.title}</h3>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 16px 0', lineHeight: '1.4' }}>{alertConfig.message}</p>
                        <button onClick={closeAlert} style={{ width: '100%', border: 'none', backgroundColor: alertConfig.type === 'success' ? '#22c55e' : '#ef4444', color: '#ffffff', fontWeight: '700', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Dismiss</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;