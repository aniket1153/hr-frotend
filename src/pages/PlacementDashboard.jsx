import React from 'react';
import './PlacementDashboard.css';
import { useNavigate } from 'react-router-dom';

const PlacementDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="placement-container">
      <h2 className="placement-heading">Placement Dashboard</h2>

      <div className="placement-grid">
        <button className="placement-btn" onClick={() => navigate('/add-company')}>
          Add Company
        </button>
        <button className="placement-btn" onClick={() => navigate('/add-student')}>
          Add Student
        </button>
        <button className="placement-btn" onClick={() => navigate('/interview-calls')}>
          Interview Calls
        </button>
        <button className="placement-btn" onClick={() => navigate('/view-students')}>
          View Students
        </button>
        <button className="placement-btn" onClick={() => navigate('/view-companies')}>
          View Companies
        </button>
        <button className="placement-btn" onClick={() => navigate('/placed-students')}>
          Placed Students
        </button>
      </div>
    </div>
  );
};

export default PlacementDashboard;
