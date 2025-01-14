import { useEffect, useRef, useState } from "react";

function useSong(chat: any) {
  const [playing, setPlaying] = useState(false);
  const [timer, setTimer] = useState(15);
  const intervalRef = useRef<any>(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!playing) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  }, [playing]);

  useEffect(() => {
    if (timer <= 0) {
      setPlaying(false);
      setTimer(15);

      clearInterval(intervalRef.current);
    }
  }, [timer]);
  return { playing, timer, imageUrl, setImageUrl, setPlaying, setTimer };
}

export default useSong;
