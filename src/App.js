import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Main/LoginPage";
import SignupPage from "./Main/SignupPage";
import Main from "./Main/Main";
import User from "./Main/User";
import Logout from "./Main/Logout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [isNurse, setIsNurse] = useState(
    localStorage.getItem("isNurse") === "true"
  );
  const [patientId, setPatientId] = useState(localStorage.getItem("patientId") || "");

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
    localStorage.setItem("isNurse", isNurse);
    if (patientId) {
      localStorage.setItem("patientId", patientId);
    }
  }, [isAuthenticated, isNurse, patientId]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsNurse(false);
    setPatientId("");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isNurse");
    localStorage.removeItem("patientId");
  };

  return (
    <Routes>
      <Route
  path="/"
  element={
    !isAuthenticated ? (
      <LoginPage setIsAuthenticated={setIsAuthenticated} setIsNurse={setIsNurse} setPatientId={setPatientId} />
    ) : (
      <Navigate
        to={isNurse ? `/main/${patientId}` : `/users/${patientId}`}
        replace // This prevents the user from going back to the login page after authentication
      />
    )
  }
/>


      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/main/:patientId/*"
        element={
          isAuthenticated && isNurse ? (
            <Main isAuthenticated={isAuthenticated} isNurse={isNurse} patientId={patientId} />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/users/:patientId/*"
        element={
          isAuthenticated && !isNurse ? (
            <User isAuthenticated={isAuthenticated} isNurse={isNurse} patientId={patientId} />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      

      <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
    </Routes>
  );
}

export default App;
