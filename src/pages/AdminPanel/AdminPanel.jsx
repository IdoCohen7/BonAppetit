import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import NavBar from "./components/NavBar";
import DeliveryOrders from "./components/DeliveryOrders";
import PickupOrders from "./components/PickupOrders";
import MenuTable from "./components/MenuTable";
import Couriers from "./components/Couriers";
import History from "./components/History";

import { apiFetch } from "../../utils/api";
import { WEBSOCKET_URL } from "../../config/websocketConfig";
import happyBellSound from "../../assets/sounds/happybell.wav";

import { cognitoConfig } from "../../config/apiConfig"; // ✅ הגדרות Cognito


const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("delivery");
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(null);

  const bellAudioRef = useRef(new Audio(happyBellSound));
  const navigate = useNavigate();

const handleLogin = () => {
  // שמירה של הנתיב הנוכחי כדי שנוכל לחזור אליו אחרי login
  sessionStorage.setItem("post_login_redirect", window.location.pathname);

  const { domain, clientId, redirectUri, responseType, scopes } = cognitoConfig;
  const scopeStr = scopes.join(" ");
  const loginUrl = `https://${domain}/login?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopeStr)}`;
  window.location.href = loginUrl;
};


  useEffect(() => {
    const token = sessionStorage.getItem("id_token");

    if (!token) {
      handleLogin(); // ⬅️ שולח להתחברות
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const groups = decoded["cognito:groups"] || [];
      if (groups.includes("admin")) {
        setIsAuthorized(true);
      } else {
        navigate("/"); // ⬅️ לא אדמין? שולח לעמוד הראשי
      }
    } catch (err) {
      console.error("Failed to decode token", err);
      navigate("/"); // ⬅️ טוקן לא תקין? שולח לעמוד הראשי
    }
  }, [navigate]);

  useEffect(() => {
    if (isAuthorized !== true) return;

    fetchOrders();
    fetchMenuItems();
    fetchCouriers();

    const socket = new WebSocket(WEBSOCKET_URL);
    socket.onopen = () => console.log("WebSocket connected");
    socket.onmessage = (event) => {
      try {
        const newOrder = JSON.parse(event.data).order;
        setOrders((prevOrders) => {
          if (prevOrders.some((o) => o.PK === newOrder.PK)) return prevOrders;
          bellAudioRef.current.play().catch((err) => console.warn("Audio error:", err));
          return [...prevOrders, newOrder];
        });
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    };
    return () => socket.close();
  }, [isAuthorized]);

  const fetchOrders = async () => {
    try {
      const data = await apiFetch("/Orders");
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await apiFetch("/MenuItems");
      setMenuItems(response.body);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const fetchCouriers = async () => {
    try {
      const data = await apiFetch("/Couriers");
      setCouriers(data);
    } catch (error) {
      console.error("Error fetching couriers:", error);
    }
  };

  const deliveryOrders = orders.filter((order) => order.orderType === "delivery");
  const pickupOrders = orders.filter((order) => order.orderType === "pickup");

  const renderSection = () => {
    switch (activeSection) {
      case "delivery": return <DeliveryOrders orders={deliveryOrders} couriers={couriers} />;
      case "pickup": return <PickupOrders orders={pickupOrders} />;
      case "menu": return <MenuTable items={menuItems} />;
      case "couriers": return <Couriers couriers={couriers} />;
      case "history": return <History />;
      default: return null;
    }
  };

  if (isAuthorized === null) return <p>Loading...</p>;

  return (
    <div>
      <NavBar onSectionChange={setActiveSection} onLogout={() => alert("Logged out")} />
      <main>{renderSection()}</main>
    </div>
  );
};

export default AdminPanel;
