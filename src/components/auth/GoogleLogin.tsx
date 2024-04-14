"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/utils/supabase/client";
import { BASE_URL } from "@/utils/env";

const supabase = createClient();

function GoogleLogin() {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        className: {
          button: "auth-social-button",
        },
      }}
      redirectTo={`${BASE_URL}/api/auth/callback`}
      socialLayout="horizontal"
      providers={["google"]}
      onlyThirdPartyProviders
      showLinks={false}
      view="sign_up"
    />
  );
}

export default GoogleLogin;
