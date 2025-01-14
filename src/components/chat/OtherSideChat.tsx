import useSong from "@/hooks/useSong";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";

function OtherSideChat({ chat }: any) {
  const { playing, timer, imageUrl, setPlaying, setImageUrl, setTimer } =
    useSong(chat);
  useEffect(() => {
    if (timer <= 0) {
      player.stopVideo();
    }
  }, [timer]);

  const feelSong = chat?.feel_mode && chat?.feel_data?.type === "song";
  const camera = chat?.feel_mode && chat?.feel_data?.type === "camera";
  const [player, setPlayer] = useState<any>();

  function handleReady(e: any) {
    setPlayer(e.target);
  }

  return (
    <div className="col-start-1 col-end-8 p-3 rounded-lg">
      <div className="flex flex-row items-center">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          {chat?.from?.email?.[0]}
        </div>
        <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
          {imageUrl && (
            <div className="my-2 rounded-lg relative">
              <button
                type="button"
                className="absolute top-0 end-0 text-white bg-red-500 hover:bg-red-600 rounded-lg text-sm w-6 h-6 ms-auto inline-flex justify-center items-center"
                onClick={() => setImageUrl("")}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <img src={imageUrl} className="rounded-lg h-32 w-auto" />
            </div>
          )}
          <div className="flex items-center gap-3">
            {feelSong && (
              <>
                <button className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-800 rounded-full h-8 w-10">
                  {playing ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-white"
                      onClick={() => {
                        if (!chat?.feel_data?.data?.song?.videoId) return;

                        player.stopVideo();
                        setPlaying(false);
                        setTimer(0);
                      }}
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        if (!chat?.feel_data?.data?.song?.videoId) return;
                        player.playVideo();
                        player.seekTo(chat?.feel_data?.data?.timestamp, true);
                        setPlaying(true);
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </button>

                {chat?.feel_data?.data?.song?.videoId && (
                  <YouTube
                    videoId={chat?.feel_data?.data?.song?.videoId}
                    id={chat?.feel_data?.data?.song?.videoId}
                    title={chat?.feel_data?.data?.song?.name}
                    style={{ width: "0", height: "0", opacity: 0 }}
                    opt={{
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                      },
                    }}
                    onReady={(e: any) => handleReady(e)} //
                  />
                )}
              </>
            )}
            {camera && (
              <button
                type="button"
                onClick={() => setImageUrl(chat?.feel_data?.data?.image)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-blue-600 cursor-pointer"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </button>
            )}
            <span>{chat?.message}</span>
          </div>
          {/* progress bar */}
          {feelSong && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500"
                style={{ width: `${(100 / 15) * (15 - timer)}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OtherSideChat;
