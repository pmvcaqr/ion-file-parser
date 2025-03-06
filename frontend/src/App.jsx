import React from "react";
import SessionPanel from "./components/SessionPanel";
import RobotPanel from "./components/RobotPanel";
import "./App.css";
import TopicSelect from "./components/TopicSelect";
import LogConsole from "./components/LogConsole";
import VideoPlayback from "./components/VideoPlayback";
function App() {
  return (
    <div>
      <h1>ION Data Viewer</h1>
      {/* <SessionPanel /> */}
      {/* <RobotPanel /> */}
      {/* <TopicSelect /> */}
      {/* <LogConsole /> */}
      <VideoPlayback />
    </div>
  );
}

export default App;
