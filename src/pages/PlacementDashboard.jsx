import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PlacementDashboard.css';
import personIcon from '../assets/q1.png'; // 👤 icon
import briefcaseIcon from '../assets/1.png'; 

const PlacementDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="placement-dashboard">
      <div className="header">Placement</div>

      <div className="button-section">
        <div className="btn-row">
          <button className="main-btn" onClick={() => navigate('/interview-calls')}>
            Interview Calls
          </button>
          <button className="main-btn" onClick={() => navigate('/view-students')}>
            View Students
          </button>
        </div>
        <div className="btn-row center">
          <button className="main-btn" onClick={() => navigate('/view-companies')}>
            View Companies
          </button>
        </div>
      </div>

      <div className="icon-buttons">
        <button className="circle-btn" onClick={() => navigate('/add-company')}>
          <img src={briefcaseIcon} alt="Add Company" />
        </button>
        <button className="circle-btn" onClick={() => navigate('/add-student')}>
          <img src={personIcon} alt="Add Student" />
        </button>
      </div>
    </div>
  );
};

export default PlacementDashboard;
