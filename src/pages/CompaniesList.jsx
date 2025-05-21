import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CompaniesList.css';

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        setError('⚠️ Failed to fetch companies');
        setLoading(false);
      });
  }, []);

  const handleViewCompany = (id) => {
    navigate(`/company/${id}`);
  };

  if (loading) return <p className="loading-msg">Loading companies...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="companies-container">
      <h1>📊 Companies & Open Positions</h1>
      {companies.length === 0 ? (
        <p>No companies found.</p>
      ) : (
        <table className="companies-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Company Name</th>
              <th>Location</th>
              <th>Platform</th>
              <th>Last Opening</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={company._id}>
                <td>{index + 1}</td>
                <td>{company.companyName || 'N/A'}</td>
                <td>{company.location || 'N/A'}</td>
                <td>{company.platform || 'N/A'}</td>
                <td>{company.lastOpeningDate ? new Date(company.lastOpeningDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button onClick={() => handleViewCompany(company._id)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompaniesList;
