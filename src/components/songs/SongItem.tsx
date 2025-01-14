import { useEffect, useState } from "react";
import YouTube from "react-youtube";

function SongItem({
  song,
  id,
  currentSong,
  playersMap,
  setCurrentSong,
  saveTimestamp,
  setPlayersMap,
}: {
  song: any;
  id: string;
  currentSong: any;
  playersMap: any;
  setCurrentSong: (song: any) => void;
  saveTimestamp: (t: number) => void;
  setPlayersMap: (type: string, key?: string, value?: any) => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [parentPlaying, setParentPlaying] = useState(false);
  const [player, setPlayer] = useState<any>();

  const handleReady = function (e: any, songId: string) {
    setPlayer(e.target);
    setPlayersMap("add", songId, e.target);
  };

  const handleSeek = (event: any) => {
    const currentTime = event.target.getCurrentTime(); // Get current time
    saveTimestamp(currentTime);
  };

  useEffect(() => {
    return () => setPlayersMap("clear");
  }, []);

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

          if (!playersMap.size) return;

          // play on tap
          setParentPlaying(true);
          setCurrentSong(song);
          playersMap.forEach((value: any, key: string) => {
            value.pauseVideo();
          });
          const player = playersMap.get(song.videoId);
          setTimeout(() => {
            player.playVideo();
          }, 5);
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
                  if (!playersMap.size) return;

                  playersMap.forEach((value: any, key: string) => {
                    value.pauseVideo();
                  });
                  const player = playersMap.get(song.videoId);
                  setTimeout(() => {
                    player.playVideo();
                  }, 5);
                  setCurrentSong(song);
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
                className="w-5 h-5 bg-red-500 text-white rounded-full p-1 cursor-pointer"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
                onClick={() => {
                  if (!playersMap.size) return;

                  setParentPlaying(false);
                  setCurrentSong(null);
                  playersMap.forEach((value: any, key: string) => {
                    value.pauseVideo();
                  });
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
      {song.videoId && (
        <div
          className={`${parentPlaying ? "block" : "hidden"} overflow-hidden`}
        >
          <YouTube
            videoId={song.videoId} // defaults -> ''
            id={song.videoId} // defaults -> ''
            title={song?.name} // defaults -> ''
            style={{ width: "100%" }}
            opt={{
              playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
              },
            }}
            onReady={(e: any) => handleReady(e, song?.videoId)} //
            onPlay={(e: any) => {
              if (!playersMap.size) return;

              playersMap.forEach((value: any, key: string) => {
                if (key !== e.target.options?.videoId) {
                  value.pauseVideo();
                }
              });

              setCurrentSong(song);
            }}
            onStateChange={(event: any) => {
              if (event.data === YouTube.PlayerState.PLAYING) {
                // Listen for seeking
                event.target.addEventListener("onStateChange", handleSeek);
              } else if (
                event.data === YouTube.PlayerState.PAUSED ||
                event.data === YouTube.PlayerState.ENDED
              ) {
                // Remove listener on pause or end
                event.target.removeEventListener("onStateChange", handleSeek);
              }
            }}
          />
        </div>
      )}
    </li>
  );
}

export default SongItem;
