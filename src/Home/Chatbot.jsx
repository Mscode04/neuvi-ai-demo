import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Chatbot.css";
import { ArrowBack } from "@mui/icons-material";

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const memoryData = {
    company: "Neuraq Technologies is a leading tech company focused on innovation, digital solutions, and transformative applications.",
    team: "Our Team: CEO - Mohammed Shaheen KP, Cofounders - Mohammed Mazin, Mohammed Shemeem.",
    services: `We offer various services:
      - Developer Internship (4-5 months, ₹249 INR)
      - NeuAI Training (4 weeks, ₹999 INR)
      - Website Development & Digital Solutions
      - Mobile App Development
      - Tech Skill Training
      - Online Degrees
      Let's shape the future together!`
  };

  useEffect(() => {
    const initialMessages = [
      { text: `Hey, I’m NeuAI from Neuraq Technologies, your personal AI tech friend! Ask me anything about tech, gadgets, coding, or the digital world. Let's chat!`, sender: "bot" }
    ];
    setMessages(initialMessages);
  }, []);
  
  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    let botResponse = "";

    if (input.toLowerCase().includes("neuraq")) {
      botResponse = memoryData.company;
    } else if (input.toLowerCase().includes("team")) {
      botResponse = memoryData.team;
    } else if (input.toLowerCase().includes("services")) {
      botResponse = memoryData.services;
    } else {
      try {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAjCdcrH_Ciocxb-UbcaMhCvoH6jH-7kug",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `As a tech expert, provide concise and engaging insights about technology, coding, gadgets, or digital trends. Keep it short (1 paragraph, max 250 characters). Answer the following query: ${input}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
      } catch (error) {
        console.error("Error fetching response:", error);
        botResponse = "Error: Unable to fetch response. Try again later.";
      }
    }

    setMessages((prevMessages) => [...prevMessages, { text: botResponse, sender: "bot" }]);
    setInput("");
  };

  return (
    <div className="chatbot-container">
      <div className="app-bar">
        <h1 className="app-title">NeuAI</h1>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <strong>{msg.sender === "user" ? "You: " : "NeuAI: "}</strong>
            {msg.sender === "bot" ? (
              <div className="bot-response">
                {msg.text.split("\n").map((line, i) => (
                  <p key={i} style={{color:"#e6ffd9"}}>{line}</p>
                ))}
              </div>
            ) : (
              msg.text
            )}
          </div>
        ))}
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about tech!"
          onKeyDown={(e) => e.key === "Enter" && handleSend()} 
        />
        <button onClick={handleSend}>
          <i className="fas fa-paper-plane"></i> 
        </button>
      </div>
    </div>
  );
}

export default Chatbot;