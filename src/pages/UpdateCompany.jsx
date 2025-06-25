import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddCompany.css'; // Reuse same styles

const UpdateCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    hrName: '',
    contact: '',
    email: '',
    location: '',
    platform: '',
    other: '',
    companyHistory: '',
    positions: [{ positionName: '', openingDate: '' }],
    lastOpeningDate: '',
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get(`/api/companies/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(res.data);
      } catch (err) {
        toast.error('Failed to fetch company details');
      }
    };
    fetchCompany();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePositionChange = (index, e) => {
    const newPositions = [...formData.positions];
    newPositions[index][e.target.name] = e.target.value;
    setFormData({ ...formData, positions: newPositions });
  };

  const addPosition = () => {
    if (formData.positions.length < 5) {
      setFormData({
        ...formData,
        positions: [...formData.positions, { positionName: '', openingDate: '' }],
      });
    } else {
      toast.info('You can add up to 5 positions only.');
    }
  };

  const removePosition = (index) => {
    const newPositions = formData.positions.filter((_, i) => i !== index);
    setFormData({ ...formData, positions: newPositions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.put(`/api/companies/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Company updated successfully!');
      navigate('/interview-calls');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update company.');
    }
  };

  return (
    <div className="add-company-container">
      <h2>Update Company</h2>
      <form className="company-form" onSubmit={handleSubmit}>
        {/* Same form layout as AddCompany */}
        {/* Copy the input fields and map logic from AddCompany component here */}

        <div className="form-grid">
          {/* Repeat form fields same as AddCompany */}
          {/* Company Name, HR, Contact, etc. */}
          <label>Company Name</label>
          <span>:</span>
          <input
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
          {/* Add other fields here in the same way... */}
        </div>

        <div className="form-row">
          <label>Company History</label>
          <textarea
            name="companyHistory"
            value={formData.companyHistory}
            onChange={handleChange}
            rows={4}
            placeholder="Enter company history or description"
          />
        </div>

        <div className="form-row">
          <label>Job Positions & Opening Dates</label>
          {formData.positions.map((pos, index) => (
            <div key={index} className="position-row">
              <input
                type="text"
                name="positionName"
                placeholder={`Position ${index + 1} Name`}
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
                <button type="button" onClick={() => removePosition(index)}>Remove</button>
              )}
            </div>
          ))}
          {formData.positions.length < 5 && (
            <button type="button" className="add-position-btn" onClick={addPosition}>
              Add Position
            </button>
          )}
        </div>

        {/* <div className="form-row">
          <label>Last Opening Date</label>
          <input
            type="date"
            name="lastOpeningDate"
            value={formData.lastOpeningDate}
            onChange={handleChange}
            required
          />
        </div> */}

        <button type="submit">Update</button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UpdateCompany;
