import React, { useEffect, useState } from 'react';
import './Report.css';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const navigate = useNavigate();
  const [todayData, setTodayData] = useState({
    companies: 0,
    calls: 0,
    interviews: 0,
    placed: 0,
  });

  const [monthData, setMonthData] = useState({
    companies: 0,
    calls: 0,
    interviews: 0,
    placed: 0,
  });

  useEffect(() => {
    // Replace with real data from your app
    const companyList = [
      { name: 'TCS', date: '2025-05-23' },
      { name: 'Infosys', date: '2025-05-23' },
    ];

    const interviewCalls = [
      { id: 1, date: '2025-05-23' },
      { id: 2, date: '2025-05-22' },
    ];

    const interviewDetails = [
      { status: 'scheduled', date: '2025-05-23' },
      { status: 'placed', date: '2025-05-23' },
    ];

    const today = new Date().toISOString().slice(0, 10);
    const month = new Date().toISOString().slice(0, 7); // "2025-05"

    const filterByToday = (list) => list.filter(item => item.date === today);
    const filterByMonth = (list) => list.filter(item => item.date.startsWith(month));

    setTodayData({
      companies: filterByToday(companyList).length,
      calls: filterByToday(interviewCalls).length,
      interviews: filterByToday(interviewDetails.filter(i => i.status === 'scheduled')).length,
      placed: filterByToday(interviewDetails.filter(i => i.status === 'placed')).length,
    });

    setMonthData({
      companies: filterByMonth(companyList).length,
      calls: filterByMonth(interviewCalls).length,
      interviews: filterByMonth(interviewDetails.filter(i => i.status === 'scheduled')).length,
      placed: filterByMonth(interviewDetails.filter(i => i.status === 'placed')).length,
    });
  }, []);

  const StatCard = ({ title, value }) => (
    <div className="stat-card">
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );

  return (
    <div className="report-container">
      <button className="back-button" onClick={() => navigate('/interview-calls')}>
  ← Back
</button>
      <div className="report-header">Report</div>
      

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
    </div>
  );
};

export default Report;
