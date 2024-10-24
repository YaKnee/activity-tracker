// hooks/useTimer.js
import { useState, useEffect } from "react";

const useTimer = (initialStartTime = null) => {
  const [timerState, setTimerState] = useState({
    active: false,
    startTime: initialStartTime,
    endTime: null,
    totalActiveDuration: 0,
    activeDuration: 0,
  });

  useEffect(() => {
    let timer;
    if (timerState.active) {
      timer = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now - timerState.startTime) / 1000);
        setTimerState(prev => ({
          ...prev,
          activeDuration: elapsed,
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerState.active, timerState.startTime]);

  const toggleActive = () => {
    const now = new Date();
    setTimerState(prevState => {
      if (prevState.active) {
        return {
          ...prevState,
          active: false,
          endTime: now,
          totalActiveDuration: prevState.totalActiveDuration + prevState.activeDuration,
          activeDuration: 0,
        };
      } else {
        return {
          ...prevState,
          active: true,
          startTime: now,
          endTime: null,
        };
      }
    });
  };

  return { timerState, toggleActive, setTimerState };
};

export default useTimer;
