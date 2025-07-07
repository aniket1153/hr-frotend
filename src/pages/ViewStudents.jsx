import React, { useState, useEffect } from 'react'; 
import axiosInstance from '../axiosInstance'; 
import './ViewStudents.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const statusOptions = ["Applied", "Shortlisted", "Rejected", "On Hold", "Placed","Others"];

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You are not logged in. Please login first.");
        return;
      }
      const response = await axiosInstance.get('/api/students', {
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
      await axiosInstance.delete(`/api/students/${id}`, {
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

  const handleViewDetails = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`/api/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedStudent(response.data);
      setShowDetailsModal(true);
    } catch (err) {
      console.error("Failed to fetch student details:", err.response || err.message);
      toast.error(err.response?.data?.message || "Unable to fetch student details.");
    }
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setShowDetailsModal(false);
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
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {students.map((stu, idx) => (
            <tr key={stu._id || idx}>
              <td>{idx + 1}</td>
              <td>
                <button className="name-button" onClick={() => handleViewDetails(stu._id)}>
                  {stu.name || stu.fullName}
                </button>
              </td>
              <td>{stu.email}</td>
              <td>{stu.contact}</td>
              <td>{stu.courseName || stu.course}</td>
              <td>{stu.appliedCompany || "N/A"}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(stu._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Student Details Modal */}
      {showDetailsModal && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Student Details</h2>
            <p><strong>Name:</strong> {selectedStudent.name || selectedStudent.fullName}</p>
            <p><strong>Email:</strong> {selectedStudent.email}</p>
            <p><strong>Contact:</strong> {selectedStudent.contact}</p>
            <p><strong>Course:</strong> {selectedStudent.courseName || selectedStudent.course}</p>
            <p><strong>Status:</strong> {selectedStudent.status || "N/A"}</p>
            <p><strong>Company Applied:</strong> {selectedStudent.appliedCompany || "N/A"}</p>
            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default ViewStudents;
