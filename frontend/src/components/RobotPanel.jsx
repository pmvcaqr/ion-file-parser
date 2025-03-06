import React, { useEffect, useState } from "react";

function RobotPanel() {
  const [robotData, setRobotData] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/api/robot")
      .then((response) => response.json())
      .then((data) => setRobotData(data))
      .catch((error) => console.error("Error fetching robot data:", error));
  }, []);

  return (
    <div>
      <h2>Robot Information</h2>
      <pre>{JSON.stringify(robotData, null, 2)}</pre>
    </div>
  );
}

export default RobotPanel;
