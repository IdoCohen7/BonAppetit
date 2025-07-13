export const cognitoConfig = {
  domain: "us-east-1ali2rxa83.auth.us-east-1.amazoncognito.com", // ← מה-User Pool
  clientId: "4p73onv4dcvokvd85gv6fbtrr8",             // ← ה-App Client ID שלך
  //redirectUri: "http://localhost:5173/callback",
  redirectUri: "https://bonapetit-website.s3.us-east-1.amazonaws.com/index.html",       // ← מה שהגדרת בהתחלה
  responseType: "code",
  scopes: ["email", "openid", "phone"],
};