import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import DeliveryOrders from "./components/DeliveryOrders";
import PickupOrders from "./components/PickupOrders";
import MenuTable from "./components/MenuTable";
import Couriers from "./components/Couriers";
import History from "./components/History";
import { apiFetch } from "../../utils/api";
import { WEBSOCKET_URL } from "../../config/websocketConfig";

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("delivery");
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [couriers, setCouriers] = useState([]);

  const fetchOrders = async () => {
    try {
      const data = await apiFetch("/Orders"); // אין צורך ב-JSON.parse
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await apiFetch("/MenuItems");
      const data = JSON.parse(response.body);
      setMenuItems(data);
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

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
    fetchCouriers();

    // WebSocket connection
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
      console.log("WebSocket connected successfully");
    };

    socket.onmessage = (event) => {
      try {
        const newOrder = JSON.parse(event.data);
        console.log("New order received:", newOrder);

        setOrders((prevOrders) => {
          // check if the order already exists
          const exists = prevOrders.some((o) => o.PK === newOrder.PK);
          if (exists) return prevOrders;

          return [...prevOrders, newOrder];
        });
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    };

    // eslint-disable-next-line no-unused-vars
    socket.onerror = (err) => {
      // ignore early connection errors
    };

    return () => socket.close();
  }, []);

  const deliveryOrders = orders.filter(
    (order) => order.orderType === "delivery"
  );
  const pickupOrders = orders.filter((order) => order.orderType === "pickup");

  const renderSection = () => {
    switch (activeSection) {
      case "delivery":
        return <DeliveryOrders orders={deliveryOrders} couriers={couriers} />;
      case "pickup":
        return <PickupOrders orders={pickupOrders} />;
      case "menu":
        return <MenuTable items={menuItems} />;
      case "couriers":
        return <Couriers couriers={couriers} />;
      case "history":
        return <History />;
      default:
        return null;
    }
  };

  return (
    <div>
      <NavBar
        onSectionChange={setActiveSection}
        onLogout={() => alert("You have been logged out")}
      />
      <main>{renderSection()}</main>
    </div>
  );
};

export default AdminPanel;
