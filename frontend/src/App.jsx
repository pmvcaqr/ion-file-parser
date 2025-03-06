import React from "react";
import SessionPanel from "./components/SessionPanel";
import RobotPanel from "./components/RobotPanel";
import "./App.css";
import TopicSelect from "./components/TopicSelect";
import LogConsole from "./components/LogConsole";
import VideoPlayback from "./components/VideoPlayback";
import RobotView from "./components/RobotView";
import { useErrorBoundary } from "use-error-boundary";

function App() {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary();
  return didCatch ? (
    <div>{error.message}</div>
  ) : (
    <ErrorBoundary>
      <div>
        <h1>ION Data Viewer</h1>
        <SessionPanel />
        {/* <RobotPanel />
      <TopicSelect />
      <LogConsole />
      <VideoPlayback /> */}
        <RobotView />
      </div>
    </ErrorBoundary>
  );
}

export default App;
