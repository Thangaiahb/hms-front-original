import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Billing from "./pages/Billing";
import Prescription from "./pages/Prescription";
import PatientDetails from "./pages/PatientDetails"
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <Patients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute>
              <Prescription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/:phone"
          element={
            <ProtectedRoute>
              <PatientDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescription/:phone"
          element={
            <ProtectedRoute>
              <Prescription />
            </ProtectedRoute>
          }
        />

      </Routes>


    </BrowserRouter>
  );
}

export default App;
