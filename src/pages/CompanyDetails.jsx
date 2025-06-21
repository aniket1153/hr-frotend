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

  const [showApplied, setShowApplied] = useState(false);
  const [showShortlisted, setShowShortlisted] = useState(false);
  const [showPlaced, setShowPlaced] = useState(false);

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

  const handleCheckboxChange = (studentId, currentStatus) => {
    if (currentStatus === 'applied') {
      updateStatus(studentId, 'shortlisted');
    } else if (currentStatus === 'shortlisted') {
      updateStatus(studentId, 'placed');
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
        resumesSent: students.filter((s) => s.appliedCompany === company.companyName).length,
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

  const formatDate = (date) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
  };

  return (
    <div className="company-details-card">
      <ToastContainer />
      <h2 className="company-title">{companyName || 'Company Name'}</h2>

      <div className="company-info">
        <p><strong>HR Name</strong> : {hrName}</p>
        <p><strong>Mail ID</strong> : {email}</p>
        <p><strong>Contact</strong> : {contact}</p>
        <p><strong>Location</strong> : {location}</p>
        <p><strong>Platform</strong> : {platform}</p>
        <p><strong>Last Opening Date</strong> : {formatDate(lastOpeningDate)}</p>
      </div>

      <div className="dropdowns">
        <button className="dropdown-btn" onClick={() => setShowApplied(!showApplied)}>
          Applied Students ▼
        </button>
        <button className="dropdown-btn" onClick={() => setShowShortlisted(!showShortlisted)}>
          Shortlist Students ▼
        </button>
        <button className="dropdown-btn" onClick={() => setShowPlaced(!showPlaced)}>
          Placed Students ▼
        </button>
      </div>

      {showApplied && (
        <div className="dropdown-section dropdown-content">
          <input
            type="text"
            placeholder="Search Student"
            value={searchApplied}
            onChange={(e) => setSearchApplied(e.target.value)}
          />
          <table>
            <thead>
              <tr>
                <th>✔</th>
                <th>Sr</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {appliedStudents
                .filter((s) => s.name?.toLowerCase().includes(searchApplied.toLowerCase()))
                .map((student, i) => (
                  <tr key={student._id}>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(student._id, 'applied')}
                      />
                    </td>
                    <td>{`0${i + 1}`}</td>
                    <td>{student.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {showShortlisted && (
        <div className="dropdown-section dropdown-content">
          <input
            type="text"
            placeholder="Search Student"
            value={searchShortlisted}
            onChange={(e) => setSearchShortlisted(e.target.value)}
          />
          <table>
            <thead>
              <tr>
                <th>✔</th>
                <th>Sr</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {shortlistedStudents
                .filter((s) => s.name?.toLowerCase().includes(searchShortlisted.toLowerCase()))
                .map((student, i) => (
                  <tr key={student._id}>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(student._id, 'shortlisted')}
                      />
                    </td>
                    <td>{`0${i + 1}`}</td>
                    <td>{student.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {showPlaced && (
        <div className="dropdown-section dropdown-content">
          <input
            type="text"
            placeholder="Search Student"
            value={searchPlaced}
            onChange={(e) => setSearchPlaced(e.target.value)}
          />
          <table>
            <thead>
              <tr>
                <th>Sr</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {placedStudents
                .filter((s) => s.name?.toLowerCase().includes(searchPlaced.toLowerCase()))
                .map((student, i) => (
                  <tr key={student._id}>
                    <td>{`0${i + 1}`}</td>
                    <td>{student.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="update-btn-wrap">
        <button onClick={handleSubmitReport} className="update-btn">
          Update
        </button>
      </div>
    </div>
  );
};

export default CompanyDetails;
