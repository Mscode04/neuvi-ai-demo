import React from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css"; // Importing the CSS file

function Explore({patientId, userName}) {
  const navigate = useNavigate();

  return (
    <div className="explore-container">
      <h2 className="explore-title">Explore More</h2>
      <div className="explore-buttons">
        <button className="explore-button pdf" onClick={() => navigate(`/main/${patientId}/pdfv`)}>
          📄 PDF Notes
        </button>
        <button className="explore-button video" onClick={() => navigate(`/main/${patientId}/videov`)}>
          🎥 Videos
        </button>
      </div>
    </div>
  );
}

export default Explore;
