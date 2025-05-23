import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginPage.css';
import axiosInstance from '../axiosInstance'; // Correct path since file is in src/

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosInstance.post('api/auth/login', {
        username,
        password,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);

      toast.success('Login successful!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: 'colored',
      });

      setTimeout(() => {
        navigate('/admin-home');
      }, 1700);

    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2><u>Login</u></h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
