import { useEffect, useRef, useState } from "react";

function useSong(chat: any) {
  const [playing, setPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef<any>(null);
  const [timer, setTimer] = useState(15);
  const intervalRef = useRef<any>(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!playing) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      clearInterval(intervalRef.current);
      return;
    }

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      if (audioRef.current) {
        audioRef.current.pause();
        clearInterval(intervalRef.current);
      }
      audioRef.current = audio; // Update audioRef to point to the new audio
      audioRef.current.currentTime = chat?.feel_data?.data?.timestamp;
      audioRef.current.play();
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      // Cleanup function to pause and release audio object
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl, playing]);

  useEffect(() => {
    if (timer <= 0) {
      setPlaying(false);
      setAudioUrl("");
      setTimer(15);
      // stop the audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      clearInterval(intervalRef.current);
    }
  }, [timer]);
  return { playing, timer, imageUrl, setImageUrl, setPlaying, setAudioUrl };
}

export default useSong;
