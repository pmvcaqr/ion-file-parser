import React from "react";
import SessionPanel from "./components/SessionPanel";
import RobotPanel from "./components/RobotPanel";
import "./App.css";

function App() {
  return (
    <div>
      <h1>ION Data Viewer</h1>
      <SessionPanel />
      {/* <RobotPanel /> */}
    </div>
  );
}

export default App;
