import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CompanyDetails.css';

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchApplied, setSearchApplied] = useState('');
  const [searchShortlisted, setSearchShortlisted] = useState('');
  const [searchPlaced, setSearchPlaced] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const companyRes = await axiosInstance.get(`/api/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompany(companyRes.data);

      const studentRes = await axiosInstance.get('/api/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(studentRes.data);
    } catch (err) {
      setError('❌ Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (studentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.put(
        `/api/students/${studentId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchData();
      toast.success('Status updated successfully!');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleSubmitReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const reportData = {
        companyId: company._id,
        appliedCount: appliedStudents.length,
        shortlistedCount: shortlistedStudents.length,
        placedCount: placedStudents.length,
        resumesSent: resumesSentCount,
      };

      await axiosInstance.post('/api/reports', reportData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Report submitted!');
      setTimeout(() => navigate('/report'), 1500);
    } catch (err) {
      toast.error('Report submission failed.');
    }
  };

  const handleMoveToShortlisted = async () => {
    const filtered = appliedStudents.filter((s) =>
      s.name?.toLowerCase().includes(searchApplied.toLowerCase())
    );
    for (const student of filtered) {
      await updateStatus(student._id, 'shortlisted');
    }
  };

  const handleMoveToPlaced = async () => {
    const filtered = shortlistedStudents.filter((s) =>
      s.name?.toLowerCase().includes(searchShortlisted.toLowerCase())
    );
    for (const student of filtered) {
      await updateStatus(student._id, 'placed');
    }
  };

  if (loading) return <div className="spinner">Loading company details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!company) return <p>No company data available.</p>;

  const {
    companyName,
    hrName,
    email,
    contact,
    location,
    platform,
    lastOpeningDate,
    requirements,
    history
  } = company;

  const appliedStudents = students.filter(
    (s) => s.appliedCompany === companyName && s.status?.toLowerCase() === 'applied'
  );
  const shortlistedStudents = students.filter(
    (s) => s.appliedCompany === companyName && s.status?.toLowerCase() === 'shortlisted'
  );
  const placedStudents = students.filter(
    (s) => s.appliedCompany === companyName && s.status?.toLowerCase() === 'placed'
  );

  const resumesSentCount = students.filter((s) => s.appliedCompany === companyName).length;

  const formatDate = (date) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
  };

  return (
    <div className="company-details-card">
      <ToastContainer />
      <h2 className="company-title">{companyName || 'Company Name'}</h2>

      {/* HR Info & History */}
      <div className="company-details-header">
        <div className="company-info">
          <p><strong>HR Name</strong> : {hrName}</p>
          <p><strong>Mail ID</strong> : {email}</p>
          <p><strong>Contact</strong> : {contact}</p>
          <p><strong>Location</strong> : {location}</p>
          <p><strong>Platform</strong> : {platform}</p>
          <p><strong>Last Opening Date</strong> : {formatDate(lastOpeningDate)}</p>
        </div>

        <div className="company-history">
          <h4>History</h4>
          <table>
            <thead>
              <tr>
                <th>Opening For</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history && history.length > 0 ? (
                history.map((item, i) => (
                  <tr key={i}>
                    <td>{item.position}</td>
                    <td>{formatDate(item.date)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No history available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Boxes */}
      <div className="summary-boxes">
        <div className="box">
          <h2>{requirements || '00'}</h2>
          <span>Requirements</span>
        </div>
        <div className="box">
          <h2>{resumesSentCount || '00'}</h2>
          <span>Resumes Sent</span>
        </div>
      </div>

      {/* Students Section */}
      <div className="student-status-row">
        {/* Applied */}
        <div className="student-list-card">
          <h4>Applied Students</h4>
          <input
            type="text"
            placeholder="Search"
            value={searchApplied}
            onChange={(e) => setSearchApplied(e.target.value)}
          />
          <table>
            <thead>
              <tr>
                <th>SrNo</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {appliedStudents
                .filter((s) => s.name?.toLowerCase().includes(searchApplied.toLowerCase()))
                .map((student, i) => (
                  <tr key={student._id}>
                    <td>{i + 1}</td>
                    <td>{student.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button className="move-btn" onClick={handleMoveToShortlisted}>
            Move to Shortlisted
          </button>
        </div>

        {/* Shortlisted */}
        <div className="student-list-card">
          <h4>Shortlisted Students</h4>
          <input
            type="text"
            placeholder="Search"
            value={searchShortlisted}
            onChange={(e) => setSearchShortlisted(e.target.value)}
          />
          <table>
            <thead>
              <tr>
                <th>SrNo</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {shortlistedStudents
                .filter((s) => s.name?.toLowerCase().includes(searchShortlisted.toLowerCase()))
                .map((student, i) => (
                  <tr key={student._id}>
                    <td>{i + 1}</td>
                    <td>{student.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button className="move-btn" onClick={handleMoveToPlaced}>
            Move to Placed
          </button>
        </div>

        {/* Placed */}
        <div className="student-list-card">
          <h4>Placed Students</h4>
          <input
            type="text"
            placeholder="Search"
            value={searchPlaced}
            onChange={(e) => setSearchPlaced(e.target.value)}
          />
          <table>
            <thead>
              <tr>
                <th>SrNo</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {placedStudents
                .filter((s) => s.name?.toLowerCase().includes(searchPlaced.toLowerCase()))
                .map((student, i) => (
                  <tr key={student._id}>
                    <td>{i + 1}</td>
                    <td>{student.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="update-btn-wrap">
        <button onClick={handleSubmitReport} className="update-btn">
          Update Report
        </button>
      </div>
    </div>
  );
};

export default CompanyDetails;
