import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const newURL = new URL(request.url);
  const redirectUrl = `${newURL.protocol}//${newURL.host}/room`;
  try {
    const supabase = createSupabaseServerClient();
    const url = request.url;
    const code = new URL(url).searchParams.get("code");

    if (code) {
      await supabase.auth.exchangeCodeForSession(String(code));
      return Response.redirect(redirectUrl); // Use relative path for internal redirects
    } else {
      return Response.redirect(redirectUrl); // Use relative path for internal redirects
    }
  } catch (error) {
    console.log("error", error);
    return Response.redirect(redirectUrl); // Use relative path for internal redirects
  }
}
