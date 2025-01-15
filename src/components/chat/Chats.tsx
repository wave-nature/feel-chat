"use client";

import { useContext, useEffect, useState } from "react";
import MySideChat from "./MySideChat";
import OtherSideChat from "./OtherSideChat";
import api from "@/utils/request";
import { AuthContext } from "@/context/AuthProvider";
import toast from "react-hot-toast";

function Chats() {
  const {
    activeUser,
    roomId,
    loggedUser,
    allRoomChats,
    setAllRoomChats,
    setTheActiveUser,
  } = useContext(AuthContext);
  useEffect(() => {
    async function fetchMessages() {
      if (roomId) {
        const { data, error } = await api.getMessages(roomId);
        if (error) toast.error(error.message);
        setAllRoomChats(data);
      }
    }
    fetchMessages();
  }, [roomId, activeUser]);

  useEffect(() => {
    const chatContainer = document.querySelector("#chat-container");
    chatContainer?.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
  }, [allRoomChats.length, activeUser]);

  return (
    <div
      id="chat-container"
      className="flex flex-col h-full overflow-x-auto mb-4"
    >
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-12 gap-y-2 relative pt-20 pb-12">
          {/* erase mode */}
          <div className=" bg-yellow-100 text-gray-900 fixed min-w-full z-10 rounded-lg px-2 py-2 text-sm text-center flex items-center gap-5 justify-center">
            <button
              className="sm:hidden block text-white bg-gray-800 py-0.5 px-2 rounded-md text-[12px] relative -left-8 top-0"
              onClick={() => setTheActiveUser(null)}
            >
              Back
            </button>
            <h5 className="text-center text-[10px]">
              By default your chats will disappear every 4 hours 😎
            </h5>
          </div>

          {/* {myChats.map((chat: any) => (
            <MySideChat key={chat.id} chat={chat} />
          ))}
          {otherChats.map((chat: any) => (
            <OtherSideChat key={chat.id} chat={chat} />
          ))} */}

          {allRoomChats.map((chat: any) =>
            chat?.to?.id === activeUser?.id &&
            chat?.from?.id === loggedUser?.id ? (
              <MySideChat key={chat?.id} chat={chat} />
            ) : chat?.to?.id === loggedUser?.id &&
              chat?.from?.id === activeUser?.id ? (
              <OtherSideChat key={chat?.id} chat={chat} />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

export default Chats;
