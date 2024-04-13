import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "./utils/supabase/middleware";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createSupabaseMiddlewareClient(request, res);
  const auth = await supabase.auth.getUser();

  if (!auth.data.user)
    return NextResponse.redirect(new URL("/login", request.url));

  if (request.url.includes("login") && auth.data.user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    auth.data.user &&
    request.url.includes("room") &&
    auth.data.user.user_metadata?.roomId
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return res;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/room"],
};
