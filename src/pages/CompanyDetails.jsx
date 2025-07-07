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

  const [selectedApplied, setSelectedApplied] = useState([]);
  const [selectedShortlisted, setSelectedShortlisted] = useState([]);

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
    } catch (err) {
      toast.error(`Failed to update status for student ID: ${studentId}`);
    }
  };

  const handleSubmitToApplied = async () => {
    for (const id of selectedApplied) {
      await updateStatus(id, 'applied');
    }
    toast.success('Students moved to Applied!');
    setSelectedApplied([]);
    fetchData();
  };

  const handleSubmitToShortlisted = async () => {
    for (const id of selectedApplied) {
      await updateStatus(id, 'shortlisted');
    }
    toast.success('Students moved to Shortlisted!');
    setSelectedApplied([]);
    fetchData();
  };

  const handleSubmitToPlaced = async () => {
    for (const id of selectedShortlisted) {
      await updateStatus(id, 'placed');
    }
    toast.success('Students moved to Placed!');
    setSelectedShortlisted([]);
    fetchData();
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

  const toggleSelection = (id, listType) => {
    if (listType === 'applied') {
      setSelectedApplied((prev) =>
        prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
      );
    } else if (listType === 'shortlisted') {
      setSelectedShortlisted((prev) =>
        prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
      );
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

      <div className="company-info-history-wrapper">
        <div className="company-info">
          <p><strong>HR Name</strong>: {hrName}</p>
          <p><strong>Mail ID</strong>: {email}</p>
          <p><strong>Contact</strong>: {contact}</p>
          <p><strong>Location</strong>: {location}</p>
          <p><strong>Platform</strong>: {platform}</p>
          <p><strong>Last Opening Date</strong>: {formatDate(lastOpeningDate)}</p>
        </div>

        <div className="job-history">
          <h4>Job History</h4>
          <table>
            <thead>
              <tr className="tblw">
                <th>Position</th>
                <th>Opening Date</th>
              </tr>
            </thead>
            <tbody>
              {company?.positions?.length > 0 ? (
                company.positions.map((job, index) => (
                  <tr key={index}>
                    <td>{job.positionName}</td>
                    <td>{formatDate(job.openingDate)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="2">No history available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="summary-boxes">
        <div className="box"><h2>{requirements || '00'}</h2><span>Requirements</span></div>
        <div className="box"><h2>{resumesSentCount || '00'}</h2><span>Resumes Sent</span></div>
      </div>

      <div className="student-status-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {/* All Students */}
        {/* All Students */}
<div className="student-list-card" style={{ flex: '1 1 300px' }}>
  <h4>All Students</h4>
  <input
    type="text"
    placeholder="Search"
    value={searchApplied}
    onChange={(e) => setSearchApplied(e.target.value)}
  />
  <table>
    <thead>
      <tr><th>✔</th><th>SrNo</th><th>Name</th><th>Status</th></tr>
    </thead>
    <tbody>
      {students
        .filter((s) => s.name?.toLowerCase().includes(searchApplied.toLowerCase()))
        .map((student, i) => (
          <tr key={student._id}>
            <td>
              <input
                type="checkbox"
                checked={selectedApplied.includes(student._id)}
                onChange={() => toggleSelection(student._id, 'applied')}
              />
            </td>
            <td>{i + 1}</td>
            <td>{student.name}</td>
            <td>{student.status}</td>
          </tr>
        ))}
    </tbody>
  </table>
  <button className="submit-report-btn" onClick={handleSubmitToApplied}>Submit to Applied</button>
</div>


        {/* Applied Students */}
        <div className="student-list-card" style={{ flex: '1 1 300px' }}>
          <h4>Applied Students</h4>
          <input
            type="text"
            placeholder="Search"
            value={searchApplied}
            onChange={(e) => setSearchApplied(e.target.value)}
          />
          <table>
            <thead><tr><th>✔</th><th>SrNo</th><th>Name</th></tr></thead>
            <tbody>
              {appliedStudents
                .filter((s) => s.name?.toLowerCase().includes(searchApplied.toLowerCase()))
                .map((student, i) => (
                  <tr key={student._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedApplied.includes(student._id)}
                        onChange={() => toggleSelection(student._id, 'applied')}
                      />
                    </td>
                    <td>{i + 1}</td>
                    <td>{student.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button className="submit-report-btn" onClick={handleSubmitToShortlisted}>Submit to Shortlisted</button>
        </div>

        {/* Shortlisted Students */}
        <div className="student-list-card" style={{ flex: '1 1 300px' }}>
          <h4>Shortlisted Students</h4>
          <input
            type="text"
            placeholder="Search"
            value={searchShortlisted}
            onChange={(e) => setSearchShortlisted(e.target.value)}
          />
          <table>
            <thead><tr><th>✔</th><th>SrNo</th><th>Name</th></tr></thead>
            <tbody>
              {shortlistedStudents
                .filter((s) => s.name?.toLowerCase().includes(searchShortlisted.toLowerCase()))
                .map((student, i) => (
                  <tr key={student._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedShortlisted.includes(student._id)}
                        onChange={() => toggleSelection(student._id, 'shortlisted')}
                      />
                    </td>
                    <td>{i + 1}</td>
                    <td>{student.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button className="submit-report-btn" onClick={handleSubmitToPlaced}>Submit to Placed</button>
        </div>

        {/* Placed Students */}
        <div className="student-list-card" style={{ flex: '1 1 300px' }}>
          <h4>Placed Students</h4>
          <input
            type="text"
            placeholder="Search"
            value={searchPlaced}
            onChange={(e) => setSearchPlaced(e.target.value)}
          />
          <table>
            <thead><tr><th>SrNo</th><th>Name</th></tr></thead>
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

      <button className="submit-report-btn report-final-btn" onClick={handleSubmitReport}>
        Submit Report
      </button>
    </div>
  );
};

export default CompanyDetails;
