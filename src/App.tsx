import { useState } from "react";
// import { invoke } from "@tauri-apps/api/tauri";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
// Documentation of react-countdown-circle-timer 
// https://github.com/vydimitrov/react-countdown-circle-timer/tree/master/packages/web#react-countdown-circle-timer


import "./App.css";
//import glassesLogo from "./assets/Glasses.svg";



function App() {

  const [reset, setReset] = useState(false);
  const [remainingTimeState, setRemainingTimeState] = useState(0);
  const [duration] = useState(60 * 60);
  const [initialRemainingTime, setInitialRemainingTime] = useState(0);
  //const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  //const [isDragging, setIsDragging] = useState(false);
  const [relativePosition, setRelativePosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleReset = () => {
    setReset(true);
    console.log("reset the timer.")
    setTimeout(() => {
      setReset(false);
    }, 20);
  };

  const handleMouseDown = (event: any) => {
    event.preventDefault();
    console.log("handleMouseDown")
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    setIsPlaying(false);
    handleReset();
  };

  const handleMouseMove = (event: any) => {
    const targetDiv = document.getElementById("rotater");
    if (!targetDiv) { return; }
    const divRect = targetDiv.getBoundingClientRect();
    const divCenterX = divRect.left + divRect.width / 2;
    const divCenterY = divRect.top + divRect.height / 2;
    const x = event.clientX - divCenterX;
    const y = event.clientY - divCenterY;
    setRelativePosition({ x, y });
    console.log(relativePosition);
    const MouseAngle = Math.atan2(x, y);
    const targetTime = ((-30 / Math.PI) * MouseAngle + 30) * 60;
    setInitialRemainingTime(targetTime);
    handleReset();
    console.log(targetTime);
  };

  const handleMouseUp = (event: any) => {
    event.preventDefault();
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    setIsPlaying(true);
    handleReset();
  };

  const getTransformStyleString = () => {
    const progress = (remainingTimeState - 1) / duration;
    const angle = Math.max(0, progress) * 360;
    const newTranslate = `rotate(${angle}deg)`;
    return newTranslate;
  }

  const getHandColor = () => {
    // return "#6e6050"
    return "#6e705f";
  }

  const handleOnComplete = () => {

    console.log("倒计时完成");
    setIsComplete(true);

    if (Notification.permission === 'granted') {
      // 如果通知权限已授予
      new Notification('系统通知', {
        body: '倒计时完成！'
      });
    } else if (Notification.permission !== 'denied') {
      // 如果通知权限尚未确定
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('系统通知', {
            body: '倒计时完成！'
          });
        }
      });
    }
  }

  const handleOnUpdate = (remainingTimeOnUpdate: number) => {
    setIsComplete(false);
    setRemainingTimeState(remainingTimeOnUpdate);
    console.log("remainingTime:", remainingTimeState);
  }

  return (
    <div className="container">
      <h1>
        {isComplete ? "Take A Break." : "Focus Time."}
      </h1>


      <div className="App">
        <CountdownCircleTimer
          key={reset.toString()} // 重要：当 reset 状态变化时，通过改变 key 来重置倒计时圆盘
          isPlaying={isPlaying}
          duration={duration}
          initialRemainingTime={initialRemainingTime}
          size={240}
          strokeWidth={90}
          trailStrokeWidth={120}
          strokeLinecap={"butt"}
          rotation={"counterclockwise"}
          colors={"#6e805f"}
          onComplete={handleOnComplete}
          onUpdate={handleOnUpdate}
        >
          {() => {
            return (
              <div id="rotater"
                style={{
                  transform: getTransformStyleString(),
                  transition: "transform 1s linear",
                }}>
                <div id="dot"
                  style={{
                    position: "relative",
                    width: "10px",
                    height: "25px",
                    bottom: "100px",
                    borderRadius: "10px 10px 3px 3px",
                    background: getHandColor(),
                  }}
                  onMouseDown={handleMouseDown}
                >
                  <div id="hand"
                    style={{
                      position: "relative",
                      width: "4px",
                      height: "105px",
                      left: "3px",
                      borderRadius: "5px",
                      background: getHandColor(),
                    }}
                  />
                </div>
              </div>
            )
          }}
        </CountdownCircleTimer>
      </div >

      <div style={{ paddingTop: "30px" }}>
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
          {Math.floor(remainingTimeState / 60)}:{remainingTimeState % 60 < 10 ? `0${remainingTimeState % 60}` : remainingTimeState % 60}
        </div>
      </div>

    </div >
  );
}

export default App;
