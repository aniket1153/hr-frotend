import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreateCompany.css';

const CreateCompany = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [formData, setFormData] = useState({
    positions: [{ positionName: '', openingDate: '' }],
    lastOpeningDate: '',
    candidateCount: 0,
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/api/companies', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(res.data);
      } catch (err) {
        toast.error('❌ Failed to load companies');
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      setFormData({
        positions: [{ positionName: '', openingDate: '' }],
        lastOpeningDate: '',
        candidateCount: 0,
      });
    }
  }, [selectedCompanyId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePositionChange = (index, e) => {
    const updated = [...formData.positions];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, positions: updated });
  };

  const addPosition = () => {
    setFormData({
      ...formData,
      positions: [...formData.positions, { positionName: '', openingDate: '' }],
    });
  };

  const removePosition = (index) => {
    const updated = formData.positions.filter((_, i) => i !== index);
    setFormData({ ...formData, positions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCompanyId) {
      toast.warn('⚠️ Please select a company first.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      // Step 1: Get existing company data
      const res = await axiosInstance.get(`/api/companies/${selectedCompanyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const existingCompany = res.data;

      // Step 2: Merge existing positions with new ones
      const mergedPositions = [
        ...existingCompany.positions,
        ...formData.positions,
      ];

      // Step 3: Keep lastOpeningDate as latest
      const lastOpeningDate =
        new Date(formData.lastOpeningDate) > new Date(existingCompany.lastOpeningDate)
          ? formData.lastOpeningDate
          : existingCompany.lastOpeningDate;

      // Step 4: Add candidate count
      const candidateCount =
        existingCompany.candidateCount + Number(formData.candidateCount);

      // Step 5: Prepare updated data
      const updatedData = {
        positions: mergedPositions,
        lastOpeningDate,
        candidateCount,
      };

      // Step 6: Send PUT request to update the company
      await axiosInstance.put(`/api/companies/${selectedCompanyId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Store updated company ID in localStorage
      localStorage.setItem('lastUpdatedCompanyId', selectedCompanyId);

      toast.success('✅ Interview call details updated!');
      navigate('/interview-calls');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to update interview call details');
    }
  };

  return (
    <div className="add-company-container">
      <h2 className='gg'>Update Interview Call Details</h2>
      <form className="company-form" onSubmit={handleSubmit}>
        {/* Company dropdown */}
        <div className="form-row">
          <label>Select Company</label>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            required
          >
            <option value="">-- Select Company --</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>

        {/* Job Positions */}
        <div className="form-row">
          <label>Job Positions & Opening Dates</label>
          {formData.positions.map((pos, index) => (
            <div key={index} className="position-row">
              <input
                type="text"
                name="positionName"
                placeholder={`Position ${index + 1}`}
                value={pos.positionName}
                onChange={(e) => handlePositionChange(index, e)}
                required
              />
              <input
                type="date"
                name="openingDate"
                value={pos.openingDate}
                onChange={(e) => handlePositionChange(index, e)}
                required
              />
              {formData.positions.length > 1 && (
                <button type="button" onClick={() => removePosition(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          {/* <button type="button" onClick={addPosition}>
            Add Position
          </button> */}
        </div>

        {/* Last Opening Date */}
        <div className="form-row">
          <label>Last Opening Date</label>
          <input
            type="date"
            name="lastOpeningDate"
            value={formData.lastOpeningDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Candidate Count */}
        <div className="form-row">
          <label>Candidate Count</label>
          <input
            type="number"
            name="candidateCount"
            value={formData.candidateCount}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <button type="submit">Update Interview Details</button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateCompany;
