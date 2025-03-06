import React from "react";
import SessionPanel from "./components/SessionPanel";
import RobotPanel from "./components/RobotPanel";
import "./App.css";
import TopicSelect from "./components/TopicSelect";
import LogConsole from "./components/LogConsole";
function App() {
  return (
    <div>
      <h1>ION Data Viewer</h1>
      {/* <SessionPanel /> */}
      {/* <RobotPanel /> */}
      {/* <TopicSelect /> */}
      <LogConsole />
    </div>
  );
}

export default App;
