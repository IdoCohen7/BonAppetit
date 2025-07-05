import React, { useState, useEffect } from "react";
import { apiFetch } from "../../../utils/api";
import OrderCard from "./OrderCard";
import { sortOrders, getCourierName } from "./helpers";
import {
  AssignCourierModal,
  ViewSentModal,
  CouriersStatusModal,
} from "./Modals";
import Spinner from "react-bootstrap/Spinner";

const DeliveryOrders = ({ orders }) => {
  const [localOrders, setLocalOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couriers, setCouriers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [statusChanges, setStatusChanges] = useState({});
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [now, setNow] = useState(new Date());

  const [showReadyModal, setShowReadyModal] = useState(false);
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [showSentModal, setShowSentModal] = useState(false);
  const [showCouriersModal, setShowCouriersModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load menu items once
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

  // Enrich orders with item names and prices
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

  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const data = await apiFetch("/Couriers");
        setCouriers(data);
      } catch (err) {
        console.error("Failed to fetch couriers", err);
      }
    };
    fetchCouriers();
  }, []);

  const deliveryOrders = localOrders.filter((o) => o.orderType === "delivery");
  const readyOrders = deliveryOrders.filter((o) => o.orderStatus === "ready");
  const sentOrders = deliveryOrders.filter((o) => o.orderStatus === "sent");

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

  const assignCourierToOrders = async (courierId, orderIds) => {
    const nowTime = new Date().toISOString();
    const body = {
      orders: orderIds.map((orderId) => ({
        orderId,
        orderStatus: "sent",
        assignedCourierId: courierId,
        courierDepartureTime: nowTime,
      })),
    };

    setCouriers((prev) =>
      prev.map((c) => (c.PK === courierId ? { ...c, available: false } : c))
    );

    try {
      await apiFetch("/Orders/BatchUpdate", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      await apiFetch(`/Couriers/${encodeURIComponent(courierId)}`, {
        method: "PUT",
      });
      setLocalOrders((prev) =>
        prev.map((o) =>
          orderIds.includes(o.PK)
            ? {
                ...o,
                orderStatus: "sent",
                assignedCourierId: courierId,
                courierDepartureTime: nowTime,
              }
            : o
        )
      );
    } catch (err) {
      console.error("Failed to assign courier or update orders", err);
    }
  };

  const updateCourierStatus = async (courierId, newAvailability) => {
    try {
      await apiFetch(`/Couriers/${encodeURIComponent(courierId)}`, {
        method: "PUT",
        body: JSON.stringify({ available: newAvailability }),
      });
      setCouriers((prev) =>
        prev.map((c) =>
          c.PK === courierId ? { ...c, available: newAvailability } : c
        )
      );
    } catch (err) {
      console.error("Failed to update courier status", err);
    }
  };

  const handleCourierSelect = async (courierId) => {
    await assignCourierToOrders(courierId, selectedOrders);
    setShowCourierModal(false);
    setShowReadyModal(false);
    setSelectedOrders([]);
  };

  return (
    <section style={{ padding: "10px 18px" }}>
      <h2 style={{ marginBottom: 20 }}>Delivery Orders</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : deliveryOrders.length === 0 ? (
        <p>No delivery orders available.</p>
      ) : (
        sortOrders(deliveryOrders, now).map((order) => (
          <OrderCard
            key={order.PK}
            order={order}
            now={now}
            courierName={getCourierName(order.assignedCourierId)}
            onStatusChange={handleStatusChange}
            onConfirmStatus={confirmStatusChange}
            newStatus={statusChanges[order.PK]}
          />
        ))
      )}

      <div
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          display: "flex",
          gap: 16,
        }}
      >
        <button onClick={() => setShowSentModal(true)} style={buttonStyle}>
          View Sent Orders
        </button>
        <button onClick={() => setShowReadyModal(true)} style={buttonStyle}>
          Assign Courier
        </button>
        <button onClick={() => setShowCouriersModal(true)} style={buttonStyle}>
          Courier Status
        </button>
      </div>

      {showReadyModal && (
        <AssignCourierModal
          readyOrders={readyOrders}
          selectedOrders={selectedOrders}
          setSelectedOrders={setSelectedOrders}
          onCancel={() => setShowReadyModal(false)}
          onNext={() => {
            setShowReadyModal(false);
            setShowCourierModal(true);
          }}
        />
      )}

      {showCourierModal && (
        <AssignCourierModal.SelectCourier
          couriers={couriers}
          onCancel={() => setShowCourierModal(false)}
          onSelect={handleCourierSelect}
        />
      )}

      {showSentModal && (
        <ViewSentModal
          sentOrders={sentOrders}
          couriers={couriers}
          onClose={() => setShowSentModal(false)}
        />
      )}

      {showCouriersModal && (
        <CouriersStatusModal
          couriers={couriers}
          onClose={() => setShowCouriersModal(false)}
          onUpdateStatus={updateCourierStatus}
        />
      )}
    </section>
  );
};

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "12px 18px",
  borderRadius: "12px",
  border: "none",
  fontWeight: "bold",
  fontSize: "17px",
  cursor: "pointer",
};

export default DeliveryOrders;
