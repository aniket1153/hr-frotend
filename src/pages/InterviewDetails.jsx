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

  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [selectedFromApplied, setSelectedFromApplied] = useState([]);
  const [selectedFromShortlisted, setSelectedFromShortlisted] = useState([]);

  const [searchApplied, setSearchApplied] = useState('');
  const [searchShortlisted, setSearchShortlisted] = useState('');
  const [searchPlaced, setSearchPlaced] = useState('');
  const [searchAllStudents, setSearchAllStudents] = useState('');

  const [showApplied, setShowApplied] = useState(true);
  const [showShortlisted, setShowShortlisted] = useState(true);
  const [showPlaced, setShowPlaced] = useState(true);
  const [showAllStudents, setShowAllStudents] = useState(true);

  useEffect(() => {
    fetchCompanyAndStudents();
  }, [id]);

  const fetchCompanyAndStudents = async () => {
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
      console.error(err);
      setError('Failed to load interview details.');
    } finally {
      setLoading(false);
    }
  };

  const companyName = company?.companyName;

  const companyStudents = students.filter(
    (s) => s.appliedCompany === companyName
  );

  const appliedStudents = companyStudents.filter(
    (s) => s.status?.toLowerCase() === 'applied'
  );
  const shortlistedStudents = companyStudents.filter(
    (s) => s.status?.toLowerCase() === 'shortlisted'
  );
  const placedStudents = companyStudents.filter(
    (s) => s.status?.toLowerCase() === 'placed'
  );

  const resumesSentCount = companyStudents.length;
  const notPlacedCount = appliedStudents.length + shortlistedStudents.length;

  const updateStatus = async (studentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.put(
        `/api/students/${studentId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCompanyAndStudents();
      toast.success('Student status updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update student status');
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

      toast.success('Report submitted successfully!');
      setTimeout(() => navigate('/report'), 1500);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit report');
    }
  };

  const handleApplySelectedStudents = async () => {
    if (!selectedStudentIds.length) return;

    try {
      const token = localStorage.getItem('token');
      const payload = {
        studentIds: selectedStudentIds,
        companyId: company._id,
        positionId: company.positionId || company._id,
      };

      await axiosInstance.post('/api/applied-students/apply', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Selected students applied successfully!');
      setSelectedStudentIds([]);
      fetchCompanyAndStudents();
    } catch (err) {
      console.error(err);
      toast.error('Failed to apply selected students');
    }
  };

  const handleSubmitToShortlisted = async () => {
    for (const id of selectedFromApplied) {
      await updateStatus(id, 'shortlisted');
    }
    setSelectedFromApplied([]);
  };

  const handleSubmitToPlaced = async () => {
    for (const id of selectedFromShortlisted) {
      await updateStatus(id, 'placed');
    }
    setSelectedFromShortlisted([]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-msg">{error}</p>;
  if (!company) return <p>No company found.</p>;



   const handleViewCompany = (id) => {
    navigate(`/company/${id}`);
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
        The candidate should have basic knowledge of MongoDB, Express.js, React.js, and Node.js...
      </div>
<div className="top-section">
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

      {/* All Students Table */}
      
</div>
  <div className="all-lists-row">
  {/* All Students */}
  <div className="list">
    <h4 onClick={() => setShowAllStudents(!showAllStudents)}>
      All Students {showAllStudents ? '▲' : '▼'}
    </h4>
    {showAllStudents && (
      <>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Student"
            value={searchAllStudents}
            onChange={(e) => setSearchAllStudents(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Select</th>
              
              <th>Name</th>
              <th>Contact</th>
              
            </tr>
          </thead>
          <tbody>
            {students
              .filter((s) => {
                const isAlreadyApplied = s.appliedCompany === companyName &&
                  ['applied', 'shortlisted', 'placed'].includes(s.status?.toLowerCase());
                const matchesSearch =
                  s.name?.toLowerCase().includes(searchAllStudents.toLowerCase()) ||
                  s.email?.toLowerCase().includes(searchAllStudents.toLowerCase()) ||
                  s.contact?.includes(searchAllStudents);
                return !isAlreadyApplied && matchesSearch;
              })
              .map((student, i) => (
                
                <tr key={student._id}>
                    <td>{i + 1}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student._id)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...selectedStudentIds, student._id]
                          : selectedStudentIds.filter((id) => id !== student._id);
                        setSelectedStudentIds(updated);
                      }}
                    />
                  </td>
                
                  <td>{student.name}</td>
                  <td>{student.contact}</td>
                  {/* <td>{student.email}</td> */}
                  {/* <td>
                    {student.resumeUrl ? (
                      <a href={student.resumeUrl} target="_blank" rel="noopener noreferrer">
                        Uploaded
                      </a>
                    ) : (
                      'Not Uploaded'
                    )}
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <button
            className="submit-report-btn"
            disabled={selectedStudentIds.length === 0}
            onClick={handleApplySelectedStudents}
          >
            Submit to Applied
          </button>
        </div>
      </>
    )}
  </div>

  {/* Applied Students */}
  <div className="list">
    <h4 onClick={() => setShowApplied(!showApplied)}>
      Applied Students {showApplied ? '▲' : '▼'}
    </h4>
    {showApplied && (
      <>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Student"
            value={searchApplied}
            onChange={(e) => setSearchApplied(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>SrNo</th>
              <th>Select</th>
              
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {appliedStudents
              .filter((s) =>
                s.name?.toLowerCase().includes(searchApplied.toLowerCase())
              )
              .map((student, i) => (

                <tr key={student._id}>
                  <td>{`0${i + 1}`}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedFromApplied.includes(student._id)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...selectedFromApplied, student._id]
                          : selectedFromApplied.filter((id) => id !== student._id);
                        setSelectedFromApplied(updated);
                      }}
                    />
                  </td>
                  
                  <td>{student.name}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <button
            className="submit-report-btn"
            disabled={selectedFromApplied.length === 0}
            onClick={handleSubmitToShortlisted}
          >
            Submit to Shortlisted
          </button>
        </div>
      </>
    )}
  </div>

  {/* Shortlisted Students */}
  <div className="list">
    <h4 onClick={() => setShowShortlisted(!showShortlisted)}>
      Shortlisted Students {showShortlisted ? '▲' : '▼'}
    </h4>
    {showShortlisted && (
      <>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Student"
            value={searchShortlisted}
            onChange={(e) => setSearchShortlisted(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>SrNo</th>
              <th>Select</th>
              
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {shortlistedStudents
              .filter((s) =>
                s.name?.toLowerCase().includes(searchShortlisted.toLowerCase())
              )
              .map((student, i) => (
                <tr key={student._id}>
                   <td>{`0${i + 1}`}</td>
                  <td>
                    
                    <input
                      type="checkbox"
                      checked={selectedFromShortlisted.includes(student._id)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...selectedFromShortlisted, student._id]
                          : selectedFromShortlisted.filter((id) => id !== student._id);
                        setSelectedFromShortlisted(updated);
                      }}
                    />
                  </td>
                 
                  <td>{student.name}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <button
            className="submit-report-btn"
            disabled={selectedFromShortlisted.length === 0}
            onClick={handleSubmitToPlaced}
          >
            Submit to Placed
          </button>
        </div>
      </>
    )}
  </div>

  {/* Placed Students */}
  <div className="list">
    <h4 onClick={() => setShowPlaced(!showPlaced)}>
      Placed Students {showPlaced ? '▲' : '▼'}
    </h4>
    {showPlaced && (
      <>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Student"
            value={searchPlaced}
            onChange={(e) => setSearchPlaced(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>SrNo</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {placedStudents
              .filter((s) =>
                s.name?.toLowerCase().includes(searchPlaced.toLowerCase())
              )
              .map((student, i) => (
                <tr key={student._id}>
                  <td>{`0${i + 1}`}</td>
                  <td>{student.name}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </>
    )}
  </div>
</div>


      {/* Footer */}
      <div className="final-actions">
        <div className="no-candidate-box">
          No Candidate Selected: {notPlacedCount}
        </div>
        <button className="submit-report-btn" onClick={handleSubmitReport}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default InterviewDetail;
