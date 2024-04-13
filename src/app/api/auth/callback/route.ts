import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const url = request.url;
    const code = new URL(url).searchParams.get("code");

    if (code) {
      await supabase.auth.exchangeCodeForSession(String(code));
      return Response.redirect("http://localhost:3000/room"); // Use relative path for internal redirects
    } else {
      return Response.redirect("http://localhost:3000/room"); // Use relative path for internal redirects
    }
  } catch (error) {
    console.log("error", error);
    return Response.redirect("http://localhost:3000/room"); // Use relative path for internal redirects
  }
}
