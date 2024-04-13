"use server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const supabase = createSupabaseServerClient();

export async function roomAction(formData: any) {
  try {
    const payload = {};
    return;

    const { data, error } = await supabase.from("rooms").insert([payload]);
    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
  redirect("/");
}
