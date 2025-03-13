import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa"; // Import back arrow icon
import "./PDFV.css";
import { pdfFiles } from "./fileRoots";

const PDFV = ({ goBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [randomQuote, setRandomQuote] = useState("");
  const itemsPerPage = 9;

  // Quotes array
  const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
    { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "William Butler Yeats" },
    { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
    { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
    { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  ];

  // Set a random quote on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);
  }, []);

  const filterFiles = pdfFiles.filter((file) => {
    const matchInterest = selectedInterest === "All" || file.interest === selectedInterest;
    const matchSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.keywords.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.interest.toLowerCase().includes(searchTerm.toLowerCase());

    return matchInterest && matchSearch;
  });

  const totalPages = Math.ceil(filterFiles.length / itemsPerPage);
  const currentFiles = filterFiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Fixed Download Function
  const handleDownload = (filePath) => {
    const url = `${process.env.PUBLIC_URL}${filePath}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = filePath.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pdfv-container container mt-4">
      {/* Back Button */}
      <div className="pdfv-back-btn" onClick={goBack}>
        <FaArrowLeft className="pdfv-back-icon" />
        
      </div>

      

      {/* Search & Filter */}
      <div className="pdfv-fil">
        <div className="pdfv-row-container mb-4">
          <div className="pdfv-search-bar">
            <input
              type="text"
              className="pdfv-form-control"
              placeholder="Search by name, description, keyword, interest..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="pdfv-filter-select">
            <select
              className="pdfv-form-select"
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
            >
              <option value="All">All Interests</option>
              {[...new Set(pdfFiles.map((file) => file.interest))].map((interest, index) => (
                <option key={index} value={interest}>
                  {interest}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Random Quote */}
        {randomQuote && (
          <div className="pdfv-quote">
            <p className="pdfv-quote-text">"{randomQuote.text}"</p>
            <p className="pdfv-quote-author">- {randomQuote.author}</p>
          </div>
        )}
      </div>

      {/* PDF Cards */}
      <div className="row">
        {currentFiles.map((file, index) => (
          <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-3">
            <div className="pdfv-card shadow-sm text-center">
              <div className="pdfv-card-body">
              <img
                  src={`${process.env.PUBLIC_URL}${file.thumbnail}`}
                  alt={`${file.name} Thumbnail`}
                  className="pdfv-card-img-top"
                />
                <h5 className="pdfv-card-title mt-2">{file.name}</h5>
                <p className="pdfv-card-text">{file.description}</p>
                <p><strong>Pages:</strong> {file.pages}</p>
                <p><strong>Interest:</strong> {file.interest}</p>
                <p><strong>Keywords:</strong> {file.keywords}</p>
                <button
                  className="pdfv-btn pdfv-btn-primary"
                  onClick={() => handleDownload(file.filePath)}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pdfv-pagination mt-4 text-center mb-5">
        <ul className="pdfv-pagination-list ">
          <li
            className={`pdfv-page-item ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <button className="pdfv-page-link  me-2">Previous</button>
          </li>
          <li
            className={`pdfv-page-item ${currentPage === totalPages ? "disabled" : ""}`}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <button className="pdfv-page-link">Next</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PDFV;