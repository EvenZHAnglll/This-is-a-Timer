import { useState, useEffect } from "react";
// import { invoke } from "@tauri-apps/api/tauri";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import "./App.css";

import glassesLogo from "./assets/Glasses.svg";


const getTimeSeconds = (time: number) => (60 - time) | 0;

const minuteSeconds = 60;
const timerProps = {
  isPlaying: true,
  size: 220,
  strokeWidth: 42
};

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


  const stratTime = Date.now() / 1000; // use UNIX timestamp in seconds
  const endTime = stratTime + 243248; // use UNIX timestamp in seconds

  const remainingTime = endTime - stratTime;

  return (
    <div className="container">
      <h1>Close your eyes!</h1>

      <div className="row">
        <img src={glassesLogo} className="logo glasses" alt="glasses logo"></img>


      </div>
      <div className="App">
        <CountdownCircleTimer
          {...timerProps}
          colors={"#6e805f"}
          duration={minuteSeconds}
          initialRemainingTime={4 % minuteSeconds}
          onComplete={(totalElapsedTime) => ({
            shouldRepeat: remainingTime - totalElapsedTime > 0
          })}
        >
          {({ elapsedTime, color }) => (
            <span style={{fontSize:24}}>
              {count}/{getTimeSeconds(elapsedTime)}
            </span>
          )}
        </CountdownCircleTimer>
      </div>
      <div className="App">


        <p>Close your eyes, rest for 30 seconds, and relax.</p>
        


      </div>
    </div>
  );
}

export default App;
