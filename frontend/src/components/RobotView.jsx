import React, { useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Suspense } from "react";
import { decompressObjBrowser } from "../helper";

// Component to render the 3D model
function RobotModel({ objString, positionData = [], isPlaying }) {
  const [index, setIndex] = useState(0);
  const [model, setModel] = useState(null);

  // Parse the OBJ string into a 3D model
  useEffect(() => {
    if (objString) {
      const loader = new OBJLoader();
      const parsedObj = loader.parse(objString);
      setModel(parsedObj);
    }
  }, [objString]);

  // Handle position & rotation animation based on position data
  useFrame((state, delta) => {
    if (model && positionData.length > 0 && isPlaying) {
      // Update index based on time
      setIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % positionData.length;
        return newIndex;
      });

      // Get the current position data
      const pos = positionData[index];
      if (pos) {
        // Transform coordinates from ROS to Three.js
        model.position.set(pos.x, pos.z, -pos.y);
        model.rotation.y = -pos.yaw;
      }
    }
  });

  return model ? (
    <primitive
      object={model}
      scale={[0.1, 0.1, 0.1]}
      castShadow
      receiveShadow
    />
  ) : null;
}

function RobotView() {
  const [objString, setObjString] = useState(null);
  const [positionData, setPositionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Fetch the compressed model data
    fetch("http://localhost:3000/api/botModel")
      .then((response) => response.json())
      .then((data) => {
        // Decompress the model data
        const result = decompressObjBrowser(data.data);
        if (result.success) {
          setObjString(result.objString);
        } else {
          setError("Failed to decompress model: " + result.error);
        }
      })
      .catch((error) => {
        setError("Error fetching model: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });

    // Fetch the position data
    fetch("http://localhost:3000/api/topic//tb_control/wheel_odom")
      .then((response) => response.json())
      .then((data) => {
        const mappedData = data.messages.map((msg) => ({
          timestamp: msg.timestamp,
          x: msg.data.pose.pose.position.x || 0,
          y: msg.data.pose.pose.position.y || 0,
          z: msg.data.pose.pose.position.z || 0,
          yaw: extractYawFromQuaternion(
            msg.data.pose.pose.orientation.x,
            msg.data.pose.pose.orientation.y,
            msg.data.pose.pose.orientation.z,
            msg.data.pose.pose.orientation.w
          ),
        }));

        setPositionData(mappedData);
      })
      .catch((error) => console.error("Error fetching position data:", error));
  }, []);

  function extractYawFromQuaternion(x, y, z, w) {
    return Math.atan2(2.0 * (w * z + x * y), 1.0 - 2.0 * (y * y + z * z));
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading) return <div>Loading model data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ width: "100%", height: "500px", position: "relative" }}>
      {/* Play/Pause Button */}
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          bottom: "20px",
          left: "20px",
          padding: "10px",
          backgroundColor: "rgba(0,0,0,0.6)",
          borderRadius: "8px",
        }}
      >
        <button
          onClick={togglePlayPause}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        {/* Environment */}
        <Environment preset="sunset" />

        {/* Ground plane */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.5, 0]}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <shadowMaterial opacity={0.4} />
        </mesh>

        {/* Grid helper */}
        <gridHelper args={[100, 100]} />

        {/* Robot model */}
        <Suspense fallback={null}>
          {objString && (
            <RobotModel
              objString={objString}
              positionData={positionData}
              isPlaying={isPlaying}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default RobotView;
