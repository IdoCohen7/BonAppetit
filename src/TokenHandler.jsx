// src/TokenHandler.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const TokenHandler = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes("id_token")) {
      const params = new URLSearchParams(hash.replace("#", "?"));
      const token = params.get("id_token");

      if (token) {
        sessionStorage.setItem("id_token", token);

        try {
          const decoded = jwtDecode(token);
          const groups = decoded["cognito:groups"] || [];

          if (groups.includes("admin")) {
            window.location.replace("/admin");
            return;
          }
        } catch (err) {
          console.warn("Token decode failed", err);
        }

        const redirectPath = sessionStorage.getItem("post_login_redirect") || "/";
        sessionStorage.removeItem("post_login_redirect");
        window.location.replace(redirectPath);
      }
    }
  }, [location]);

  return children;
};

export default TokenHandler;
