import React, { useState, useEffect, useRef } from "react";

function VideoPlayback() {
  const [frames, setFrames] = useState([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/topicVideo")
      .then((response) => response.json())
      .then((data) => {
        const frames = data.messages.map((message) => {
          return {
            timestamp: message.timestamp,
            data: message.data.data, // This is the base64-encoded image data
          };
        });
        setFrames(frames);
      })
      .catch((error) => console.error("Error fetching video frames:", error));
  }, []);

  useEffect(() => {
    if (isPlaying) {
      playbackRef.current = setInterval(() => {
        setCurrentFrameIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= frames.length) {
            clearInterval(playbackRef.current);
            return prevIndex;
          }
          return nextIndex;
        });
      }, 1000); // Adjust interval based on frame rate
    } else {
      clearInterval(playbackRef.current);
    }

    return () => clearInterval(playbackRef.current);
  }, [isPlaying, frames]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentFrame = frames[currentFrameIndex];
  const imageUrl = currentFrame ? currentFrame.data : null;

  return (
    <div>
      <h2>Video Playback</h2>
      <button onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <div>
        {imageUrl && (
          <img src={imageUrl} alt="Camera View" style={{ width: "100%" }} />
        )}
      </div>
    </div>
  );
}

export default VideoPlayback;
