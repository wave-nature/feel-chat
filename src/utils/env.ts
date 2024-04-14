const production = true;
export const BASE_URL = production
  ? "https://feel-chat.vercel.app"
  : "http://localhost:3000";
export const getRedirectURL = () => {
  return `${BASE_URL}/api/auth/callback`;
};
