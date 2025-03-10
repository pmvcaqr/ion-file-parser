import React, { useState, useEffect } from "react";
import "../App.css"; // Import the combined CSS file

function LogConsole() {
  const [messages, setMessages] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/topic//rosout_agg")
      .then((response) => response.json())
      .then((data) => setMessages(data.messages))
      .catch((error) => console.error("Error fetching log messages:", error));
  }, []);

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const filteredMessages = messages.filter((message) =>
    message.data.msg.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="topicSelectContainer">
      <h2 className="topicSelectHeading">Log Console</h2>
      <input
        type="text"
        placeholder="Filter messages"
        value={filterText}
        onChange={handleFilterChange}
        style={{ width: "90%", marginBottom: "10px" }}
      />
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {filteredMessages.map((message, index) => (
          <div key={index} className="logMessage">
            <p className="logTimestamp">
              {new Date(message.timestamp).toLocaleString()}
            </p>
            <p className="logText">{message.data.msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogConsole;
