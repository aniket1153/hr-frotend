import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './InterviewDetails.css';

const InterviewDetail = () => {
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
    const fetchCompanyAndStudents = async () => {
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
        console.error(err);
        setError('Failed to load interview details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyAndStudents();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-msg">{error}</p>;
  if (!company) return <p>No company found.</p>;

  const companyName = company.companyName;

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

      await axios.post('http://localhost:5000/api/reports', reportData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Report submitted successfully!');
      setTimeout(() => navigate('/report'), 1500);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit report');
    }
  };

  return (
    <div className="interview-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="header">Interview Details</div>

      <div className="company-details">
        <div><strong>Company :</strong> {companyName}</div>
        <div><strong>Date :</strong> {new Date(company.lastOpeningDate).toLocaleDateString()}</div>
      </div>

      <div className="job-details">
        <strong>Job Details :</strong> {company.position}
      </div>

      <div className="job-description">
        The candidate should have basic knowledge of MongoDB, Express.js, React.js, and Node.js,
        along with a good understanding of JavaScript, HTML, and CSS. This is a great opportunity to
        work on real-time projects, learn from experienced developers, and grow your career in
        full-stack development.
      </div>

      <div className="summary-boxes">
        <div className="box">
          <h2>{company.requirements || '00'}</h2>
          <span>Requirements</span>
        </div>
        <div className="box">
          <h2>{resumesSentCount || '00'}</h2>
          <span>Resumes Sent</span>
        </div>
      </div>

      <div className="lists-container">
        <div className="list">
          <h4>Applied Students ▼</h4>
          <input
            type="text"
            placeholder="Search Student"
            value={searchApplied}
            onChange={(e) => setSearchApplied(e.target.value)}
          />
          <table>
            <thead><tr><th>SrNo</th><th>Name</th></tr></thead>
            <tbody>
              {appliedStudents
                .filter((s) => s.name?.toLowerCase().includes(searchApplied.toLowerCase()))
                .map((student, i) => (
                  <tr key={student._id}><td>{`0${i + 1}`}</td><td>{student.name}</td></tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="list">
          <h4>Shortlisted Students ▼</h4>
          <input
            type="text"
            placeholder="Search Student"
            value={searchShortlisted}
            onChange={(e) => setSearchShortlisted(e.target.value)}
          />
          <table>
            <thead><tr><th>SrNo</th><th>Name</th></tr></thead>
            <tbody>
              {shortlistedStudents
                .filter((s) => s.name?.toLowerCase().includes(searchShortlisted.toLowerCase()))
                .map((student, i) => (
                  <tr key={student._id}><td>{`0${i + 1}`}</td><td>{student.name}</td></tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="list">
          <h4>Placed Students ▼</h4>
          <input
            type="text"
            placeholder="Search Student"
            value={searchPlaced}
            onChange={(e) => setSearchPlaced(e.target.value)}
          />
          <table>
            <thead><tr><th>SrNo</th><th>Name</th></tr></thead>
            <tbody>
              {placedStudents
                .filter((s) => s.name?.toLowerCase().includes(searchPlaced.toLowerCase()))
                .map((student, i) => (
                  <tr key={student._id}><td>{`0${i + 1}`}</td><td>{student.name}</td></tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSubmitReport}>Submit Report</button>
      </div>
    </div>
  );
};

export default InterviewDetail;
