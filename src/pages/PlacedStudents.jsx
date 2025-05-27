import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../axiosInstance';
import './PlacedStudents.css';

const PlacedStudents = () => {
  const [placedStudents, setPlacedStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchPlacedStudents = async () => {
      try {
        const response = await axiosInstance.get("/api/students", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = response.data;

        // Filter only placed students
        const placed = data.filter(student => student.status === "Placed");

        setPlacedStudents(placed);

        // Extract unique company names for dropdown
        const uniqueCompanies = [
          ...new Set(placed.map(student => student.appliedCompany || "Unknown"))
        ];

        setCompanies(uniqueCompanies);
      } catch (err) {
        console.error("Error fetching placed students:", err.message);
      }
    };

    fetchPlacedStudents();
  }, []);

  const filteredStudents = selectedCompany
    ? placedStudents.filter(student => student.appliedCompany === selectedCompany)
    : placedStudents;

  const handleInterviewOpen = (companyName) => {
    navigate(`/interview/${companyName}`, { state: { students: filteredStudents } });
  };

  return (
    <div className="placed-students-container">
      <h1>Placed Students</h1>

      <div className="filter-section">
        <label htmlFor="company-select">Select Company:</label>
        <select
          id="company-select"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">All Companies</option>
          {companies.map((comp, idx) => (
            <option key={idx} value={comp}>{comp}</option>
          ))}
        </select>

        {selectedCompany && (
          <button onClick={() => handleInterviewOpen(selectedCompany)}>
            View Interview Details
          </button>
        )}
      </div>

      <table className="students-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((stu, idx) => (
              <tr key={stu._id}>
                <td>{idx + 1}</td>
                <td>{stu.name || stu.fullName}</td>
                <td>{stu.email}</td>
                <td>{stu.placementDate ? new Date(stu.placementDate).toLocaleDateString() : "N/A"}</td>
                <td>{stu.appliedCompany || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#777" }}>
                No placed students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PlacedStudents;
