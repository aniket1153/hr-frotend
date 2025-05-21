import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./InterviewDetails.css";

const InterviewDetails = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("❌ Authentication token missing. Please login.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/interview-calls/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setInterview(response.data);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error("API error:", err);
        setError("⚠️ Failed to load interview details.");
        setLoading(false);
      }
    };

    fetchInterviewDetails();
    const intervalId = setInterval(fetchInterviewDetails, 10000);
    return () => clearInterval(intervalId);
  }, [id]);

  if (loading) return <p className="loading">Loading interview details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!interview) return <p className="error">Interview not found</p>;

  return (
    <div className="interview-details-page">
      <div className="header-row">
        <h2>Interview Details</h2>
        <div className="header-info">
          <span className="company-name">{interview.companyId?.companyName || "N/A"}</span>
          <span className="interview-date">
            {interview.interviewDate ? new Date(interview.interviewDate).toLocaleDateString() : "N/A"}
          </span>
        </div>
      </div>

      <div className="section">
        <h3>Job Details</h3>
        <p className="job-desc">{interview.description || "No description available."}</p>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <strong>Requirements</strong>
          <span>{interview.requirementsCount || 0}</span>
        </div>
        <div className="stat-box">
          <strong>Resumes Sent</strong>
          <span>{interview.resumes?.length || 0}</span>
        </div>
      </div>

      <div className="section">
        <h3>Applied Students</h3>
        <table className="applied-table">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Resume</th>
            </tr>
          </thead>
          <tbody>
            {interview.resumes?.length > 0 ? (
              interview.resumes.map((item, idx) => (
                <tr key={item.student?._id || idx}>
                  <td>{idx + 1}</td>
                  <td>{item.student?.name || "N/A"}</td>
                  <td>{item.student?.contact || "N/A"}</td>
                  <td>{item.student?.email || "N/A"}</td>
                  <td>
                    {item.resumeUrl ? (
                      <a href={item.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a>
                    ) : (
                      "Not Uploaded"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No students applied.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="two-tables-row">
        <div className="sub-section">
          <h4>Shortlisted Students</h4>
          <table className="simple-table">
            <thead>
              <tr>
                <th>Sr.No.</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {interview.shortlisted?.length > 0 ? (
                interview.shortlisted.map((student, idx) => (
                  <tr key={student._id}>
                    <td>{idx + 1}</td>
                    <td>{student.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No shortlisted students.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sub-section">
          <h4>Placed Students</h4>
          <table className="simple-table">
            <thead>
              <tr>
                <th>Sr.No.</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {interview.placed?.length > 0 ? (
                interview.placed.map((student, idx) => (
                  <tr key={student._id || student.studentId}>
                    <td>{idx + 1}</td>
                    <td>{student.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No placed students.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;
