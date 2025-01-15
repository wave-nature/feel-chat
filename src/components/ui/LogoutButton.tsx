"use client";

import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

const supabase = createClient();

function LogoutButton() {
  async function logoutHandler() {
    toast.loading("Logging out");
    // update user room
    const { data: userData, error: userError } = await supabase.auth.getUser();
    await supabase.auth.updateUser({
      data: {
        roomId: null,
      },
    });

    // remove user from room
    const code = userData.user?.user_metadata?.roomId;
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", code)
      .single();
    if (error) throw error;

    if (!data) {
      throw new Error("Room not found");
    }
    const room = data;
    const users = room.users.filter(
      (user: any) => user.id !== userData.user?.id
    );
    const { error: updateError } = await supabase
      .from("rooms")
      .update({ users })
      .eq("code", code);
    await supabase.auth.signOut();

    toast.dismiss();
    toast.success("logged out successfully");

    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  return (
    <button
      className="leading-none ml-1 text-sm bg-red-600 text-white px-2 py-3 rounded-md w-4/5"
      onClick={logoutHandler}
    >
      Logout &rarr;
    </button>
  );
}

export default LogoutButton;
