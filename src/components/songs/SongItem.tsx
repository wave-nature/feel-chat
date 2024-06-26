import { useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

function SongItem({
  song,
  id,
  currentSong,
  setCurrentSong,
  saveTimestamp,
}: {
  song: any;
  id: string;
  currentSong: any;
  setCurrentSong: (song: any) => void;
  saveTimestamp: (t: number) => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [parentPlaying, setParentPlaying] = useState(false);

  const stream = song?.streams[0];
  return (
    <li
      className={` bg-gray-100 rounded-md m-1 ${
        song.name === currentSong?.name ? "border border-purple-500" : ""
      } overflow-hidden`}
    >
      <a
        href="#"
        className="block p-2 hover:bg-gray-100 group"
        onClick={(e: any) => {
          if (
            e.target.parentNode.id === "play-pause" ||
            e.target.id === "play-pause"
          )
            return;
          setParentPlaying(true);
          setCurrentSong(song);
        }}
      >
        <div className="flex items-center">
          <img
            src={song?.thumbnails[0]?.url || "https://via.placeholder.com/150"}
            alt="music"
            className="h-8 w-8 rounded-full"
          />
          <div className="ms-4">{song?.name}</div>
          <div className=" ms-auto" id="play-pause">
            {!parentPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                onClick={() => {
                  setParentPlaying(true);
                  setCurrentSong(song);
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 bg-red-500 rounded-full p-1 cursor-pointer"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
                onClick={() => {
                  setParentPlaying(false);
                  setCurrentSong(null);
                }}
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            )}
          </div>
        </div>
      </a>
      {/* audio player */}
      {stream && (
        <div
          className={`${parentPlaying ? "block" : "hidden"} overflow-hidden`}
        >
          <AudioPlayer
            src={stream}
            autoPlay={playing}
            onPlay={(e) => setPlaying(true)}
            onPause={(e) => setPlaying(false)}
            onSeeked={(e: any) => saveTimestamp(e.target?.currentTime)}
            showJumpControls={false}
            loop={true}
            layout="stacked"
            footer="slide seek to select 10s duration"
            style={{ backgroundColor: "#f3f4f6", overflow: "hidden" }}

            // other props here
          />
        </div>
      )}
    </li>
  );
}

export default SongItem;
