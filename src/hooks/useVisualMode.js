import React, { useState } from "react";


// custom hook to help with setting different modes of the application
export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // transition the mode of app 
  const transition = (newMode, replace = false) => {

    if (replace) {

      const newHistory = [...history.slice(0, history.length - 1), newMode];
      setMode(newMode);
      setHistory(newHistory);

    } else {
      const newHistory = [...history, newMode];

      setMode(newMode);
      setHistory(newHistory);
    }

  };

  // going back to previous mode of app 
  const back = () => {

    if (history.length > 1) { // Limit to not get before the initial mode

      const newHistory = [...history.slice(0, history.length - 1)];

      const prevMode = newHistory[newHistory.length - 1];

      setMode(prevMode);
      setHistory(newHistory);
    }
  };

  return { mode, transition, back };

}