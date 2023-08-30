import { useState, useEffect } from "react";
// import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

import glassesLogo from "./assets/Glasses.svg";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => {
        if (prevCount >= 20) {
          return 0; // 清空计数器
        } else {
          return prevCount + 1; // 递增计数器
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="container">
      <h1>Close your eyes!</h1>

      <div className="row">
        <img src={glassesLogo} className="logo glasses" alt="glasses logo"></img>

      </div>
      <p>Close your eyes, rest for 30 seconds, and relax.</p>
      <p>{count}</p>

    </div>
  );
}

export default App;
