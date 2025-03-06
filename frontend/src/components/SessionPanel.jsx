import React, { useEffect, useState } from "react";

function SessionPanel() {
  const [sessionData, setSessionData] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/api/session")
      .then((response) => response.json())
      .then((data) => setSessionData(data))
      .catch((error) => console.error("Error fetching session data:", error));
  }, []);

  return (
    <div>
      <h2>Session Information</h2>
      <pre>{JSON.stringify(sessionData, null, 2)}</pre>
    </div>
  );
}

export default SessionPanel;
