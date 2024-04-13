"use client";

import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

import { AuthContext } from "@/context/AuthProvider";
import SkeletonLoader from "../loader/Skeleton";
import SongItem from "../songs/SongItem";
import api from "@/utils/request";
import { Message } from "@/types/message";

const disableStyle =
  "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 border-b-2 border-transparent rounded-t-lg";
const activeStyle =
  "text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500";

function SendMessage() {
  const { loggedUser, activeUser, roomId, setAllRoomChats, allRoomChats } =
    useContext(AuthContext);
  const [feelMode, setFeelMode] = useState(false);
  const [feelTab, setFeelTab] = useState("songs");
  const [song, setSong] = useState("Never gonna give you up");
  const [songs, setSongs] = useState([] as any[]);
  const [currentSong, setCurrentSong] = useState({} as any);
  const [timestamp, setTimestamp] = useState(0);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  // camera
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [stream, setStream] = useState<any>(null);

  useEffect(() => {
    if (feelTab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [feelTab]);

  // Function to start the camera and stream video
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.style.display = "block";
        setStream(stream);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      console.log("Stopping camera");
      const tracks = stream.getTracks();
      tracks.forEach((track: any) => track.stop());
      setStream(null); // Clear the stream state
      setImageDataUrl(null); // Clear the image data URL
    }
  };

  // Function to capture a photo from the video stream
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");
      setImageDataUrl(imageDataUrl);
      videoRef.current.style.display = "none";
    }
  };

  // song

  useEffect(() => {
    if (!song || !feelMode) return;
    let timeout = setTimeout(() => {
      clearTimeout(timeout);
      fetchSong();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [song]);

  useEffect(() => {
    if (!feelMode) {
      setSongs([]);
    }
  }, [feelMode]);

  function assignCurrentSong(song: any) {
    setCurrentSong(song);
  }

  function saveTimestamp(t: number) {
    setTimestamp(t);
  }

  const fetchSong = async () => {
    try {
      setLoader(true);
      const res = await fetch("/api/songs", {
        method: "POST",
        body: JSON.stringify({ song }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.status) setSongs(data.songs);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!loggedUser) return toast.error("Please login first");
    if (!message) return toast.error("Please enter a message");
    if (!activeUser) return toast.error("Please select a user");
    if (!roomId) return toast.error("Please select a room");

    const payload: Message = {
      message,
      to: activeUser,
      from: loggedUser,
      room_code: roomId,
    };

    if (feelMode && feelTab === "songs") {
      payload.feel_mode = feelMode;
      payload.feel_data = {
        type: "song",
        data: {
          song: currentSong,
          timestamp: timestamp,
        },
      };
    }

    if (feelMode && feelTab === "camera" && imageDataUrl) {
      // const res = await api.uploadPhoto(imageDataUrl);
      // console.log(res, "upload photo response");
      payload.feel_mode = feelMode;
      payload.feel_data = {
        type: "camera",
        data: {
          image: imageDataUrl,
        },
      };
    }

    const { data, error } = await api.sendMessage(payload);

    setMessage("");
    setSong("");
    setCurrentSong({} as any);
    setTimestamp(0);
    setFeelMode(false);
    setFeelTab("songs");
    setSongs([]);
    setImageDataUrl(null);
    setShowEmoji(false);
  };

  return (
    <form
      className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4 relative"
      onSubmit={sendMessage}
    >
      <div className="flex-grow ml-4">
        <div className="relative w-full">
          <input
            type="text"
            className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
            onChange={(e) => {
              if (feelMode) {
                if (feelTab === "songs") {
                  setSong(e.target.value);
                }
              }
              setMessage(e.target.value);
            }}
            value={message}
          />
          <button
            className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
            type="button"
            role="button"
            onClick={() => setShowEmoji(!showEmoji)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>

        {showEmoji && !feelMode && (
          <div className="absolute bottom-16 right-0">
            <EmojiPicker
              onEmojiClick={(emojiObject) => {
                setMessage(message + emojiObject.emoji);
              }}
            />
          </div>
        )}
      </div>
      <div className="ml-4 flex items-center">
        {/* feel chat */}
        <label className="flex items-center me-5 cursor-pointer">
          <span className="me-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {feelMode ? "Feel Mode 😎" : "Normal Mode 😏"}
          </span>
          <input
            type="checkbox"
            checked={feelMode}
            className="sr-only peer"
            onChange={() => {
              setFeelMode(!feelMode);
              setShowEmoji(false);
            }}
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600" />
        </label>

        <button
          className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
          type="submit"
        >
          <span>Send</span>
          <span className="ml-2">
            <svg
              className="w-4 h-4 transform rotate-45 -mt-px"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </span>
        </button>
      </div>

      {/* feel mode options */}
      {feelMode && (
        <div className="absolute right-0 bottom-24 w-[30rem]">
          <div className="max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 h-auto w-full overflow-y-scroll">
            <div className="text-sm w-full font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 relative h-full">
              <ul className="flex -mb-px sticky top-0 bg-white z-10 shadow-sm">
                <li className="me-2 w-full">
                  <a
                    href="#"
                    className={`inline-block p-4 w-full ${
                      feelTab === "songs" ? activeStyle : disableStyle
                    }`}
                    onClick={() => setFeelTab("songs")}
                  >
                    Songs
                  </a>
                </li>

                <li className="me-2 w-full">
                  <a
                    href="#"
                    className={`inline-block p-4  w-full ${
                      feelTab === "camera" ? activeStyle : disableStyle
                    }`}
                    onClick={() => setFeelTab("camera")}
                  >
                    Camera
                  </a>
                </li>
              </ul>

              {feelTab === "songs" && (
                <div className="">
                  <h6 className=" py-2 font-bold text-sm">Suggested Songs</h6>
                  {loader ? (
                    <SkeletonLoader />
                  ) : (
                    <ul>
                      {songs.map((song) => (
                        <SongItem
                          key={song.name}
                          id={song.name}
                          song={song}
                          currentSong={currentSong}
                          setCurrentSong={assignCurrentSong}
                          saveTimestamp={saveTimestamp}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {feelTab === "camera" && (
                <div>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{
                      width: "100%",
                    }}
                  />

                  {/* preview */}
                  {imageDataUrl && (
                    <div>
                      <img
                        src={imageDataUrl}
                        alt="Captured"
                        style={{ maxWidth: "100%", marginTop: "20px" }}
                      />
                    </div>
                  )}

                  {imageDataUrl ? (
                    <button
                      className=" bg-red-600 rounded-md text-white p-2 m-2"
                      type="button"
                      role="button"
                      onClick={() => {
                        stopCamera();
                        setTimeout(() => {
                          startCamera();
                        }, 1000);
                      }}
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      className=" bg-blue-600 rounded-md text-white p-2 m-2"
                      type="button"
                      role="button"
                      onClick={capturePhoto}
                    >
                      Capture Photo
                    </button>
                  )}

                  <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export default SendMessage;
