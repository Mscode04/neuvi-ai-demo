import React, { useState } from "react";
import { db } from "../Firebase/config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "./SignupPage.css";

const generatePatientId = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

const SignupPage = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState(""); // New state for gender
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("Email already exists. Please login.");
        setLoading(false);
        return;
      }

      const patientId = generatePatientId();

      await addDoc(usersRef, {
        name,
        dob,
        email,
        password,
        patientId,
        gender, // Include gender in the document
        is_nurse: true, // Default to true
      });

      alert("Signup successful! Please login.");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup} className="signup-form">
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? "Signing up..." : "Signup"}</button>
      </form>

      <p className="text-dark">Already registered? <Link to="/">Login</Link></p>
    </div>
  );
};

export default SignupPage;