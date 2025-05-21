import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CompanyDetails.css';

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompany = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('❌ Authentication token is missing. Please login.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/companies/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data || !response.data._id) {
          setError('❌ Company data is incomplete or missing.');
        } else {
          setCompany(response.data);
        }
      } catch (err) {
        const status = err.response?.status;
        const msg =
          status === 401
            ? '❌ Unauthorized: Please login again.'
            : status === 403
            ? '🚫 Forbidden: You do not have permission.'
            : status === 404
            ? '🔍 Company not found.'
            : '⚠️ Failed to fetch company details.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) return <div className="spinner">Loading company details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!company) return <p>No company data available.</p>;

  const {
    companyName = 'N/A',
    hrName = 'N/A',
    email = 'N/A',
    contact = 'N/A',
    location = 'N/A',
    platform = 'N/A',
    lastOpeningDate,
    positions = [],
  } = company;

  const formattedDate = (date) => {
    if (!date) return 'N/A';
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? 'N/A' : parsed.toLocaleDateString();
  };

  return (
    <div className="company-details-card">
      <h2 className="company-title">{companyName}</h2>
      <div className="details-layout">
        {/* Left Section */}
        <div className="info-left">
          <h3>Company Info</h3>
          <div className="info-line"><span>HR Name</span>: {hrName}</div>
          <div className="info-line"><span>Email</span>: {email}</div>
          <div className="info-line"><span>Contact</span>: {contact}</div>
          <div className="info-line"><span>Location</span>: {location}</div>
          <div className="info-line"><span>Platform</span>: {platform}</div>
          <div className="info-line">
            <span>Last Opening Date</span>: {formattedDate(lastOpeningDate)}
          </div>
        </div>

        {/* Right Section */}
        <div className="info-right">
          <h3>Company History</h3>
          <table className="history-table">
            <thead>
              <tr>
                <th>Opening For</th>
                <th>Opening Date</th>
                <th>Placed Count</th>
              </tr>
            </thead>
            <tbody>
              {positions.length > 0 ? (
                positions.map((pos) => (
                  <tr key={pos._id || Math.random()}>
                    <td>{pos.positionName || 'N/A'}</td>
                    <td>{formattedDate(pos.openingDate)}</td>
                    <td>{Array.isArray(pos.placed) ? pos.placed.length : 0}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3">No history available.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
