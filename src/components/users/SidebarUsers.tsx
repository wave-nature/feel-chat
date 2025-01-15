"use client";

import { useContext, useEffect, useState } from "react";

import ActiveSidebarUser from "../ui/ActiveSidebarUser";
import LogoutButton from "../ui/LogoutButton";
import SidebarUser from "../ui/SidebarUser";
import auth from "@/hooks/auth";
import { AuthContext } from "@/context/AuthProvider";

function SidebarUsers({ users }: any) {
  const { loggedUser, roomId, activeUser, setTheActiveUser } =
    useContext(AuthContext);

  function setCurrentActiveUser(user: any) {
    setTheActiveUser(user);
  }

  useEffect(() => {
    if (loggedUser && users?.length) {
      const otherUsers = users.filter((user: any) => user.id !== loggedUser.id);
      if (otherUsers.length > 0) setTheActiveUser(otherUsers[0]);
      else setTheActiveUser(loggedUser);
    }
  }, [users?.length, loggedUser]);

  return (
    <>
      {/* active user */}
      <ActiveSidebarUser user={activeUser} roomId={roomId} />
      <div className="flex flex-col mt-8">
        <div className="flex flex-row items-center justify-between text-xs">
          <span className="font-bold">Total Users</span>
          <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
            {users?.length}
          </span>
        </div>
        <div className="flex flex-col space-y-1 mt-4 -mx-2 sm:h-80 min-h-[55vh] overflow-y-auto">
          {users && Array.isArray(users)
            ? users.map((user: any) => (
                <SidebarUser
                  key={user.id}
                  user={user}
                  setCurrentActiveUser={setCurrentActiveUser}
                  activeUser={activeUser}
                  loggedUser={loggedUser}
                />
              ))
            : "No active users"}
        </div>
        <div className="flex justify-center w-full">
          <LogoutButton />
        </div>
      </div>
    </>
  );
}

export default SidebarUsers;
