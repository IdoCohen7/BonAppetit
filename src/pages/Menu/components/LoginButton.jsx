import React from "react";
import { cognitoConfig } from "../../../config/apiConfig"; // Adjust the path as necessary

const LoginButton = () => {
  const handleLogin = () => {
    const { domain, clientId, redirectUri, responseType, scopes } = cognitoConfig;
    const scopeStr = scopes.join(" ");
    const loginUrl = `https://${domain}/login?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopeStr)}`;
    window.location.href = loginUrl;
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        background: "linear-gradient(135deg, #2d72d9, #1e5bbf)",
        color: "#fff",
        padding: "10px 20px",
        fontSize: "15px",
        fontWeight: "600",
        border: "none",
        borderRadius: "50px",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        transition: "all 0.3s ease-in-out",
        minWidth: "120px",
        textAlign: "center",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "scale(1.05)";
        e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "scale(1)";
        e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
      }}
    >
      🔐 Sign in / Sign up
    </button>
  );
};

export default LoginButton;
