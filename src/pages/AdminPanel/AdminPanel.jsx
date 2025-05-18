import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import DeliveryOrders from "./components/DeliveryOrders";
import PickupOrders from "./components/PickupOrders";
import MenuTable from "./components/MenuTable";
import Couriers from "./components/Couriers";
import History from "./components/History";
import { apiFetch } from "../../utils/api";

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("delivery");
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [couriers, setCouriers] = useState([]);

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
    // Placeholder data (to be replaced with API calls)
    setOrders([]);
    setMenuItems(fetchMenuItems());
    setCouriers(fetchCouriers());
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "delivery":
        return <DeliveryOrders orders={orders} couriers={couriers} />;
      case "pickup":
        return <PickupOrders orders={orders} />;
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
