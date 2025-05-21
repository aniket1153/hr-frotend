import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./InterviewCalls.css";

const InterviewCalls = () => {
  const [callsByCompany, setCallsByCompany] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInterviewCalls = () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(null);

    axios
      .get("http://localhost:5000/api/interview-calls/by-company", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCallsByCompany(response.data || {});
        setLoading(false);
        console.log("Interview Calls grouped by company:", response.data);
      })
      .catch((error) => {
        setError("Failed to load interview calls");
        setLoading(false);
        console.error("API error:", error);
      });
  };

  useEffect(() => {
    fetchInterviewCalls();
  }, []);

  if (loading) return <p>Loading interview calls...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="interview-calls-container">
      <h1>Interview Calls by Company</h1>

      <button className="refresh-button" onClick={fetchInterviewCalls}>
        Refresh
      </button>

      {Object.keys(callsByCompany).length === 0 ? (
        <p>No interview calls found.</p>
      ) : (
        Object.entries(callsByCompany).map(([companyName, calls]) => (
          <div key={companyName} className="company-section">
            <h2>{companyName}</h2>
            <table className="interview-calls-table">
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th>companyName</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Shortlisted / Placed Students</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {calls.length > 0 ? (
                  calls.map((call, index) => (
                    <tr key={call._id}>
                      <td>{index + 1}</td>
                      <td>{call.companyId.companyName || "Not Available"}</td>
                      <td>
                        {call.interviewDate
                          ? new Date(call.interviewDate).toLocaleDateString()
                          : "Unknown"}
                      </td>
                      <td>{call.status || "Unknown"}</td>
                      <td>
                        <div>
                          <strong>Shortlisted:</strong>{" "}
                          {call.shortlisted?.length > 0
                            ? call.shortlisted.map((s) => s.name).join(", ")
                            : "None"}
                        </div>
                        <div>
                          <strong>Placed:</strong>{" "}
                          {call.placed?.length > 0
                            ? call.placed.map((p) => p.name).join(", ")
                            : "None"}
                        </div>
                      </td>
                      <td>
                        <Link
                          to={`/interview-details/${call._id}`}
                          className="view-button"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No interview calls for this company.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default InterviewCalls;
