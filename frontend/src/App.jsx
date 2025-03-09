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
        <h1 className="app-title">ION Data Viewer</h1>

        <div className="app-container">
          {/* Left column - 1/3 width */}
          <div className="left-column">
            <SessionPanel />
            <RobotPanel />
            <TopicSelect />
          </div>

          {/* Right column - 2/3 width */}
          <div className="right-column">
            <LogConsole />
            <VideoPlayback />
            <RobotView />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
