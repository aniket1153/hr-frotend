import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RequireRole from "./components/RequireRole";
import RequireAuth from "./components/RequireAuth";
import AdminHome from "./pages/AdminHome";
import PlacementDashboard from "./pages/PlacementDashboard";
import AddCompany from "./pages/AddCompany";
import AddStudentForm from "./pages/AddStudentForm";
import CompaniesList from "./pages/CompaniesList";
import InterviewCalls from "./pages/InterviewCalls";
import CompanyDetails from "./pages/CompanyDetails";
import InterviewDetails from "./pages/InterviewDetails";
import ViewStudents from "./pages/ViewStudents";
import PlacedStudents from "./pages/PlacedStudents";
import Unauthorized from "./components/Unauthorized";
import Report from "./pages/Report";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} /> {/* Add this */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        {/* Protected routes */}
        {/* ... your other routes remain the same */}
        <Route
          path="/admin-home"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["super-admin", "admin"]}>
                <AdminHome />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/placement"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["super-admin", "admin", "hr"]}>
                <PlacementDashboard />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/add-company"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["super-admin", "admin"]}>
                <AddCompany />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/add-student"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["super-admin", "admin"]}>
                <AddStudentForm />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/view-companies"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["super-admin", "admin"]}>
                <CompaniesList />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/company/:id"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["super-admin", "admin"]}>
                <CompanyDetails />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/interview-calls"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["super-admin", "admin", "hr"]}>
                <InterviewCalls />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/interview-details/:id"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["super-admin", "admin", "hr"]}>
                <InterviewDetails />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/view-students"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["super-admin", "admin", "hr"]}>
                <ViewStudents />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/placed-students"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["super-admin", "admin"]}>
                <PlacedStudents />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/report"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["super-admin", "admin"]}>
                <Report />
              </RequireRole>
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
