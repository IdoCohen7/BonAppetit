export const API_BASE_URL =
  "https://poqunn2zj1.execute-api.us-east-1.amazonaws.com";
export const API_STAGE = "prod";

export const cognitoConfig = {
  domain: "us-east-1ali2rxa83.auth.us-east-1.amazoncognito.com", // ← מה-User Pool
  clientId: "4p73onv4dcvokvd85gv6fbtrr8",             // ← ה-App Client ID שלך
  redirectUri: "http://localhost:5173/callback",      // ← מה שהגדרת בהתחלה
  responseType: "code",
  scopes: ["email", "openid", "phone"],
};