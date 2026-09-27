"use client"
import React, { useEffect, useRef, useState } from "react";
import { Hands, Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

const GestureControl: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [cameraAvailable, setCameraAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if camera is available
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const hasCamera = devices.some((d) => d.kind === "videoinput");
        setCameraAvailable(hasCamera);
      })
      .catch(() => setCameraAvailable(false));
  }, []);

  useEffect(() => {
    if (cameraAvailable === null || !cameraAvailable) return;
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Create floating cursor
    const cursor = document.createElement("div");
    cursor.style.position = "fixed";
    cursor.style.width = "20px";
    cursor.style.height = "20px";
    cursor.style.background = "red";
    cursor.style.borderRadius = "50%";
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex = "9999";
    document.body.appendChild(cursor);
    cursorRef.current = cursor;

    const hands = new Hands({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results: Results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];

        const indexTip = landmarks[8];
        const middleTip = landmarks[12];

        // Cursor movement
        const x = indexTip.x * window.innerWidth;
        const y = indexTip.y * window.innerHeight;
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;

        // Scroll
        if (indexTip.y < landmarks[6].y) {
          window.scrollBy(0, -10);
        } else if (indexTip.y > landmarks[6].y + 0.1) {
          window.scrollBy(0, 10);
        }

        // Two-finger click
        const distance = Math.sqrt(
          Math.pow(indexTip.x - middleTip.x, 2) +
            Math.pow(indexTip.y - middleTip.y, 2)
        );
        if (distance < 0.05) {
          const el = document.elementFromPoint(x, y);
          if (el) (el as HTMLElement).click();
        }
      }
    });

    // Start camera if available
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    return () => {
      camera.stop();
      cursor.remove();
    };
  }, [cameraAvailable]);

  if (cameraAvailable === null) {
    return <p>🔍 Checking for camera...</p>;
  }

  if (cameraAvailable === false) {
    return <p>❌ No camera detected or permission denied.</p>;
  }

  return <video ref={videoRef} style={{ display: "none" }} />;
};

export default GestureControl;
