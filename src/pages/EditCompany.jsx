import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditCompany.css';

const EditCompany = () => {
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
    // positions: [{ positionName: '', openingDate: '' }],
    // lastOpeningDate: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token missing. Please login.');
      navigate('/login'); // or wherever your login page is
      return;
    }

    axiosInstance.get(`/api/companies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setFormData(res.data))
      .catch(err => {
        toast.error('Failed to fetch company details');
        console.error(err);
      });
  }, [id, navigate]);

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
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token missing. Please login.');
      navigate('/login');
      return;
    }
  const navigate = useNavigate();

    try {
      const response = await axiosInstance.put(`/api/companies/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        toast.success('Company updated successfully!');
        setTimeout(() => navigate('/companies'), 1500);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update the company');
    }
  };
  return (
    <div className="edit-company-container">
      <h2>Update Company</h2>

      <form className="company-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>Company Name</label><span>:</span>
          <input name="companyName" value={formData.companyName} onChange={handleChange} required />

          <label>HR Name</label><span>:</span>
          <input name="hrName" value={formData.hrName} onChange={handleChange} required />

          <label>Contact</label><span>:</span>
          <input name="contact" value={formData.contact} onChange={handleChange} required />

          <label>Email</label><span>:</span>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />

          <label>Location</label><span>:</span>
          <input name="location" value={formData.location} onChange={handleChange} required />

          <label>Platform</label><span>:</span>
          <input name="platform" value={formData.platform} onChange={handleChange} />

          <label>Other</label><span>:</span>
          <input name="other" value={formData.other} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>Company History</label>
          <textarea name="companyHistory" value={formData.companyHistory} onChange={handleChange} />
        </div>

        {/* <div className="form-row">
          <label>Positions & Opening Dates</label>
          {formData.positions.map((pos, index) => (
            <div className="position-row" key={index}>
              <input
                type="text"
                name="positionName"
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
            <button type="button" onClick={addPosition}>Add Position</button>
          )}
        </div>

        <div className="form-row">
          <label>Last Opening Date</label>
          <input
            type="date"
            name="lastOpeningDate"
            value={formData.lastOpeningDate?.split('T')[0] || ''}
            onChange={handleChange}
            required
          />
        </div> */}

        <button type="submit" className="submit-btn"  onClick={() => navigate('/view-companies')}>Update Company</button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default EditCompany;
