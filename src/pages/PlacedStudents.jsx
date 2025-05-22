import React, { useState, useEffect } from "react";
import "./PlacedStudents.css";

function PlacedStudents() {
  const [placedStudents, setPlacedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token")
  fetch("http://localhost:5000/api/students/placed",{
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add token here
    },
  }) 
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch placed students");
      return res.json();
    })
    .then((data) => {
      setPlacedStudents(data);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    });
}, []);


  // Extract unique companies for filter dropdown
  const companies = [
    ...new Set(placedStudents.map((p) => p.company.name)),
  ].sort();

  // Filtering and searching logic
  const filteredStudents = placedStudents.filter((p) => {
    const matchesSearch =
      p.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.company.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCompany = filterCompany ? p.company.name === filterCompany : true;

    const placementDate = new Date(p.placementDate);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchesDateFrom = fromDate ? placementDate >= fromDate : true;
    const matchesDateTo = toDate ? placementDate <= toDate : true;

    return matchesSearch && matchesCompany && matchesDateFrom && matchesDateTo;
  });

  if (loading) return <div className="ps-loading">Loading placed students...</div>;
  if (error) return <div className="ps-error">Error: {error}</div>;

  return (
    <div className="ps-container">
      <h2 className="ps-title">Placed Students</h2>

      <div className="ps-filters">
        <input
          type="text"
          placeholder="Search by student or company"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ps-input"
        />

        <select
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
          className="ps-select"
        >
          <option value="">All Companies</option>
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        <label className="ps-date-label">
          From:
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="ps-date-input"
          />
        </label>

        <label className="ps-date-label">
          To:
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="ps-date-input"
          />
        </label>
      </div>

      <table className="ps-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Position</th>
            <th>Placement Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length ? (
            filteredStudents.map((p) => (
              <tr key={p.id}>
                <td>{p.student.name}</td>
                <td>{p.student.email}</td>
                <td>{p.company.name}</td>
                <td>{p.position}</td>
                <td>{p.placementDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No placed students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PlacedStudents;
