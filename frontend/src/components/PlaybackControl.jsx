import React, { useState, useEffect, useRef } from "react";
import "../App.css"; // Import the combined CSS file

function PlaybackControl({ messages, onReset }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const playbackRef = useRef(null);

  // Calculate the duration between consecutive timestamps
  const durations = messages
    .map((msg, index) => {
      if (index === 0) return 0;
      return msg.timestamp - messages[index - 1].timestamp;
    })
    .slice(1);

  // Normalize durations to ensure each is at least 1 second
  const normalizedDurations = durations.map((duration) =>
    Math.max(duration, 1000)
  );

  const totalPlaybackTime = normalizedDurations.reduce(
    (sum, duration) => sum + duration,
    0
  );

  useEffect(() => {
    if (isPlaying) {
      playbackRef.current = setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 1000 / playbackSpeed;
          return newTime >= totalPlaybackTime ? totalPlaybackTime : newTime;
        });

        // Update currentMessageIndex based on elapsedTime
        let cumulativeTime = 0;
        for (let i = 0; i < normalizedDurations.length; i++) {
          cumulativeTime += normalizedDurations[i] / playbackSpeed;
          if (elapsedTime < cumulativeTime) {
            setCurrentMessageIndex(i);
            break;
          }
        }
      }, 1000 / playbackSpeed);

      return () => {
        clearInterval(playbackRef.current);
      };
    } else {
      clearInterval(playbackRef.current);
    }
  }, [
    isPlaying,
    playbackSpeed,
    elapsedTime,
    normalizedDurations,
    totalPlaybackTime,
  ]);

  useEffect(() => {
    // Reset playback when messages change
    setIsPlaying(false);
    setCurrentMessageIndex(0);
    setElapsedTime(0);
  }, [messages]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
  };

  const currentMessage = messages[currentMessageIndex];

  return (
    <div className="playbackControlContainer">
      <h3>Playback Control</h3>
      <button className="playbackControlButton" onClick={togglePlayPause}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div>
        <button
          className="playbackControlButton"
          onClick={() => changeSpeed(1)}
        >
          1x
        </button>
        <button
          className="playbackControlButton"
          onClick={() => changeSpeed(2)}
        >
          2x
        </button>
        <button
          className="playbackControlButton"
          onClick={() => changeSpeed(5)}
        >
          5x
        </button>
      </div>
      <progress
        value={elapsedTime}
        max={totalPlaybackTime}
        style={{ width: "100%" }}
      />
      {currentMessage && (
        <div>
          <p>
            Timestamp: {new Date(currentMessage.timestamp).toLocaleString()}
          </p>
          <p>Message: {JSON.stringify(currentMessage.data)}</p>
        </div>
      )}
    </div>
  );
}

export default PlaybackControl;
