import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './InterviewCalls.css';
import { FaPlus } from 'react-icons/fa';


const InterviewCalls = () => {
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

    axiosInstance.get('/api/companies', {
      headers: { Authorization: `Bearer ${token}` }
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

  const handleStatusChange = (companyId, positionId, newStatus) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token missing. Please login.');
      return;
    }

    console.log("Updating status:", { companyId, positionId, newStatus });

    axiosInstance.put(`/api/companies/${companyId}/positions/${positionId}/status`, 
      { status: newStatus }, 
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
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
        <table className="interview-calls-table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Company Name</th>
              <th>Position</th>
              <th>Date</th>
              <th>No. of Calls</th>
              {/* <th>Current Status Of Company</th>
              <th>Update Status</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => {
              const firstPosition = company.positions && company.positions.length > 0
                ? company.positions[0]
                : null;

              return (
                <tr key={company._id}>
                  <td>{index + 1}</td>
                  <td>{company.companyName || 'N/A'}</td>
                  <td>{firstPosition?.title || 'N/A'}</td>
                  <td>{company.lastOpeningDate ? new Date(company.lastOpeningDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{company.interviewCalls?.length || 0}</td>
                  {/* <td>{firstPosition?.status || 'N/A'}</td>
                  <td>
                    {firstPosition && (
                      <select
                        value={firstPosition.status || 'On-going'}
                        onChange={(e) =>
                          handleStatusChange(company._id, firstPosition._id, e.target.value)
                        }
                        className="status-dropdown"
                      >
                        <option value="On-going">On-going</option>
                        <option value="Closed">Closed</option>
                        <option value="Hold">Hold</option>
                      </select>
                    )}
                  </td> */}
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
      )}
    </div>
  );
};

export default InterviewCalls;
