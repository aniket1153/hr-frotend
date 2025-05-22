import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './InterviewDetails.css';

const InterviewDetail = () => {
  const { id } = useParams();
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

        const companyRes = await axios.get(`http://localhost:5000/api/companies/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const companyData = companyRes.data;
        setCompany(companyData);

        const studentRes = await axios.get('http://localhost:5000/api/students', {
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

  // Normalize values
  const companyName = company.companyName;

  const appliedStudents = students.filter(
    s => s.appliedCompany === companyName && s.status?.toLowerCase() === 'applied'
  );
  const shortlistedStudents = students.filter(
    s => s.appliedCompany === companyName && s.status?.toLowerCase() === 'shortlisted'
  );
  const placedStudents = students.filter(
    s => s.appliedCompany === companyName && s.status?.toLowerCase() === 'placed'
  );

  // Calculate resumes sent count based on students applied to this company
  const resumesSentCount = students.filter(s => s.appliedCompany === companyName).length;

  // Submit handler for sending report data
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

      alert('Report submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit report');
    }
  };

  return (
    <div className="interview-container">
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
          <h2>{resumesSentCount || '00'}</h2> {/* Updated count here */}
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
            <thead>
              <tr><th>SrNo</th><th>Name</th></tr>
            </thead>
            <tbody>
              {appliedStudents
                .filter(s => s.name?.toLowerCase().includes(searchApplied.toLowerCase()))
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
            <thead>
              <tr><th>SrNo</th><th>Name</th></tr>
            </thead>
            <tbody>
              {shortlistedStudents
                .filter(s => s.name?.toLowerCase().includes(searchShortlisted.toLowerCase()))
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
            <thead>
              <tr><th>SrNo</th><th>Name</th></tr>
            </thead>
            <tbody>
              {placedStudents
                .filter(s => s.name?.toLowerCase().includes(searchPlaced.toLowerCase()))
                .map((student, i) => (
                  <tr key={student._id}><td>{`0${i + 1}`}</td><td>{student.name}</td></tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit button below the lists */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSubmitReport}>Submit Report</button>
      </div>
    </div>
  );
};

export default InterviewDetail;
