"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { createClient } from "@/utils/supabase/client";

import api from "@/utils/request";
import { generateUniqueRoomCode } from "@/utils/helpers";
import { AuthContext } from "@/context/AuthProvider";

const supabase = createClient();

function Page() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const { setLoggedUser, setRoomId, setTheActiveUser } =
    useContext(AuthContext);
  useEffect(() => {
    toast.dismiss();
    return () => {
      setRoomCode("");
      toast.dismiss();
    };
  }, []);

  function createRoomHandler(type: "old" | "new") {
    return async (e: FormEvent) => {
      e.preventDefault();
      let err: any;

      const auth = await supabase.auth.getUser();
      if (!auth.data.user?.id) return toast.error("Please login first");
      toast.loading("Please wait...");

      // initialize the logged user
      setLoggedUser(auth.data.user);
      setTheActiveUser(auth.data.user);

      if (type === "new") {
        const roomCode = generateUniqueRoomCode();
        const payload = {
          code: roomCode,
          user: {
            id: auth.data.user.id as string,
            email: auth.data.user.email as string,
          },
          type,
        };
        err = await api.createRoom(payload);
        setRoomId(roomCode);
      } else {
        if (!roomCode) return toast.error("Please enter room code");
        const payload = {
          code: roomCode,
          user: {
            id: auth.data.user.id as string,
            email: auth.data.user.email as string,
          },
          type,
        };
        err = await api.createRoom(payload);
        setRoomId(roomCode);
      }

      if (err) {
        toast.dismiss();
        return toast.error(err);
      } else {
        toast.dismiss();
        toast.success("Entering you in the room!");
        await new Promise((resolve) => setTimeout(resolve, 100));
        router.push("/");
      }
    };
  }

  return (
    <main className="h-screen overflow-hidden flex items-center justify-center bg-slate-100">
      <section className="w-screen">
        <div className="w-full lg:w-4/12 px-4 mx-auto pt-6">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="text-center mb-3">
                <h3 className="text-blueGray-500 text-lg font-bold">
                  Let's enter your private space.
                </h3>
              </div>

              <hr className="mt-6 border-b-1 border-blueGray-300" />
            </div>

            {/* enter existing room */}
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form onSubmit={createRoomHandler("old")}>
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Enter Private Space Code
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                  />
                </div>

                <div className="text-center mt-6">
                  <button
                    className=" bg-blue-600 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    type="submit"
                  >
                    {" "}
                    Enter Private Space{" "}
                  </button>
                </div>
              </form>
            </div>

            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              {/* new room */}
              <h6 className="text-blueGray-500 text-sm font-bold text-center">
                Or
              </h6>
              <form onSubmit={createRoomHandler("new")}>
                <div className="text-center mt-6">
                  <button
                    className=" bg-blue-600 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    type="submit"
                  >
                    {" "}
                    Create New Private Space{" "}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Page;
