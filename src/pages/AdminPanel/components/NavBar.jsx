import React from "react";
import Logo from "../../../assets/images/logo.png"; // Adjust the path as necessary

const NavBar = ({ onSectionChange, onLogout }) => {
  return (
    <nav className="admin-navbar">
      <div className="nav-left">
        <img src={Logo} alt="App Logo" className="logo-img" />
      </div>

      <div className="nav-center">
        <button onClick={() => onSectionChange("delivery")}>
          Delivery Orders
        </button>
        <button onClick={() => onSectionChange("pickup")}>Pickup Orders</button>
      </div>

      <div className="nav-right">
        <div className="dropdown">
          <button>⋮ More Menu</button>
          <div className="dropdown-content">
            <button onClick={() => onSectionChange("menu")}>Edit Menu</button>
            <button onClick={() => onSectionChange("couriers")}>
              Couriers
            </button>
            <button onClick={() => onSectionChange("history")}>
              Shift History
            </button>
          </div>
        </div>
        <div className="logout" onClick={onLogout}>
          🔒 Logout
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
