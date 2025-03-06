import React, { useEffect, useState } from "react";
import { JsonEditor, githubDarkTheme } from "json-edit-react";

function SessionPanel() {
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/topic//LUVcontroller/event_notifier")
      .then((response) => response.json())
      .then((data) => setSessionData(data))
      .catch((error) => console.error("Error fetching session data:", error));
  }, []);

  if (!sessionData) {
    return null;
  }

  return (
    <div>
      <h2>Session Information</h2>
      <JsonEditor
        collapse={true}
        data={sessionData}
        viewOnly={true}
        rootName="sessionData"
        theme={githubDarkTheme}
      />
    </div>
  );
}

export default SessionPanel;
