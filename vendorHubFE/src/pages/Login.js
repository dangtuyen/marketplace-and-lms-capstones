import React, { useState } from 'react';

export default function Login({ setUser, setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      if(data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setPage('products');
      } else {
        alert(data.message);
      }
    });
  };

  return (
    <form onSubmit={handleLogin} className="card" style={{maxWidth: 400, margin: 'auto'}}>
      <h2>Login</h2>
      <div className="form-group"><input placeholder="Email" type="email" onChange={e => setEmail(e.target.value)} /></div>
      <div className="form-group"><input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} /></div>
      <button className="btn" type="submit">Login</button>
    </form>
  );
}
