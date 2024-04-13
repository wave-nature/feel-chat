import { createServerClient } from "@supabase/ssr";
import {
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL,
} from "../constant";
import { cookies } from "next/headers";

export const createSupabaseServerClient = function (isServerComponent = false) {
  return createServerClient(
    NEXT_PUBLIC_SUPABASE_URL as string,
    NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(name) {
          // get cookie by name
          const cookieStore = cookies();
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          if (isServerComponent) return;
          // set cookie
          const cookieStore = cookies();
          cookieStore.set(name, value, options);
        },
        remove(name, options) {
          if (isServerComponent) return;
          // remove cookie
          const cookieStore = cookies();
          cookieStore.set(name, "", options);
        },
      },
    }
  );
};
