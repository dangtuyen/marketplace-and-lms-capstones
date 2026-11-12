import React, { useState } from 'react';
import axios from 'axios';
import { XCircle, LogIn, Lock, Mail } from 'lucide-react';

const Login = ({ setUser, setPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        message: ''
    });

    const triggerCustomAlert = (title, message) => {
        setAlertConfig({ isOpen: true, title, message });
    };

    const closeCustomAlert = () => {
        setAlertConfig({ ...alertConfig, isOpen: false });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            triggerCustomAlert('Missing Information', 'Please fill out both email and password input fields completely.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.post(backendUrl + '/api/auth/login', { 
                email: email.trim(), 
                password 
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('sessionLoginTime', Date.now().toString());

            setUser(res.data.user);
            setPage('products');
        } catch (err) {
            console.error("Authentication error:", err);
            
            const errorMessage = err.response?.data?.message || 'The email address or secure password credential not correct';
            triggerCustomAlert('Authentication Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '100%', padding: '40px 0', fontFamily: 'sans-serif', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)' }}>
            
            <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)', boxSizing: 'border-box' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid #f3f4f6', paddingBottom: '14px' }}>
                    <div style={{ padding: '8px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '10px', display: 'flex' }}><LogIn size={20} /></div>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#111827', margin: 0 }}>Account Login</h2>
                        <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0 0 0', textTransform: 'uppercase', fontWeight: 'bold' }}>Access your Nexmall dashboard</p>
                    </div>
                </div>

                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}><Mail size={12} style={{ marginRight: '2px' }}/> Email Address</label>
                        <input type="email" placeholder="e.g., user@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#f9fafb' }} required />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}><Lock size={12} style={{ marginRight: '2px' }}/> Secure Password</label>
                        <input type="password" placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#f9fafb' }} required />
                    </div>

                    <button type="submit" disabled={isLoading} style={{ width: '100%', border: 'none', backgroundColor: isLoading ? '#9ca3af' : '#2563eb', color: '#ffffff', fontWeight: '700', padding: '12px', borderRadius: '8px', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '14px', marginTop: '8px', boxShadow: '0 2px 4px rgba(37,99,235,0.15)' }}>
                        {isLoading ? "Authenticating Token..." : "Sign In"}
                    </button>
                </form>

                <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginTop: '20px', marginBot: 0, marginBottom: 0 }}>
                    New member? <span onClick={() => setPage('signup')} style={{ color: '#2563eb', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>Create an account</span>
                </p>
            </div>

            {alertConfig.isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(17,24,39,0.4)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', maxWidth: '360px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #f3f4f6', animation: 'scaleUp 0.15s ease-out' }}>
                        
                        <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <XCircle size={32} />
                        </div>
                        
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '0 0 6px 0' }}>{alertConfig.title}</h3>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px 0', lineHeight: '1.4' }}>{alertConfig.message}</p>
                        
                        <button 
                            onClick={closeCustomAlert} 
                            style={{ width: '100%', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', fontWeight: '700', padding: '11px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', transition: 'background-color 0.15s' }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                        >
                            Dismiss
                        </button>
                    </div>
                    <style>{`
                        @keyframes scaleUp {
                            0% { transform: scale(0.95); opacity: 0; }
                            100% { transform: scale(1); opacity: 1; }
                        }
                    `}</style>
                </div>
            )}

        </div>
    );
};

export default Login;
