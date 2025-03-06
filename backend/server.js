const express = require("express");
const cors = require("cors");
const {
  parseIonFile,
  getBotInfo,
  getSessionInfo,
  getBotModel,
  getAllTopics,
  getTopicByName,
  getTopicByType,
} = require("./ionParser");
const app = express();
const PORT = 3000;

// Use CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
  })
);

// File path for the ION log data
const ionFilePath = "./data/OhmniClean_log.ion";

// Endpoint to get session data
app.get("/api/session", (req, res) => {
  try {
    const parsedData = parseIonFile(ionFilePath);
    const sessionInfo = getSessionInfo(parsedData);
    res.json(sessionInfo);
  } catch (error) {
    console.error("Error parsing session data:", error);
    res.status(500).json({ error: "Failed to parse session data" });
  }
});

// Endpoint to get robot data
app.get("/api/robot", (req, res) => {
  try {
    const parsedData = parseIonFile(ionFilePath);
    const botInfo = getBotInfo(parsedData);
    res.json(botInfo);
  } catch (error) {
    console.error("Error parsing robot data:", error);
    res.status(500).json({ error: "Failed to parse robot data" });
  }
});

// Endpoint to get bot model data
app.get("/api/botModel", (req, res) => {
  try {
    const parsedData = parseIonFile(ionFilePath);
    const botModel = getBotModel(parsedData);
    res.json(botModel);
  } catch (error) {
    console.error("Error parsing bot model data:", error);
    res.status(500).json({ error: "Failed to parse bot model data" });
  }
});

// Endpoint to get all topics
app.get("/api/topics", (req, res) => {
  try {
    const parsedData = parseIonFile(ionFilePath);
    const topics = getAllTopics(parsedData);
    res.json(topics);
  } catch (error) {
    console.error("Error parsing topics:", error);
    res.status(500).json({ error: "Failed to parse topics" });
  }
});

// Endpoint to get a specific topic by name
app.get("/api/topic/:name", (req, res) => {
  try {
    const parsedData = parseIonFile(ionFilePath);
    const topic = getTopicByName(parsedData, req.params.name);
    res.json(topic);
  } catch (error) {
    console.error("Error parsing topic by name:", error);
    res.status(500).json({ error: "Failed to parse topic by name" });
  }
});

// Endpoint to get a specific topic by type "sensor_msgs/CompressedImage"
app.get("/api/topicByType", (req, res) => {
  try {
    const parsedData = parseIonFile(ionFilePath);
    const topic = getTopicByType(parsedData);
    res.json(topic);
  } catch (error) {
    console.error("Error parsing topic by type:", error);
    res.status(500).json({ error: "Failed to parse topic by type" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
