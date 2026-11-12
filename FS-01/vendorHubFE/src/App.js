import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import AddProduct from './pages/AddProduct';
import ManageProducts from './pages/ManageProducts';
import ProductDetail from './pages/ProductDetail';
import { Grid, ShoppingBag, ShieldAlert } from 'lucide-react';

function App() {
  const [page, setPage] = useState('products');
  const [user, setUser] = useState(() => {
  try {
    const savedUser = localStorage.getItem('user');
    if (!savedUser || savedUser === 'undefined' || savedUser === 'null') {
      return null;
    }
    return JSON.parse(savedUser);
  } catch (err) {
    localStorage.removeItem('user');
    return null;
  }
});
  const [selectedProductId, setSelectedProductId] = useState(null);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionLoginTime');
    setUser(null);
    setPage('products');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('sessionLoginTime');
    
    if (token && loginTime) {
      const currentTime = Date.now();
      const twoHoursInMilliseconds = 2 * 60 * 60 * 1000; // 2 Hours

      if (currentTime - parseInt(loginTime, 10) > twoHoursInMilliseconds) {
        console.warn("Session expired due to inactivity. Logging out automatically...");
        logout();
      }
    } else if (token && !loginTime) {
      localStorage.setItem('sessionLoginTime', Date.now().toString());
    }
  }, [page]);

  return (
    <div style={{ backgroundColor: '#ecf2f8', minHeight: '100vh', fontFamily: 'sans-serif', width: '100%' }}>
      <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 40px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
        <h2 style={{ margin: 0, fontWeight: '900', color: '#2563eb', cursor: 'pointer', fontSize: '24px', letterSpacing: '-0.025em' }} onClick={() => setPage('products')}>NexMall</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => setPage('products')} 
            style={{ cursor: 'pointer', padding: '10px', border: 'none', backgroundColor: page === 'products' ? '#eff6ff' : 'transparent', color: page === 'products' ? '#2563eb' : '#4b5563', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            title="View products list"
          >
            <Grid size={22} style={{ strokeWidth: page === 'products' ? '2.5' : '2' }} />
          </button>

          <button 
            onClick={() => setPage('cart')} 
            style={{ cursor: 'pointer', padding: '10px', border: 'none', backgroundColor: page === 'cart' ? '#eff6ff' : 'transparent', color: page === 'cart' ? '#2563eb' : '#4b5563', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            title="View shopping cart"
          >
            <ShoppingBag size={22} style={{ strokeWidth: page === 'cart' ? '2.5' : '2' }} />
          </button>
          
          <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 8px' }}></div>

          {(user?.role === 'vendor' || user?.role === 'admin') && (
            <>
              <button className="btn" onClick={() => setPage('add-product')} style={{ cursor: 'pointer', padding: '8px 14px', border: 'none', backgroundColor: page === 'add-product' ? '#16a34a' : '#f0fdf4', color: page === 'add-product' ? '#ffffff' : '#16a34a', borderRadius: '8px', fontSize: '13px', fontWeight: '700', transition: 'all 0.2s' }}>
                + Add Product
              </button>
              <button className="btn" onClick={() => setPage('manage-products')} style={{ cursor: 'pointer', padding: '8px 14px', border: '1px solid #d1d5db', backgroundColor: page === 'manage-products' ? '#f3f4f6' : '#fff', color: '#374151', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                Manage Product
              </button>
            </>
          )}

          {user?.role === 'admin' && (
            <button 
              onClick={() => setPage('admin')} 
              style={{ cursor: 'pointer', padding: '10px', border: 'none', backgroundColor: page === 'admin' ? '#fef2f2' : 'transparent', color: page === 'admin' ? '#dc2626' : '#4b5563', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Admin dashboard system"
            >
              <ShieldAlert size={22} />
            </button>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Hi, {user.name} <span style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase' }}>({user.role})</span></span>
              <button onClick={logout} style={{ cursor: 'pointer', padding: '8px 14px', border: 'none', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
              <button className="btn" onClick={() => setPage('login')} style={{ cursor: 'pointer', padding: '8px 14px', border: '1px solid #d1d5db', backgroundColor: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>Login</button>
              <button className="btn" onClick={() => setPage('signup')} style={{ cursor: 'pointer', padding: '8px 14px', border: 'none', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}>Sign Up</button>
            </div>
          )}
        </div>
      </nav>

      <div className="container" style={{ width: '100%', maxWidth: '100%', padding: '24px 40px', boxSizing: 'border-box' }}>
        {page === 'products' && (
          <Products 
            user={user} 
            setSelectedProductId={setSelectedProductId} 
            setPage={setPage} 
          />
        )}
        {page === 'cart' && <Cart user={user} />}
        {page === 'login' && <Login setUser={(usr) => { setUser(usr); localStorage.setItem('sessionLoginTime', Date.now().toString()); }} setPage={setPage} />}
        {page === 'signup' && <SignUp setUser={(usr) => { setUser(usr); localStorage.setItem('sessionLoginTime', Date.now().toString()); }} setPage={setPage} />}
        {page === 'admin' && <Admin />}
        {page === 'add-product' && <AddProduct />}
        {page === 'manage-products' && <ManageProducts />}
        {page === 'product-detail' && (
          <ProductDetail productId={selectedProductId} setPage={setPage} />
        )}
      </div>
    </div>
  );
}

export default App;