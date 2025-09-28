// src/components/Timer.tsx
import React, { useState, useEffect } from "react";

interface Props {
  seconds: number;
  onTimeUp: () => void;
}

const Timer: React.FC<Props> = ({ seconds, onTimeUp }) => {
  const [time, setTime] = useState<number>(seconds);

  useEffect(() => {
    if (time <= 0) {
      onTimeUp();
      return;
    }
    const id = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [time]);

  return <p>⏳ Time Left: {time}s</p>;
};

export default Timer;
