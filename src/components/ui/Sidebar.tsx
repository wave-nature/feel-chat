"use client";
import { use, useContext, useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";
import SidebarUsers from "../users/SidebarUsers";
import { AuthContext } from "@/context/AuthProvider";
import toast from "react-hot-toast";

const supabase = createClient();

function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const { roomId, users, setUsers, activeUser, loggedUser } =
    useContext(AuthContext);

  useEffect(() => {
    setMounted(true);
    toast.dismiss();
  }, []);

  useEffect(() => {
    if (roomId) getAllUsersFromRoom();
  }, [roomId]);

  async function getAllUsersFromRoom() {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select(`code,users`)
        .eq("code", roomId)
        .single();
      if (error) throw error;
      const users = data?.users;
      setUsers(users);
    } catch (error: any) {
      console.log(error);
    }
  }

  if (!mounted) return null;

  return (
    <div
      className={
        window?.innerWidth < 640 && activeUser
          ? "hidden"
          : "flex flex-col py-8 sm:pr-4 px-6 sm:w-72 w-full bg-white flex-shrink-0"
      }
    >
      <div className="flex flex-row items-center justify-center h-12 w-full">
        <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <div className="ml-2 font-bold text-2xl">FeelChat</div>
      </div>
      {/* all users */}
      <SidebarUsers users={users} />
    </div>
  );
}

export default Sidebar;
