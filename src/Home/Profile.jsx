import React, { useState, useEffect } from "react";
import "./Profile.css"; // Import the CSS file
import { db } from "../Firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { FaStar } from "react-icons/fa"; // Import star icons from react-icons

const Profile = ({ patientId, userName, userGender }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const feedbackGiven = localStorage.getItem("feedbackGiven");
    if (!feedbackGiven) {
      setIsModalOpen(true);
    }
  }, []);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmitFeedback = async () => {
    if (!feedback || rating === 0) {
      alert("Please provide both a rating and feedback.");
      return;
    }

    try {
      await addDoc(collection(db, "feedbacks"), {
        patientId,
        userName,
        rating,
        feedback,
        timestamp: new Date(),
      });
      localStorage.setItem("feedbackGiven", "true");
      alert("Feedback submitted successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting feedback: ", error);
      alert("Failed to submit feedback.");
    }
  };

  const getAvatarUrl = () => {
    if (userGender === "Male") {
      return "output-onlinegiftools.gif";
    } else if (userGender === "Female") {
      return "https://media2.giphy.com/avatars/bronandco/YxpMgT87kdpb.gif";
    } else {
      return "user.gif";
    }
  };

  return (
    <div className="pro-container">
      <h1 className="pro-heading">
        Profile <h1>{userName}</h1>
      </h1>

      {/* Avatar Image */}
      <div className="avatar-container">
        <img src={getAvatarUrl()} alt="User Avatar" className="avatar-image" />
      </div>

      {/* Feedback Button */}
      <button className="feedback-button" onClick={() => setIsModalOpen(true)}>
        Leave Feedback
      </button>

      {/* Contact Details Section */}
      {/* <div className="pro-section">
        <h2 className="pro-section-heading">Contact Details</h2>
        <ul className="pro-list">
          <li className="pro-list-item">
            <strong>Email:</strong> example@example.com
          </li>
          <li className="pro-list-item">
            <strong>Phone:</strong> +123 456 7890
          </li>
          <li className="pro-list-item">
            <strong>Address:</strong> 123 Main St, City, Country
          </li>
        </ul>
      </div> */}

      {/* Feedback Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Leave Feedback</h2>
            <div className="star-rating">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <FaStar
                    key={index}
                    className="star"
                    color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                    onClick={() => handleStarClick(ratingValue)}
                  />
                );
              })}
            </div>
            <textarea
              className="feedback-input"
              placeholder="Your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleCloseModal}>Cancel</button>
              <button onClick={handleSubmitFeedback}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;