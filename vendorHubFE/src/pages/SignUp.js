import React, { useState } from 'react';

export default function SignUp({ setUser, setPage }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSignUp = (e) => {
    e.preventDefault();
    fetch(backendUrl + '/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    })
    .then(res => res.json())
    .then(data => {
      if(data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setPage('products');
      }
    });
  };

  return (
    <form onSubmit={handleSignUp} className="card" style={{maxWidth: 400, margin: 'auto'}}>
      <h2>Sign Up</h2>
      <div className="form-group"><input placeholder="Name" onChange={e => setName(e.target.value)} /></div>
      <div className="form-group"><input placeholder="Email" type="email" onChange={e => setEmail(e.target.value)} /></div>
      <div className="form-group"><input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} /></div>
      <div className="form-group">
        <label>Role</label>
        <select onChange={e => setRole(e.target.value)} style={{width:'100%', padding:8}}>
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
        </select>
      </div>
      <button className="btn" type="submit">Register</button>
    </form>
  );
}