import { CreateRoom } from "@/types/room";
import { createClient } from "./supabase/client";
import { Message } from "@/types/message";
const supabase = createClient();

class RequestApi {
  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  async register(payload: { email: string; password: string }) {
    const { email, password } = payload;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "/",
      },
    });
  }

  async login(payload: { email: string; password: string }) {
    const { email, password } = payload;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // console.log(data, error);
  }

  async createRoom(payload: CreateRoom) {
    let err = null;
    try {
      if (payload.type === "new") {
        const { data, error }: any = await supabase.from("rooms").insert([
          {
            code: payload.code,
            users: [payload.user],
          },
        ]);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("rooms")
          .select("*")
          .eq("code", payload.code.trim())
          .single();
        if (error) {
          throw new Error("Room not found, create new room.");
        }
        if (!data) {
          throw new Error("Room not found, create new room.");
        }
        const room = data;
        const users = room.users;
        users.push(payload.user);
        const { error: updateError } = await supabase
          .from("rooms")
          .update({ users })
          .eq("code", payload.code);
        if (updateError) throw updateError;
      }
      // update user room
      await supabase.auth.updateUser({
        data: {
          roomId: payload.code,
        },
      });
    } catch (error: any) {
      console.log("error", error);
      err = error.message;
    }
    return err;
  }

  sendMessage(payload: Message) {
    return supabase.from("chats").insert([payload]);
  }

  async uploadPhoto(base64Image: string) {
    const { data, error } = await supabase.storage
      .from("camera") // Replace with your storage bucket name
      .upload("image.png", base64Image, { contentType: "image/png" });

    if (error) {
      console.error("Error uploading image:", error.message);
      return null;
    }

    // Return the URL of the uploaded image
    return { data, error };
  }

  getMessages(roomId: string) {
    return supabase
      .from("chats")
      .select("*")
      .eq("room_code", roomId)
      .order("created_at", { ascending: true });
  }
}

const api = new RequestApi();
export default api;
