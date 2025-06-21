import React, { useEffect, useState } from 'react';
import './Report.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import userIcon from '../assets/q1.png'; // 👤 Image

const Report = () => {
  const navigate = useNavigate();

  const [todayData, setTodayData] = useState({ companies: 0, calls: 0, interviews: 0, placed: 0 });
  const [monthData, setMonthData] = useState({ companies: 0, calls: 0, interviews: 0, placed: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const month = new Date().toISOString().slice(0, 7);
        const baseURL = 'http://localhost:5000';
        const token = localStorage.getItem("token");

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [todayCompanies, todayCalls, todayInterviews, todayPlaced] = await Promise.all([
          axios.get(`${baseURL}/api/companies/stats?date=${today}`, config),
          axios.get(`${baseURL}/api/interview-calls/stats?date=${today}`, config),
          axios.get(`${baseURL}/api/reports/stats?status=scheduled&date=${today}`, config),
          axios.get(`${baseURL}/api/reports/stats?status=placed&date=${today}`, config),
        ]);

        const [monthCompanies, monthCalls, monthInterviews, monthPlaced] = await Promise.all([
          axios.get(`${baseURL}/api/companies/stats?month=${month}`, config),
          axios.get(`${baseURL}/api/interview-calls/stats?month=${month}`, config),
          axios.get(`${baseURL}/api/reports/stats?status=scheduled&month=${month}`, config),
          axios.get(`${baseURL}/api/reports/stats?status=placed&month=${month}`, config),
        ]);

        setTodayData({
          companies: todayCompanies.data.count || 0,
          calls: todayCalls.data.count || 0,
          interviews: todayInterviews.data.count || 0,
          placed: todayPlaced.data.count || 0,
        });

        setMonthData({
          companies: monthCompanies.data.count || 0,
          calls: monthCalls.data.count || 0,
          interviews: monthInterviews.data.count || 0,
          placed: monthPlaced.data.count || 0,
        });

      } catch (error) {
        console.error('Error fetching report data:', error.response?.data || error.message);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value }) => (
    <div className="stat-card">
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );

  return (
    <div className="report-container">
      <div className="report-topbar">
        <div className="tabs">
          <div className="tab active">HR Report</div>
          <div className="tab" onClick={() => navigate('/placement-report')}>Placement Report</div>
        </div>
        <img src={userIcon} alt="User" className="user-icon" />
      </div>

      <section className="report-section">
        <h2 className="section-title">TODAY</h2>
        <div className="card-row">
          <StatCard title="Total Added Company" value={todayData.companies} />
          <StatCard title="Total Connected Calls" value={todayData.calls} />
          <StatCard title="Total Scheduled Interviews" value={todayData.interviews} />
          <StatCard title="Total Candidates Placed" value={todayData.placed} />
        </div>
      </section>

      <section className="report-section">
        <h2 className="section-title">THIS MONTH</h2>
        <div className="card-row">
          <StatCard title="Total Added Company" value={monthData.companies} />
          <StatCard title="Total Connected Calls" value={monthData.calls} />
          <StatCard title="Total Scheduled Interviews" value={monthData.interviews} />
          <StatCard title="Total Candidates Placed" value={monthData.placed} />
        </div>
      </section>

      <button className="back-button" onClick={() => navigate('/interview-calls')}>
        ← Back
      </button>
    </div>
  );
};

export default Report;
