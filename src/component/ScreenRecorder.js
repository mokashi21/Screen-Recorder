import React, { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

const ScreenRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });

        const storageRef = ref(storage, `recordings/${Date.now()}.webm`);
        uploadBytes(storageRef, blob)
          .then(() => {
            console.log("Upload complete!");
            recordedChunksRef.current = [];
            setRecording(false);
          })
          .catch((error) => {
            console.error("Upload error:", error);
          });
      };

      setStream(mediaStream);
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setStream(null);
    }
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <div>
      <video
        className="w-full mb-10"
        style={{ backgroundColor: "#000" }}
        src={stream}
        autoPlay
        controls
      />
      {!recording ? (
        <Button
          variant="contained"
          color="primary"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={startRecording}
        >
          Start Recording
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={stopRecording}
        >
          Stop Recording
        </Button>
      )}
    </div>
  );
};

export default ScreenRecorder;
