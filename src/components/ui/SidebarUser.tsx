"use client";

import auth from "@/hooks/auth";

function SidbarUser({
  user,
  activeUser,
  loggedUser,
  setCurrentActiveUser,
}: {
  user: any;
  activeUser: any;
  loggedUser: any;
  setCurrentActiveUser: (user: any) => void;
}) {
  if (!loggedUser) return null;

  return (
    <button
      className={`flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 my-2 ${
        loggedUser?.id === user?.id
          ? "order-1 bg-blue-400 hover:bg-blue-400 "
          : "order-2"
      } ${
        activeUser?.id === user?.id && loggedUser?.id !== user?.id
          ? "bg-green-200"
          : ""
      }`}
      onClick={() => setCurrentActiveUser(user)}
    >
      <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
        {user?.email?.[0]}
      </div>
      <div className="ml-2 text-sm font-semibold">
        {user?.email?.split("@")?.[0]}
      </div>
      {/* <div className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none">
        2
      </div> */}
    </button>
  );
}

export default SidbarUser;
