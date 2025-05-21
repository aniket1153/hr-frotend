import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewStudents.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const statusOptions = ["Applied", "Shortlisted", "Rejected", "On Hold", "Others"];

const ViewStudents = () => {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You are not logged in. Please login first.");
        return;
      }
      const response = await axios.get('http://localhost:5000/api/students', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const studentsWithStatus = response.data.map(s => ({
        ...s,
        status: s.status || "Applied"
      }));
      setStudents(studentsWithStatus);
    } catch (err) {
      console.error("Failed to fetch students:", err.response || err.message);
      toast.error(err.response?.data?.message || "Failed to fetch students. Please try again.");
    }
  };

  const handleStatusChange = async (index, newStatus) => {
    const student = students[index];
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You are not logged in. Please login first.");
        return;
      }
      const response = await axios.patch(
        `http://localhost:5000/api/students/${student._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedStudent = response.data;
      const updatedStudents = [...students];
      updatedStudents[index] = updatedStudent;
      setStudents(updatedStudents);

      const displayName = updatedStudent.name || updatedStudent.fullName || "Student";
      toast.success(`Status updated for ${displayName}`);
    } catch (err) {
      console.error("Failed to update status:", err.response || err.message);
      toast.error(err.response?.data?.message || "Error updating student status. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Invalid student ID");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You are not logged in. Please login first.");
        return;
      }
      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setStudents(students.filter(s => s._id !== id));
      toast.success("Student deleted successfully");
    } catch (err) {
      console.error("Delete error:", err.response || err.message);
      toast.error(err.response?.data?.message || "Failed to delete student.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="view-students-container">
      <h1>View Students</h1>
      <table className="students-table">
        <thead>
          <tr>
            <th>Sr.No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Course</th>
            <th>Company Applied</th>
            <th>Status</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {students.map((stu, idx) => (
            <tr key={stu._id || idx}>
              <td>{idx + 1}</td>
              <td>{stu.name || stu.fullName}</td>
              <td>{stu.email}</td>
              <td>{stu.contact}</td>
              <td>{stu.courseName || stu.course}</td>
              <td>{stu.appliedCompany || "N/A"}</td>
              <td>
                <select
                  value={stu.status}
                  onChange={(e) => handleStatusChange(idx, e.target.value)}
                  className="status-dropdown"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(stu._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        theme="colored"
      />
    </div>
  );
};

export default ViewStudents;
