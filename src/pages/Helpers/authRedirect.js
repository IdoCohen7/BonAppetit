

// מקבל את כתובת ההפניה לאחר login, עם ברירת מחדל ל־"/"
export const getPostLoginRedirect = () => {
  const redirectPath = sessionStorage.getItem("postLoginRedirect") || "/";
  sessionStorage.removeItem("postLoginRedirect");
  return redirectPath;
};

// src/utils/authRedirect.js


import { cognitoConfig } from "../../config/apiConfig";

export const savePostLoginRedirect = (path = "/") => {
  sessionStorage.setItem("post_login_redirect", path);
};

export const handleLogin = () => {
  const { domain, clientId, redirectUri, responseType, scopes } = cognitoConfig;
  const scopeStr = scopes.join(" ");
  const loginUrl = `https://${domain}/login?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopeStr)}`;
  window.location.href = loginUrl;
};

export const isLoggedIn = () => {
  const token = sessionStorage.getItem("id_token");
  return !!token;
};

export const handleLogout = () => {
  sessionStorage.removeItem("id_token");
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("bonapetit_cart");
  sessionStorage.removeItem("orderType");
  sessionStorage.removeItem("orderStatus");
  sessionStorage.removeItem("address");
  sessionStorage.removeItem("chosenTime");
  sessionStorage.removeItem("orderEta");
  sessionStorage.removeItem("assignedCourierId");
  window.location.href = "/";
};