import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cognitoConfig } from "../config/apiConfig";
import { getPostLoginRedirect } from "../pages/Helpers/authRedirect" // ⬅️ שימוש בפונקציה חיצונית

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    console.log("🔍 URL Params:", window.location.search);
    console.log("🟡 Authorization code:", code);

    if (!code) {
      console.error("❌ Missing authorization code in URL");
      return;
    }

    const fetchTokens = async () => {
      const tokenUrl = `https://${cognitoConfig.domain}/oauth2/token`;

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: cognitoConfig.clientId,
        code,
        redirect_uri: cognitoConfig.redirectUri,
      });

      console.log("📡 Token URL:", tokenUrl);
      console.log("📦 Request Body:", body.toString());

      try {
        const response = await fetch(tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });

        const data = await response.json();

        if (data.id_token) {
          console.log("✅ Token fetch success:", data);
          sessionStorage.setItem("id_token", data.id_token);
          sessionStorage.setItem("access_token", data.access_token);
          sessionStorage.setItem("refresh_token", data.refresh_token);

          const redirectPath = getPostLoginRedirect(); // ⬅️ שימוש בפונקציה חיצונית
          navigate(redirectPath);
        } else {
          console.error("❌ Token fetch failed", data);
        }
      } catch (error) {
        console.error("🔥 Error fetching token", error);
      }
    };

    fetchTokens();
  }, [navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h3>Logging you in...</h3>
    </div>
  );
};

export default Callback;
