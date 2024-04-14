"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const supabase = createClient();

function GoogleLogin() {
  const [url, setUrl] = useState("https://feelchat.vercel.app");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(
        window.location.href.includes("localhost")
          ? "http://localhost:3000"
          : "https://feelchat.vercel.app"
      );
    }
  }, []);

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
