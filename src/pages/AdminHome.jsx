import React from 'react';
import './AdminHome.css';
import { FiBriefcase } from 'react-icons/fi';
import { FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();       // Clear all stored data (token, username, role, etc.)
    navigate('/');         // Redirect to login page
  };

  return (
    <div className="admin-container">
      <h1>Welcome Admin !</h1>
      <div className="admin-options">
        <div className="admin-card" onClick={() => navigate('/placement')}>
          <div className="icon-circle">
            <FiBriefcase size={50} color="white" />
          </div>
          <h3>Placement</h3>
        </div>
        <div className="admin-card" onClick={() => navigate('/recruitment')}>
          <div className="icon-circle">
            <FaUsers size={50} color="white" />
          </div>
          <h3>Recruitment</h3>
        </div>
      </div>

      {/* Logout button */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AdminHome;
