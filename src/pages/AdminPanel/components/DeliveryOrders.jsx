// DeliveryOrders.jsx – כולל תיקון כפתורים, הצגת מודלים והגדלת כפתורים

import React, { useState, useEffect } from "react";
import { apiFetch } from "../../../utils/api";

const DeliveryOrders = ({ orders }) => {
  const [localOrders, setLocalOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showReadyModal, setShowReadyModal] = useState(false);
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [showSentModal, setShowSentModal] = useState(false);
  const [showCouriersModal, setShowCouriersModal] = useState(false);
  const [statusChanges, setStatusChanges] = useState({});

  useEffect(() => {
    if (orders?.length) setLocalOrders(orders);
  }, [orders]);

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

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : prev.length < 5
        ? [...prev, orderId]
        : prev
    );
  };

  const assignCourierToOrders = async (courierId, orderIds) => {
    const now = new Date().toISOString();
    const body = {
      orders: orderIds.map((orderId) => ({
        orderId,
        orderStatus: "sent",
        assignedCourierId: courierId,
        courierDepartureTime: now,
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
                courierDepartureTime: now,
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
        prev.map((c) => (c.PK === courierId ? { ...c, available: newAvailability } : c))
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
        prev.map((o) => (o.PK === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const groupSentOrdersByCourier = () => {
    const groups = {};
    sentOrders.forEach((order) => {
      const courier = getCourierName(order.assignedCourierId);
      if (!groups[courier]) groups[courier] = [];
      groups[courier].push(order);
    });
    return groups;
  };

  const formatAddress = (address) => {
    if (!address) return "No address provided";
    if (typeof address === "string") return address;
    return `${address.street}, ${address.city}`;
  };

  const formatDateIL = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${day}/${month}/${year} ${time}`;
  };

  const getCourierName = (courierId) => {
    const c = couriers.find((c) => c.PK === courierId);
    return c?.name || courierId;
  };

  const getStatusDisplay = (order) => {
    if (order.orderStatus === "sent" && order.assignedCourierId) {
      return `Sent with ${getCourierName(order.assignedCourierId)} (${order.assignedCourierId})`;
    }
    return order.orderStatus;
  };

  const deliveryStatusColor = (status) => {
    return {
      pending: "#fdecea",
      "in-preparation": "#fff4e5",
      ready: "#e6f4ea",
      sent: "#e0e0e0",
    }[status] || "#f0f0f0";
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

  const selectStyle = {
    padding: "8px 12px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    fontSize: "16px",
    marginRight: 10,
  };

  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: 32,
    borderRadius: 20,
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    zIndex: 1000,
    minWidth: 320,
    maxWidth: 520,
    width: "90%",
  };

  const sentGroups = groupSentOrdersByCourier();

  return (
    <section style={{ padding: "10px 18px" }}>
      {deliveryOrders.map((order) => (
        <div key={order.PK} style={{ backgroundColor: deliveryStatusColor(order.orderStatus), padding: 16, marginBottom: 12, borderRadius: 8, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
          <h4>Order #{order.PK}</h4>
          <p><strong>Status:</strong> {getStatusDisplay(order)}</p>
          <p><strong>User:</strong> {order.userId}</p>
          <p><strong>Address:</strong> {formatAddress(order.address)}</p>
          <p><strong>Items:</strong> {order.items?.map((i) => `${i.name || i.productId} × ${i.quantity}`).join(", ")}</p>
          <p><strong>Created At:</strong> {formatDateIL(order.createdAt)}</p>
          {order.estimatedArrivalTime && <p><strong>ETA:</strong> {formatDateIL(order.estimatedArrivalTime)}</p>}

          <div style={{ marginTop: 12, display: "flex", alignItems: "center" }}>
            <select value={statusChanges[order.PK] || order.orderStatus} onChange={(e) => handleStatusChange(order.PK, e.target.value)} style={selectStyle}>
              <option value="pending">Pending</option>
              <option value="in-preparation">In Preparation</option>
              <option value="ready">Ready</option>
              <option value="sent">Sent</option>
            </select>
            <button onClick={() => confirmStatusChange(order.PK)} style={{ ...buttonStyle, boxShadow: "none" }}>Confirm</button>
          </div>
        </div>
      ))}

      <div style={{ position: "fixed", bottom: 30, right: 30, display: "flex", gap: 16 }}>
        <button onClick={() => setShowSentModal(true)} style={buttonStyle}>View Sent Orders</button>
        <button onClick={() => setShowReadyModal(true)} style={buttonStyle}>Assign Courier</button>
        <button onClick={() => setShowCouriersModal(true)} style={buttonStyle}>Courier Status</button>
      </div>

      {showReadyModal && (
        <div style={modalStyle}>
          <h3>Select up to 5 orders</h3>
          {readyOrders.map((order) => (
            <label key={order.PK} style={{ display: "block", marginBottom: 8 }}>
              <input type="checkbox" checked={selectedOrders.includes(order.PK)} onChange={() => toggleOrderSelection(order.PK)} />
              <span style={{ marginLeft: 8 }}>Order #{order.PK.slice(-4)} — {formatAddress(order.address)}</span>
            </label>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <button onClick={() => setShowReadyModal(false)} style={{ ...buttonStyle, backgroundColor: "#6c757d" }}>Cancel</button>
            <button disabled={selectedOrders.length === 0} onClick={() => { setShowReadyModal(false); setShowCourierModal(true); }} style={{ ...buttonStyle, opacity: selectedOrders.length === 0 ? 0.5 : 1 }}>Next</button>
          </div>
        </div>
      )}

      {showCourierModal && (
        <div style={modalStyle}>
          <h3>Select Courier</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {couriers.map((c) => (
              <button
                key={c.PK}
                onClick={() => c.available && handleCourierSelect(c.PK)}
                style={{
                  ...buttonStyle,
                  backgroundColor: c.available ? "#28a745" : "#dc3545",
                  cursor: c.available ? "pointer" : "not-allowed",
                  opacity: c.available ? 1 : 0.6,
                }}
              >
                {c.name}
              </button>
            ))}
            <button onClick={() => setShowCourierModal(false)} style={{ ...buttonStyle, backgroundColor: "#6c757d" }}>Cancel</button>
          </div>
        </div>
      )}

      {showSentModal && (
        <div style={modalStyle}>
          <h3>Sent Orders by Courier</h3>
          {Object.entries(sentGroups).map(([courier, orders]) => (
            <div key={courier} style={{ marginBottom: 16 }}>
              <h4>{courier}</h4>
              <ul>
                {orders.map((o) => (
                  <li key={o.PK}>#{o.PK.slice(-4)} — {formatAddress(o.address)}</li>
                ))}
              </ul>
            </div>
          ))}
          <button onClick={() => setShowSentModal(false)} style={{ ...buttonStyle, backgroundColor: "#6c757d", marginTop: 12 }}>Close</button>
        </div>
      )}

      {showCouriersModal && (
        <div style={modalStyle}>
          <h3>Courier Status</h3>
          {couriers.map((c) => (
            <div key={c.PK} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span>{c.name}</span>
              <button onClick={() => updateCourierStatus(c.PK, !c.available)} style={{ ...buttonStyle, backgroundColor: c.available ? "#28a745" : "#dc3545" }}>
                {c.available ? "Available" : "Unavailable"}
              </button>
            </div>
          ))}
          <button onClick={() => setShowCouriersModal(false)} style={{ ...buttonStyle, backgroundColor: "#6c757d", marginTop: 16 }}>Close</button>
        </div>
      )}
    </section>
  );
};

export default DeliveryOrders;
