"use server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const supabase = createSupabaseServerClient();

export async function loginAction(formData: FormData) {
  try {
    const payload = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const register = async (payload: { email: string; password: string }) => {
      const { email, password } = payload;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "/",
        },
      });

      if (error) throw error;
    };

    const { data, error } = await supabase.auth.signInWithPassword(payload);
    if (!data.user) {
      await register(payload);
    }
    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
  redirect("/room");
}
