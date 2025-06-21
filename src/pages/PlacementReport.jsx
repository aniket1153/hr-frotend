import React, { useEffect, useState } from 'react';
import './PlacementReport.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import userIcon from '../assets/last.png';

const PlacementReport = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [details, setDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/reports/placement-summary', config);
        setCompanies(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompanies();
  }, []);

  const fetchDetails = async (companyId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`http://localhost:5000/api/reports/placement-details/${companyId}`, config);
      setSelectedCompany(companyId);
      setDetails(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="placement-report-container">
  <div className="report-header">
  <div className="tabs">
    <div className="tab" onClick={() => navigate('/report')}>HR Report</div>
    <div className="tab active">Placement Report</div>
  </div>
  <img src={userIcon} alt="User" className="user-icon" />
</div>



      <table className="company-table">
        <thead>
          <tr>
            <th>Sr.No.</th>
            <th>Company Name</th>
            <th>Location</th>
            <th>No Of Students Placed</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((comp, i) => (
            <tr key={comp._id|| 'Unnamed Company'}>
              <td>{comp.srNo}</td>
              <td>{comp.name}</td>
              <td>{comp.location}</td>
              <td>{String(comp.placedCount).padStart(2, '0')}</td>
              <td><button onClick={() => fetchDetails(comp._id)}>view</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCompany && (
        <div className="placement-details">
          <h4>Placed Student Details</h4>
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>Placed On</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
  {details.map((student, i) => (
    <tr key={i}>
      <td>{student.name}</td>
      <td>{new Date(student.placedOn).toLocaleDateString('en-GB')}</td>
      <td>{student.position}</td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default PlacementReport;
