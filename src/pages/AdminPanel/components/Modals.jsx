import React from "react";
import { formatAddress } from "./helpers";

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

export const AssignCourierModal = ({
  readyOrders,
  selectedOrders,
  setSelectedOrders,
  onCancel,
  onNext,
}) => (
  <div style={modalStyle}>
    <h3>Select up to 5 orders</h3>
    {readyOrders.map((order) => (
      <label key={order.PK} style={{ display: "block", marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={selectedOrders.includes(order.PK)}
          onChange={() => {
            setSelectedOrders((prev) =>
              prev.includes(order.PK)
                ? prev.filter((id) => id !== order.PK)
                : prev.length < 5
                ? [...prev, order.PK]
                : prev
            );
          }}
        />
        <span style={{ marginLeft: 8 }}>
          Order #{order.PK.slice(-4)} — {formatAddress(order.address)}
        </span>
      </label>
    ))}
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
      <button onClick={onCancel} style={{ ...buttonStyle, backgroundColor: "#6c757d" }}>
        Cancel
      </button>
      <button
        disabled={selectedOrders.length === 0}
        onClick={onNext}
        style={{ ...buttonStyle, opacity: selectedOrders.length === 0 ? 0.5 : 1 }}
      >
        Next
      </button>
    </div>
  </div>
);

AssignCourierModal.SelectCourier = ({ couriers, onCancel, onSelect }) => (
  <div style={modalStyle}>
    <h3>Select Courier</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {couriers.map((c) => (
        <button
          key={c.PK}
          onClick={() => c.available && onSelect(c.PK)}
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
      <button onClick={onCancel} style={{ ...buttonStyle, backgroundColor: "#6c757d" }}>
        Cancel
      </button>
    </div>
  </div>
);

export const ViewSentModal = ({ sentOrders, couriers, onClose }) => {
  const groups = {};
  sentOrders.forEach((order) => {
    const name =
      couriers.find((c) => c.PK === order.assignedCourierId)?.name ||
      order.assignedCourierId ||
      "Unknown";
    if (!groups[name]) groups[name] = [];
    groups[name].push(order);
  });

  return (
    <div style={modalStyle}>
      <h3>Sent Orders by Courier</h3>
      {Object.entries(groups).map(([courier, orders]) => (
        <div key={courier} style={{ marginBottom: 16 }}>
          <h4>{courier}</h4>
          <ul>
            {orders.map((o) => (
              <li key={o.PK}>
                #{o.PK.slice(-4)} — {formatAddress(o.address)}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button
        onClick={onClose}
        style={{ ...buttonStyle, backgroundColor: "#6c757d", marginTop: 16 }}
      >
        Close
      </button>
    </div>
  );
};

export const CouriersStatusModal = ({ couriers, onUpdateStatus, onClose }) => (
  <div style={modalStyle}>
    <h3>Courier Status</h3>
    {couriers.map((c) => (
      <div
        key={c.PK}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <span>{c.name}</span>
        <button
          onClick={() => onUpdateStatus(c.PK, !c.available)}
          style={{
            ...buttonStyle,
            backgroundColor: c.available ? "#28a745" : "#dc3545",
          }}
        >
          {c.available ? "Available" : "Unavailable"}
        </button>
      </div>
    ))}
    <button
      onClick={onClose}
      style={{ ...buttonStyle, backgroundColor: "#6c757d", marginTop: 16 }}
    >
      Close
    </button>
  </div>
);
