import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- Import here
import './InterviewCalls.css';

const InterviewCalls = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // <-- Initialize here

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('❌ Authentication token is missing. Please login.');
      setLoading(false);
      return;
    }

    axios.get('http://localhost:5000/api/companies', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setCompanies(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("API error:", err.message);
        setError('⚠️ Failed to fetch interview calls');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading-msg">Loading interview calls...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="interview-calls-container">
      <h1> Interview Calls</h1>
      {companies.length === 0 ? (
        <p>No interview calls found.</p>
      ) : (
        <table className="interview-calls-table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Company Name</th>
              <th>Position</th>
              <th>Date</th>
              <th>No. of Calls</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={company._id}>
                <td>{index + 1}</td>
                <td>{company.companyName || 'N/A'}</td>
                <td>{company.position || 'Software Engineer'}</td>
                <td>{company.lastOpeningDate ? new Date(company.lastOpeningDate).toLocaleDateString() : 'N/A'}</td>
                <td>{company.interviewCalls?.length || 0}</td>
                <td>
                  <button
                    className="view-button"
                    onClick={() => navigate(`/interview-details/${company._id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InterviewCalls;
