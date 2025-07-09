import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";
import { handleLogin, isLoggedIn } from "../Helpers/authRedirect";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [location]);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("bonapetit_cart");
    setLoggedIn(false);
    navigate("/");
  };

  const getButtonStyle = (type) => ({
    background: "linear-gradient(135deg, #2d72d9, #1e5bbf)",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "15px",
    fontWeight: "600",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow:
      hoveredBtn === type
        ? "0 6px 16px rgba(0,0,0,0.3)"
        : "0 4px 12px rgba(0,0,0,0.2)",
    transform: hoveredBtn === type ? "scale(1.05)" : "scale(1)",
    transition: "all 0.3s ease-in-out",
    minWidth: "120px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    marginLeft: "12px",
  });

  const isAdminPage = location.pathname.startsWith("/admin");
  const isStartPage = location.pathname === "/";

  return (
    <header className="header">
      <div className="container header-flex" style={styles.headerFlex}>
        <a href="/" className="logo" style={styles.logoLink}>
          <img src={Logo} alt="BonApetit Logo" style={styles.logoImg} />
        </a>

        <nav className="top-nav" style={styles.topNav}>
          {isAdminPage ? (
            // ✅ Admin page: only logout
            loggedIn && (
              <button
                style={getButtonStyle("logout")}
                onClick={handleLogout}
                onMouseEnter={() => setHoveredBtn("logout")}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                Logout 🔓
              </button>
            )
          ) : (
            // ✅ All other pages (except Start): show Home + login/logout
            <>
              {!isStartPage && (
                <button
                  style={getButtonStyle("home")}
                  onClick={() => navigate("/")}
                  onMouseEnter={() => setHoveredBtn("home")}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  ← Home
                </button>
              )}
              {loggedIn ? (
                <button
                  style={getButtonStyle("logout")}
                  onClick={handleLogout}
                  onMouseEnter={() => setHoveredBtn("logout")}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  Logout 🔓
                </button>
              ) : (
                <button
                  style={getButtonStyle("login")}
                  onClick={handleLogin}
                  onMouseEnter={() => setHoveredBtn("login")}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  Sign in / Sign up 🔐
                </button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const styles = {
  headerFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #ddd",
  },
  logoLink: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  logoImg: {
    height: "48px",
    objectFit: "contain",
  },
  topNav: {
    display: "flex",
    alignItems: "center",
  },
};

export default TopBar;
