import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../utils/api";
import Spinner from "react-bootstrap/Spinner";

const PickupOrders = ({ orders }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [enrichedOrders, setEnrichedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/MenuItems")
      .then(setMenuItems)
      .catch((err) => console.error("Failed to fetch menu items", err));
  }, []);

  useEffect(() => {
    if (!menuItems.length) return;

    if (!orders?.length) {
      setEnrichedOrders([]);
      setLoading(false);
      return;
    }

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

    setEnrichedOrders(enriched);
    setLoading(false);
  }, [orders, menuItems]);

  const pickupOrders = enrichedOrders.filter(
    (order) => order.orderType === "pickup"
  );

  const updateOrderStatus = async (orderId) => {
    try {
      await apiFetch(`/Orders/${orderId}`, {
        method: "PATCH",
      });

      // עדכון מקומי של הסטטוס
      setEnrichedOrders((prev) =>
        prev.map((o) =>
          o.PK === orderId
            ? {
                ...o,
                orderStatus:
                  o.orderStatus === "pending"
                    ? "ready"
                    : o.orderStatus === "ready"
                    ? "collected"
                    : o.orderStatus,
              }
            : o
        )
      );
    } catch (err) {
      console.error("Failed to update order status", err);
      alert("Failed to update status");
    }
  };

  return (
    <section className="section">
      <h2>Pickup Orders</h2>
      <div>
        {loading ? (
          <Spinner></Spinner>
        ) : pickupOrders.length === 0 ? (
          <p>No pickup orders available.</p>
        ) : (
          pickupOrders.map((order) => {
            const itemsStr =
              order.items?.map((i) => `${i.name} x${i.quantity}`).join(", ") ||
              "";

            return (
              <div key={order.PK} className="order-card">
                <h3>Order #{order.PK}</h3>
                <p>Items: {itemsStr}</p>
                <p>Status: {order.orderStatus}</p>

                {order.orderStatus === "collected" ? (
                  <p>✅ Collected</p>
                ) : (
                  <button
                    onClick={() => updateOrderStatus(order.PK)}
                    className={
                      order.orderStatus === "ready"
                        ? "mark-complete-btn"
                        : "mark-ready-btn"
                    }
                  >
                    {order.orderStatus === "ready"
                      ? "✔️ Mark as Collected"
                      : "🟡 Mark as Ready"}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default PickupOrders;
