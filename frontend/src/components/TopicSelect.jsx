import React, { useState, useEffect } from "react";
import "../App.css"; // Import the combined CSS file
import PlaybackControl from "./PlaybackControl";

function TopicSelect() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/topics")
      .then((response) => response.json())
      .then((data) => setTopics(data))
      .catch((error) => console.error("Error fetching topics:", error));
  }, []);

  const handleTopicChange = (event) => {
    const topicName = event.target.value;
    setSelectedTopic(topicName);

    fetch(`http://localhost:3000/api/topic/${topicName}`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data.messages);
      })
      .catch((error) => console.error("Error fetching topic messages:", error));
  };

  return (
    <div className="topicSelectContainer">
      <h2 className="topicSelectHeading">Select a Topic</h2>
      <select
        className="topicSelect"
        onChange={handleTopicChange}
        value={selectedTopic || ""}
      >
        <option value="" disabled>
          Select a topic
        </option>
        {topics.map((topicName) => (
          <option key={topicName} value={topicName}>
            {topicName}
          </option>
        ))}
      </select>
      {messages.length > 0 && (
        <PlaybackControl messages={messages} onReset={() => setMessages([])} />
      )}
    </div>
  );
}

export default TopicSelect;
