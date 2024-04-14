"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

function GoogleLogin() {
  let url = "http://locahost:3000";
  if (typeof window !== "undefined") {
    url = window.location.href.includes("localhost")
      ? "http://localhost:3000"
      : "https://feelchat.vercel.app";
  }
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        className: {
          button: "auth-social-button",
        },
      }}
      redirectTo={`${url}/api/auth/callback`}
      socialLayout="horizontal"
      providers={["google"]}
      onlyThirdPartyProviders
      showLinks={false}
      view="sign_up"
    />
  );
}

export default GoogleLogin;
