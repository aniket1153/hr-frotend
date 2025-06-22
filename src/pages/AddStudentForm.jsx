import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddStudentForm.css';
import axiosInstance from '../axiosInstance';  // use your axios instance here

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    contact: '',
    email: '',
    resumeUploaded: false,
    appliedCompany: '',
  });

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axiosInstance.get('/api/companies', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompanies(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error('Failed to load companies');
        setCompanies([]);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'resumeUploaded') {
      setFormData({ ...formData, [name]: value === 'Yes' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post('/api/students', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Student added successfully!');
      setFormData({
        name: '',
        course: '',
        contact: '',
        email: '',
        resumeUploaded: false,
        appliedCompany: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding student');
    }
  };

  return (
    <div className="add-student-container">
      <h2>Add Student</h2>
      <form className="student-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label htmlFor="name">Full Name</label>
          <span>:</span>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Student Name"
            required
          />
        </div>

        <div className="form-grid">
          <label htmlFor="course">Course Name</label>
          <span>:</span>
          <input
            id="course"
            name="course"
            type="text"
            value={formData.course}
            onChange={handleChange}
            placeholder="Course Name"
            required
          />
        </div>

        <div className="form-grid">
          <label htmlFor="contact">Contact</label>
          <span>:</span>
          <input
            id="contact"
            name="contact"
            type="text"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact"
            required
          />
        </div>

        <div className="form-grid">
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
        </div>

        {/* <div className="form-grid">
          <label htmlFor="resumeUploaded">Resume Uploaded</label>
          <span>:</span>
          <select
            id="resumeUploaded"
            name="resumeUploaded"
            value={formData.resumeUploaded ? 'Yes' : 'No'}
            onChange={handleChange}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div> */}

        {/* <div className="form-grid">
          <label htmlFor="appliedCompany">Applied Company</label>
          <span>:</span>
          <select
            id="appliedCompany"
            name="appliedCompany"
            value={formData.appliedCompany}
            onChange={handleChange}
            required
          >
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c._id} value={c.companyName}>
                {c.companyName}
              </option>
            ))}
          </select>
        </div> */}

        <button type="submit">Submit</button>
      </form>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default AddStudent;
