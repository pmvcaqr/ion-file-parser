import React, { useEffect, useState } from "react";
import { JsonEditor, githubDarkTheme } from "json-edit-react";

function RobotPanel() {
  const [robotData, setRobotData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/robot")
      .then((response) => response.json())
      .then((data) => setRobotData(data))
      .catch((error) => console.error("Error fetching robot data:", error));
  }, []);

  if (!robotData) {
    return null;
  }

  return (
    <div className="topicSelectContainer">
      <h2 className="topicSelectHeading">Robot Information</h2>
      <JsonEditor
        collapse={true}
        data={robotData}
        viewOnly={true}
        rootName="robotData"
        theme={githubDarkTheme}
      />
    </div>
  );
}

export default RobotPanel;
