import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config"; // Your Firebase config file
import { collection, getDocs } from "firebase/firestore";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function Home({ patientId, userName, userGender }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);
  const [quotes, setQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const navigate = useNavigate();

  // Manually added quotes and ads
  const manualQuotes = [
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  ];

  const manualAds = [
    "https://via.placeholder.com/300x150?text=Ad+1",
    "https://via.placeholder.com/300x150?text=Ad+2",
    "https://via.placeholder.com/300x150?text=Ad+3",
  ];

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const querySnapshot = await getDocs(collection(db, "feedbacks"));
      const feedbacksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeedbacks(feedbacksData);
    };

    fetchFeedbacks();
    setQuotes(manualQuotes);
    setAds(manualAds);
  }, []);

  // Automatically cycle through feedbacks every 5 seconds
  useEffect(() => {
    if (feedbacks.length > 0) {
      const interval = setInterval(() => {
        setCurrentFeedbackIndex((prevIndex) =>
          (prevIndex + 1) % feedbacks.length
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [feedbacks]);

  // Automatically cycle through quotes every 5 seconds
  useEffect(() => {
    if (quotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [quotes]);

  // Automatically cycle through ads every 5 seconds
  useEffect(() => {
    if (ads.length > 0) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [ads]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    navigate("/logout");
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
    <div className="HomeApp">
      {/* Topbar */}
      <header className="HomeTopbar">
        <button className="btn btn-transparent" onClick={toggleDrawer}>
          <i className="bi bi-list"></i>
        </button>
        <div className="user-info"  onClick={() => navigate(`/main/${patientId}/profile`)}>
          <span>{userName}</span>
          <img
            src={getAvatarUrl()}
            alt="User Avatar"
            className="user-avatar"
          />
        </div>
      </header>

      {/* Drawer */}
      <div className={`HomeDrawer ${drawerOpen ? "open" : ""}`}>
        <button className="HomeDrawerCloseButton" onClick={toggleDrawer}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="drawer-content">
          <div className="drawer-profile" onClick={() => navigate(`/main/${patientId}/profile`)}>
            <img
              src={getAvatarUrl()}
              alt="User Avatar"
              className="drawer-avatar"
              
            />
            <p>{userName}</p>
          </div>
          {/* <a
            href="https://neuraq.github.io/Palliative-Mkba-App-Contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="HomeDrawerButton"
          >
            Contact Us
          </a>
          <a
            href="https://neuraq.github.io/Palliative-Mkba-App-About/"
            target="_blank"
            rel="noopener noreferrer"
            className="HomeDrawerButton"
          >
            About Us
          </a> */}
        </div>
        <div className="drawer-footer">
          <button className="HomeDrawerButton btn-danger" onClick={handleLogout}>
            Logout
          </button>
          <div className="powered-by">Powered by neuraq</div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="HomeBanner"></div>

      {/* Action Buttons Section */}
      <div className="HomeActions">
      <button className="action-button" onClick={() => navigate(`/main/chatbot`)}>
  Explore
</button>
      </div>



      {/* Quote Section */}
      <div className="HomeQuotes">
  {/* <h2>Quotes</h2> */}
  {quotes.length > 0 ? (
    <div className="quote-card">
      <p>{quotes[currentQuoteIndex].text}</p>
      <p className="quote-author">- {quotes[currentQuoteIndex].author}</p>
    </div>
  ) : (
    <p>Loading quotes...</p> // Fallback message
  )}
</div>



      {/* Testimonials Section */}
      <div className="HomeTestimonials">
        <h2>Testimonials</h2>
        <div className="testimonial-grid container">
          {feedbacks.length > 0 && (
            <div
              className={`testimonial-card slide-animation`}
              key={feedbacks[currentFeedbackIndex].id}
            >
              <img
                src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/df7eac147767277.62c848d68fa9d.gif"
                alt="User"
                className="testimonial-avatar"
              />
              <div className="rating">
                <p>{feedbacks[currentFeedbackIndex].feedback} <span>- {feedbacks[currentFeedbackIndex].userName}</span></p>
                {Array.from({ length: feedbacks[currentFeedbackIndex].rating }, (_, i) => (
                  <i key={i} className="bi bi-star-fill"></i>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Ads Section */}
      {/* <div className="HomeAds">
        <h2>Advertisement</h2>
        <div className="ads-grid container">
          {ads.length > 0 && (
            <div className="ads-card">
              <img src={ads[currentAdIndex]} alt="Ad" className="ads-image" />
            </div>
          )}
        </div>
      </div> */}


    </div>
  );
}

export default Home;