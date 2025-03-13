import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams, Routes, Route } from "react-router-dom";
import { db } from "../Firebase/config"; // Import Firebase Firestore
import { collection, query, where, getDocs } from "firebase/firestore";
import Home from "../Home/Home";
import PDFV from "../Home/PDFV";
import Profile from "../Home/Profile";
import VideoV from "../Home/VideoV";
import About from "../Home/About";
import "./Main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Explore from "../Home/Explore";
import Chatbot from "../Home/Chatbot";
function Main({ isAuthenticated, isNurse }) {
  const { patientId } = useParams();
  const [userName, setUserName] = useState("");
  const [userGender, setUserGender] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (!patientId) return; // Ensure patientId exists

      try {
        // Query Firestore for a document where 'patientid' field matches patientId
        const q = query(collection(db, "users"), where("patientId", "==", patientId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data(); // Get first matching document
          setUserName(userData.name); // Extract and set the name
          setUserGender(userData.gender); // Extract and set the name
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserName();
  }, [patientId]);

  if (!isAuthenticated || !isNurse) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainhome_app">
      <div className="mainhome_page-content">
        <Routes>
          <Route path="/" element={<Chatbot patientId={patientId} userName={userName} userGender={userGender}/>} />
          <Route path="/pdfv" element={<PDFV />} />
          <Route path={`/chatbot`} element={<Chatbot />} />
          <Route path="/videov" element={<Chatbot />} />
          <Route path="/profile" element={<Profile patientId={patientId} userName={userName} userGender={userGender}/>} />
          <Route path="/about" element={<About  patientId={patientId} userName={userName} />} />
          <Route path="/explore" element={<Explore  patientId={patientId} userName={userName} />} />
        </Routes>
      </div>

      {/* Bottom Navigation Bar */}
      {/* <nav className="mainhome_bottom-nav">
        <Link to={`/main/${patientId}`} className="mainhome_nav-item">
          <i className="bi bi-house-fill"></i>
        </Link>
        <Link to={`/main/${patientId}/pdfv`} className="mainhome_nav-item">
          <i className="bi bi-file-earmark-pdf-fill"></i>
        </Link>
        <Link to={`/main/${patientId}/videov`} className="mainhome_nav-item">
          <i className="bi bi-play-circle-fill"></i>
        </Link>
        <Link to={`/main/${patientId}/profile`} className="mainhome_nav-item">
          <i className="bi bi-person-fill"></i>
        </Link>
      </nav> */}
    </div>
  );
}

export default Main;