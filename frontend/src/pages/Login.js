import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', message: '' });

    try {
      const res = await loginUser(formData);
      localStorage.setItem('token', res.data.token);
      setStatusMsg({ type: 'success', message: '✅ Logged in successfully!' });
      setTimeout(() => navigate('/tasks'), 1200);
    } catch (err) {
      setStatusMsg({
        type: 'error',
        message: err.response?.data?.msg || '❌ Login failed. Please check your credentials.',
      });
    }

    setLoading(false);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-3">Login</h3>

        {statusMsg.message && (
          <div className={`alert ${statusMsg.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {statusMsg.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-3">
          Don't have an account?{' '}
          <a href="/register" className="text-decoration-none">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
