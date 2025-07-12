import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './InterviewCalls.css';
import { FaPlus } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const InterviewCalls = () => {
  const [companies, setCompanies] = useState([]);
  const [highlightedCompanyId, setHighlightedCompanyId] = useState('');
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

    axiosInstance.get('/api/companies/recent', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const recentCompanies = res.data.companies;
        if (recentCompanies && recentCompanies.length > 0) {
          setCompanies(recentCompanies);

          const createdId = localStorage.getItem('lastCreatedCompanyId');
          const updatedId = localStorage.getItem('lastUpdatedCompanyId');

          if (createdId || updatedId) {
            setHighlightedCompanyId(createdId || updatedId);
            if (createdId) toast.success("✅ Company added successfully!");
            if (updatedId) toast.success("✅ Company updated successfully!");
          }

          setTimeout(() => {
            localStorage.removeItem('lastCreatedCompanyId');
            localStorage.removeItem('lastUpdatedCompanyId');
            setHighlightedCompanyId('');
          }, 5000);
        } else {
          setCompanies([]);
        }

        setLoading(false);
      })
      .catch(err => {
        console.error("API error:", err.message);
        setError('⚠️ Failed to fetch recent interview calls.');
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (companyId, positionId, newStatus) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token missing. Please login.');
      return;
    }

    axiosInstance.put(`/api/companies/${companyId}/positions/${positionId}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        const updatedCompanies = companies.map(company => {
          if (company._id === companyId) {
            const updatedPositions = company.positions.map(position =>
              position._id === positionId ? { ...position, status: newStatus } : position
            );
            return { ...company, positions: updatedPositions };
          }
          return company;
        });
        setCompanies(updatedCompanies);
        toast.success(`Status updated to '${newStatus}' successfully!`);
      })
      .catch(err => {
        console.error("Status update failed:", err.response?.data || err.message);
        toast.error('Failed to update status.');
      });
  };

  if (loading) return <p className="loading-msg">Loading interview calls...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="interview-calls-container">
      <div className="top-bar">
        <h1>Interview Calls</h1>
        <button className="add-btn" onClick={() => navigate('/create-company')}>
          <FaPlus /> Add Company
        </button>
      </div>

      <ToastContainer />

      {companies.length === 0 ? (
        <p>No interview calls found.</p>
      ) : (
        <div className="table-wrapper">
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
              {companies.map((company, index) => {
                const firstPosition = company.positions?.[0] || null;
                const isHighlighted = company._id === highlightedCompanyId;

                return (
                  <tr
                    key={company._id}
                    style={{
                      backgroundColor: isHighlighted ? '#d1e7dd' : 'transparent',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{company.companyName || 'N/A'}</td>
                    <td>{firstPosition?.title || 'N/A'}</td>
                    <td>{company.lastOpeningDate ? new Date(company.lastOpeningDate).toLocaleDateString() : 'N/A'}</td>
                    <td>{company.interviewCalls?.length || 0}</td>
                    <td>
                      <div className="button-group">
                        <button className="view-button" onClick={() => navigate(`/interview-details/${company._id}`)}>View</button>
                        <button className="update-button" onClick={() => navigate(`/update-company/${company._id}`)}>Update</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InterviewCalls;
