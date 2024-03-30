import { useEffect, useState } from "react";
import SkeletonLoader from "../loader/Skeleton";
import SongItem from "../songs/SongItem";

const disableStyle =
  "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 border-b-2 border-transparent rounded-t-lg";
const activeStyle =
  "text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500";

function SendMessage() {
  const [feelMode, setFeelMode] = useState(false);
  const [feelTab, setFeelTab] = useState("songs");
  const [song, setSong] = useState("Never gonna give you up");
  const [songs, setSongs] = useState([] as any[]);
  const [currentSong, setCurrentSong] = useState({} as any);
  const [loader, setLoader] = useState(false);

  function assignCurrentSong(song: any) {
    setCurrentSong(song);
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
  useEffect(() => {
    if (!song || !feelMode) return;
    let timeout = setTimeout(() => {
      clearTimeout(timeout);
      fetchSong();
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [song]);

  return (
    <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4 relative">
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
            }}
          />
          <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
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
            onChange={() => setFeelMode(!feelMode)}
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600" />
        </label>

        <button className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
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
      <div className="absolute right-0 bottom-24">
        <div className="max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 h-72 overflow-y-scroll">
          <div className="text-sm w-full font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
              <li className="me-2">
                <a
                  href="#"
                  className={`inline-block p-4 ${
                    feelTab === "songs" ? activeStyle : disableStyle
                  }`}
                  onClick={() => setFeelTab("songs")}
                >
                  Songs
                </a>
              </li>
              <li className="me-2">
                <a
                  href="#"
                  className={`inline-block p-4 ${
                    feelTab === "video" ? activeStyle : disableStyle
                  }`}
                  onClick={() => setFeelTab("video")}
                >
                  Video
                </a>
              </li>
              <li className="me-2">
                <a
                  href="#"
                  className={`inline-block p-4  ${
                    feelTab === "camera" ? activeStyle : disableStyle
                  }`}
                  onClick={() => setFeelTab("camera")}
                >
                  Camera
                </a>
              </li>
            </ul>

            {feelTab === "songs" && (
              <div>
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
                      />
                    ))}
                  </ul>
                )}
              </div>
            )}
            {feelTab === "video" && (
              <div>
                <h6 className=" py-2 font-bold text-sm">Suggested Video</h6>
                <ul></ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendMessage;
