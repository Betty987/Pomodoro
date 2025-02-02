import { useState, useEffect } from "react";

const PomodoroTimer = () => {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [time, setTime] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  // Update time when workMinutes or breakMinutes change
  useEffect(() => {
    if (!isRunning) {
      setTime(onBreak ? breakMinutes * 60 : workMinutes * 60);
    }
  }, [workMinutes, breakMinutes, onBreak, isRunning]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      playSound();
      setIsRunning(false);
      if (!onBreak) {
        setOnBreak(true);
        setTime(breakMinutes * 60);
        setSessionCount((prev) => prev + 1);
      } else {
        setOnBreak(false);
        setTime(workMinutes * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, time, breakMinutes, onBreak, workMinutes]);

  const playSound = () => {
    const audio = new Audio("/alarm.mp3");
    audio.play();
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setOnBreak(false);
    setTime(workMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-6">🍅 Pomodoro Timer</h1>

      {/* Timer UI with Circular Progress */}
      <div className="relative flex items-center justify-center w-48 h-48 mb-6">
        <svg className="absolute transform -rotate-90" width="100%" height="100%" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="6" fill="transparent" />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="white"
            strokeWidth="6"
            strokeDasharray={Math.PI * 90}
            strokeDashoffset={(time / (onBreak ? breakMinutes * 60 : workMinutes * 60)) * Math.PI * 90}
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-4xl font-bold">{formatTime(time)}</p>
      </div>

      <h2 className="text-2xl mb-4">{onBreak ? "Break Time 🧘‍♀️" : "Work Time 🚀"}</h2>

      {/* Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={toggleTimer}
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-md transition duration-300"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-md transition duration-300"
        >
          Reset
        </button>
      </div>

      {/* Custom Inputs */}
      <div className="flex space-x-4">
        <div>
          <label className="block text-sm">Work Minutes</label>
          <input
            type="number"
            min="1"
            value={workMinutes}
            onChange={(e) => setWorkMinutes(Number(e.target.value))}
            className="w-16 p-2 text-black rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Break Minutes</label>
          <input
            type="number"
            min="1"
            value={breakMinutes}
            onChange={(e) => setBreakMinutes(Number(e.target.value))}
            className="w-16 p-2 text-black rounded"
          />
        </div>
      </div>

      <p className="mt-6 text-lg">Completed Sessions: {sessionCount} ✅</p>
    </div>
  );
};

export default PomodoroTimer;
