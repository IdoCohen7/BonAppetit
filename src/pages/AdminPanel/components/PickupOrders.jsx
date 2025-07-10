import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../utils/api";
import Spinner from "react-bootstrap/Spinner";
import OrderCard from "./OrderCard";
import { sortOrders } from "./helpers";

const PickupOrders = ({ orders }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [localOrders, setLocalOrders] = useState([]);
  const [statusChanges, setStatusChanges] = useState({});
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await apiFetch("/MenuItems");
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch menu items", err);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (!orders?.length || !menuItems.length) return;

    const itemMap = {};
    menuItems.forEach((item) => {
      itemMap[item.PK] = { name: item.name, price: item.price };
    });

    const enriched = orders.map((order) => ({
      ...order,
      items: order.items?.map((i) => ({
        ...i,
        name:
          i.name ||
          itemMap[i.PK]?.name ||
          itemMap[i.itemId]?.name ||
          itemMap[i.productId]?.name ||
          "Unnamed Item",
        price:
          i.price ??
          itemMap[i.PK]?.price ??
          itemMap[i.itemId]?.price ??
          itemMap[i.productId]?.price,
      })),
    }));

    setLocalOrders(enriched);
  }, [orders, menuItems]);

  const pickupOrders = localOrders.filter((o) => o.orderType === "pickup");

  const handleStatusChange = (orderId, newStatus) => {
    setStatusChanges((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const confirmStatusChange = async (orderId) => {
    const newStatus = statusChanges[orderId];
    const body = { orders: [{ orderId, orderStatus: newStatus }] };
    try {
      await apiFetch("/Orders/BatchUpdate", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setLocalOrders((prev) =>
        prev.map((o) =>
          o.PK === orderId ? { ...o, orderStatus: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  return (
    <section style={{ padding: "10px 18px" }}>
      <h2 style={{ marginBottom: 20 }}>Pickup Orders</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : pickupOrders.length === 0 ? (
        <p>No pickup orders available.</p>
      ) : (
        sortOrders(pickupOrders, now).map((order) => (
          <OrderCard
            key={order.PK}
            order={order}
            now={now}
            onStatusChange={handleStatusChange}
            onConfirmStatus={confirmStatusChange}
            newStatus={statusChanges[order.PK]}
          />
        ))
      )}
    </section>
  );
};

export default PickupOrders;
