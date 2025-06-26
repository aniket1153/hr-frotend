import React, { useState } from 'react';
import './AddCompany.css';
import axiosInstance from '../axiosInstance'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCompany = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    hrName: '',
    contact: '',
    email: '',
    location: '',
    platform: '',
    other: '',
    companyHistory: '',
    // positions: [{ positionName: '', openingDate: '' }],
    // lastOpeningDate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handlePositionChange = (index, e) => {
  //   const newPositions = [...formData.positions];
  //   newPositions[index][e.target.name] = e.target.value;
  //   setFormData({ ...formData, positions: newPositions });
  // };

  // const addPosition = () => {
  //   if (formData.positions.length < 5) {
  //     setFormData({
  //       ...formData,
  //       positions: [...formData.positions, { positionName: '', openingDate: '' }],
  //     });
  //   } else {
  //     toast.info('You can add up to 5 positions only.');
  //   }
  // };

  // const removePosition = (index) => {
  //   const newPositions = formData.positions.filter((_, i) => i !== index);
  //   setFormData({ ...formData, positions: newPositions });
  // };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');

    // ✅ Use axiosInstance instead of axios
    const response = await axiosInstance.post('/api/companies', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      toast.success('Company added successfully!');
      setFormData({
        companyName: '',
        hrName: '',
        contact: '',
        email: '',
        location: '',
        platform: '',
        other: '',
        companyHistory: '',
        // positions: [{ positionName: '', openingDate: '' }],
        // lastOpeningDate: '',
      });
    }
  } catch (error) {
    console.error('Error adding company:', error);
    toast.error(`Failed to add company. ${error?.response?.data?.message || ''}`);
  }
};



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.post('http://localhost:5000/api/companies', formData, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (response.status === 201) {
  //       toast.success('Company added successfully!');
  //       setFormData({
  //         companyName: '',
  //         hrName: '',
  //         contact: '',
  //         email: '',
  //         location: '',
  //         platform: '',
  //         other: '',
  //         companyHistory: '',
  //         positions: [{ positionName: '', openingDate: '' }],
  //         lastOpeningDate: '',
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error adding company:', error);
  //     toast.error(`Failed to add company. ${error?.response?.data?.message || ''}`);
  //   }
  // };

  return (
    <div className="add-company-container">
      <h2>Add Placment</h2>

      <form className="company-form" onSubmit={handleSubmit}>
        {/* LEFT COLUMN */}
        <div className="form-grid">
          <label htmlFor="companyName">Company Name</label>
          <span>:</span>
          <input
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company Name"
            required
          />

          <label htmlFor="hrName">HR Name</label>
          <span>:</span>
          <input
            id="hrName"
            name="hrName"
            value={formData.hrName}
            onChange={handleChange}
            placeholder="HR Name"
            required
          />

          <label htmlFor="contact">Contact</label>
          <span>:</span>
          <input
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact"
            required
          />

          <label htmlFor="email">Mail ID</label>
          <span>:</span>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Mail ID"
            required
          />

          <label htmlFor="location">Location</label>
          <span>:</span>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            required
          />

          <label htmlFor="platform">Platform</label>
          <span>:</span>
          <input
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            placeholder="Platform"
          />

          <label htmlFor="other">Other</label>
          <span>:</span>
          <input
            id="other"
            name="other"
            value={formData.other}
            onChange={handleChange}
            placeholder="Other Information"
          />
        </div>

        {/* EXPANDABLE SECTIONS BELOW LABEL GRID */}
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

        {/* <div className="form-row">
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
                <button type="button" onClick={() => removePosition(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          {formData.positions.length < 5 && (
            <button type="button" className="add-position-btn" onClick={addPosition}>
              Add Position
            </button>
          )}
        </div>

        <div className="form-row">
          <label>Last Opening Date</label>
          <input
            type="date"
            name="lastOpeningDate"
            value={formData.lastOpeningDate}
            onChange={handleChange}
            required
          />
        </div> */}

        <button type="submit">Submit</button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddCompany;