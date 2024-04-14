"use client";
import { ReactNode, createContext, useEffect, useState } from "react";

import api from "@/utils/request";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

const initialState = {
  loggedUser: null as any | null,
  activeUser: null as any | null,
  roomId: "" as string | null,
  allRoomChats: [] as any[],
  users: [] as any[],
  setLoggedUser: (user: any) => {},
  setTheActiveUser: (user: any) => {},
  setAllRoomChats: (chats: any) => {},
  setRoomId: (roomId: string) => {},
  setUsers: (users: any) => {},
};

export const AuthContext = createContext(initialState);

function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loggedUser, setLoggedInUser] = useState<any>(null);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [roomId, setRoomId] = useState<string | null>("");
  const [allRoomChats, setAllRoomChats] = useState<any>([]);

  useEffect(() => {
    async function fetchUser() {
      const user = await api.getUser();
      setLoggedUser(user);
      setActiveUser(user);
      setRoomId(user?.user_metadata?.roomId);
    }

    fetchUser();
  }, []);

  function setLoggedUser(user: any) {
    setLoggedInUser(user);
  }

  function setTheActiveUser(user: any) {
    setActiveUser(user);
  }

  function setRoomUsers(users: any) {
    setUsers(users);
  }

  // subscribe to changes in rooms
  supabase
    .channel("custom-update-channel")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "rooms" },
      (payload) => {
        setUsers(payload.new?.users);
      }
    )
    .subscribe();

  // subscribe to chat changes
  supabase
    .channel("custom-insert-channel")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "chats" },
      (payload) => {
        setAllRoomChats([...allRoomChats, payload.new]);
      }
    )
    .subscribe();

  return (
    <AuthContext.Provider
      value={{
        loggedUser,
        activeUser,
        roomId,
        allRoomChats,
        users,
        setLoggedUser,
        setTheActiveUser,
        setAllRoomChats,
        setRoomId,
        setUsers: setRoomUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
