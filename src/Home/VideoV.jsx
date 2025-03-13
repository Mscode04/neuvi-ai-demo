import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "./VideoV.css";
import { videoFiles } from "./fileRootsVID";

const VideoV = ({ goBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [randomQuote, setRandomQuote] = useState("");
  const itemsPerPage = 9;

  const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);
  }, []);

  const filterVideos = videoFiles.filter((video) => {
    const matchInterest = selectedInterest === "All" || video.interest === selectedInterest;
    const matchSearch =
      video.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.keywords.toLowerCase().includes(searchTerm.toLowerCase());

    return matchInterest && matchSearch;
  });

  const totalPages = Math.ceil(filterVideos.length / itemsPerPage);
  const currentVideos = filterVideos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="videov-container container mt-4">
      <div className="videov-back-btn" onClick={goBack}>
        <FaArrowLeft className="videov-back-icon" />
      </div>
      <h1 className="videov-heading">Neuraq - Your Learning Partner</h1>

      <div className="videov-fil">
        <div className="videov-row-container mb-4">
          <div className="videov-search-bar">
            <input
              type="text"
              className="videov-form-control"
              placeholder="Search by name, description, keyword, interest..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="videov-filter-select">
            <select
              className="videov-form-select"
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
            >
              <option value="All">All Interests</option>
              {[...new Set(videoFiles.map((video) => video.interest))].map((interest, index) => (
                <option key={index} value={interest}>{interest}</option>
              ))}
            </select>
          </div>
        </div>

        {randomQuote && (
          <div className="videov-quote">
            <p className="videov-quote-text">"{randomQuote.text}"</p>
            <p className="videov-quote-author">- {randomQuote.author}</p>
          </div>
        )}
      </div>

      <div className="row">
        {currentVideos.map((video, index) => (
          <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-3">
            <div className="videov-card shadow-sm text-center" onClick={() => window.open(video.videoUrl, "_blank")}> 
              <div className="videov-card-body">
              <img
                  src={`${process.env.PUBLIC_URL}${video.thumbnail}`}
                  alt={`${video.name} Thumbnail`}
                  className="pdfv-card-img-top"
                />
                <h5 className="videov-card-title mt-2">{video.name}</h5>
                <p className="videov-card-text">{video.description}</p>
                <p><strong>Duration:</strong> {video.duration}</p>
                <p><strong>Interest:</strong> {video.interest}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="videov-pagination mt-4 text-center mb-5">
        <ul className="videov-pagination-list">
          <li className={`videov-page-item ${currentPage === 1 ? "disabled" : ""}`} onClick={() => setCurrentPage(currentPage - 1)}>
            <button className="videov-page-link me-2">Previous</button>
          </li>
          <li className={`videov-page-item ${currentPage === totalPages ? "disabled" : ""}`} onClick={() => setCurrentPage(currentPage + 1)}>
            <button className="videov-page-link">Next</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VideoV;
