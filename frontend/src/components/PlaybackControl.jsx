import React, { useState, useEffect, useRef } from "react";

function PlaybackControl({ messages }) {
  console.log("PlaybackControl", messages);

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

  // Normalize durations to ensure each is at least 1 second
  const totalPlaybackTime = normalizedDurations.reduce(
    (sum, duration) => sum + duration,
    0
  );

  useEffect(() => {
    if (isPlaying) {
      playbackRef.current = setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 1000 / playbackSpeed;
          if (newTime >= totalPlaybackTime) {
            clearInterval(playbackRef.current);
            return totalPlaybackTime;
          }
          return newTime;
        });

        setCurrentMessageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= messages.length) {
            clearInterval(playbackRef.current);
            return prevIndex;
          }
          return nextIndex;
        });
      }, normalizedDurations[currentMessageIndex] / playbackSpeed);
    } else {
      clearInterval(playbackRef.current);
    }

    return () => clearInterval(playbackRef.current);
  }, [isPlaying, playbackSpeed, currentMessageIndex, normalizedDurations]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
  };

  const currentMessage = messages[currentMessageIndex];

  return (
    <div>
      <h3>Playback Control</h3>
      <button onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <div>
        <button onClick={() => changeSpeed(1)}>1x</button>
        <button onClick={() => changeSpeed(2)}>2x</button>
        <button onClick={() => changeSpeed(5)}>5x</button>
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
