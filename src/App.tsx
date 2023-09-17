import { useState, useEffect } from "react";
// import { invoke } from "@tauri-apps/api/tauri";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import "./App.css";

import glassesLogo from "./assets/Glasses.svg";



function App() {

  const [reset, setReset] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const handleReset = () => {
    setReset(true);
    setTimeout(() => {
      setReset(false);
    }, 100);
  };

  const dotNewTranslate = (progress: number) => {
    const angle = progress * 2 * Math.PI-Math.PI/2;
    const radius = 105;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const newTranslate = `translate(${x}px, ${y}px)`
    return newTranslate
  }

  return (
    <div className="container">
      <h1>Close your eyes!</h1>

      <div className="row">
        <img src={glassesLogo} className="logo glasses" alt="glasses logo"></img>
      </div>

      <div className="App">
        <CountdownCircleTimer
          key={reset.toString()} // 重要：当 reset 状态变化时，通过改变 key 来重置倒计时圆盘
          isPlaying={!reset}
          duration={60}
          initialRemainingTime={50}
          size={240}
          strokeWidth={90}
          trailStrokeWidth={120}
          strokeLinecap={"butt"}
          rotation={"counterclockwise"}
          colors={"#6e805f"}
          onComplete={() => console.log("倒计时完成")}
          onUpdate={(remainingTimeOnUpdate) => {
            setRemainingTime(remainingTimeOnUpdate);
          }}
        >
          {({ remainingTime }) => (
            <div
              id="dot"
              style={{
                position: "relative",
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                background: "#6e805f",
                zIndex: "1",
                transform: dotNewTranslate((remainingTime-1) / 60),
                transition: "transform 1s linear",
              }}
            />
          )}


        </CountdownCircleTimer>
      </div >

      <div style={{ paddingTop: "30px" }}>
        <div>
          {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? `0${remainingTime % 60}` : remainingTime % 60}
        </div>
        <button onClick={handleReset}>
          重置倒计时
        </button>
      </div>



      <div className="App">
        <p>Close your eyes, rest for 30 seconds, and relax.</p>
      </div>

    </div>
  );
}

export default App;
