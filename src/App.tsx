import { useState } from "react";
// import { invoke } from "@tauri-apps/api/tauri";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
// Documentation of react-countdown-circle-timer 
// https://github.com/vydimitrov/react-countdown-circle-timer/tree/master/packages/web#react-countdown-circle-timer


import "./App.css";
//import glassesLogo from "./assets/Glasses.svg";

interface Vector2 {
  x: number;
  y: number;
};

let targetDivPosition: Vector2 | null = null;

function getTargetDivPosition(): Vector2 | null {
  if (targetDivPosition === null) {
    const targetDivElement = document.getElementById("rotater");
    if (!targetDivElement) { return null; }
    const targetDiv = targetDivElement.getBoundingClientRect();
    if (targetDiv === null) { return null; }
    targetDivPosition = {
      x: targetDiv.left + targetDiv.width / 2,
      y: targetDiv.top + targetDiv.height / 2
    }
    return targetDivPosition;
  } else {
    return targetDivPosition;
  }
};


function App() {

  const [reset, setReset] = useState(false);
  const [remainingTimeState, setRemainingTimeState] = useState(0);
  const [duration] = useState(60 * 60);
  const [initialRemainingTime, setInitialRemainingTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
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
    setIsDragging(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    setIsPlaying(false);
  };

  const handleMouseMove = (event: any) => {
    const divRectPosition = getTargetDivPosition();
    if (divRectPosition === null) { return; }
    const x = event.clientX - divRectPosition.x;
    const y = event.clientY - divRectPosition.y;
    const MouseAngle = Math.atan2(x, y);
    const targetTime = ((-30 / Math.PI) * MouseAngle + 30) * 60;// 这个60要换成 duration
    setInitialRemainingTime(targetTime);
    handleReset();
    console.log(targetTime);
  };

  const handleMouseUp = (event: any) => {
    event.preventDefault();
    setIsDragging(false);
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
  }

  return (
    <div className="container">
      <h1>
        It's a Timer.
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
