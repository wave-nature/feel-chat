import { useEffect, useState } from "react";
import api from "@/utils/request";

function auth() {
  const [loggedUser, setLoggedUser] = useState<any>();
  const [roomId, setRoomId] = useState<string | null>("");

  useEffect(() => {
    async function fetchUser() {
      const user = await api.getUser();
      setLoggedUser(user);
      setRoomId(user?.user_metadata?.roomId);
    }

    fetchUser();
  }, []);

  return { loggedUser, roomId };
}

export default auth;
