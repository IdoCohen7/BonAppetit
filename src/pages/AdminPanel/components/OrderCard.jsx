import React from "react";
import { formatAddress, getCountdown, deliveryStatusColor, formatDateIL } from "./helpers";

const OrderCard = ({ order, now, courierName, onStatusChange, onConfirmStatus, newStatus }) => {
  const countdown = getCountdown(order.courierDepartureTime, now);
  const items = order.items?.map((i) => `${i.name || "Unnamed Item"} × ${i.quantity ?? 1}`).join(", ");
  const totalPrice = order.items?.reduce((sum, i) => sum + ((i.price || 0) * (i.quantity || 1)), 0).toFixed(2);

  const selectStyle = {
    padding: "8px 12px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    fontSize: "16px",
    marginRight: 10,
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        backgroundColor: deliveryStatusColor(order.orderStatus),
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          transform: "rotate(5deg)",
          fontWeight: "bold",
          fontSize: "15px",
          color: "#333",
        }}
      >
        ₪{totalPrice}
      </div>

      <h4>Order #{order.PK.slice(-4)}</h4>
      <p><strong>Status:</strong> {order.orderStatus === "sent" ? `Sent with ${courierName}` : order.orderStatus}</p>
      <p><strong>User:</strong> {order.userId || "Unknown"}</p>
      <p><strong>Address:</strong> {formatAddress(order.address)}</p>
      <p><strong>Items:</strong> {items}</p>
      <p><strong>Created At:</strong> {formatDateIL(order.createdAt)}</p>
      {order.estimatedArrivalTime && (
        <p><strong>ETA:</strong> {formatDateIL(order.estimatedArrivalTime)}</p>
      )}
      {order.orderStatus !== "sent" && countdown && (
        <div
          style={{
            backgroundColor: countdown.delayed ? "#f8d7da" : "#e3f2fd",
            color: countdown.delayed ? "#721c24" : "#0d47a1",
            padding: "6px 12px",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "14px",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>🕒</span>
          {countdown.text}
        </div>
      )}

      <div style={{ marginTop: 12, display: "flex", alignItems: "center" }}>
        <select
          value={newStatus || order.orderStatus}
          onChange={(e) => onStatusChange(order.PK, e.target.value)}
          style={selectStyle}
        >
          <option value="pending">Pending</option>
          <option value="in-preparation">In Preparation</option>
          <option value="ready">Ready</option>
          <option value="sent">Sent</option>
        </select>
        <button onClick={() => onConfirmStatus(order.PK)} style={buttonStyle}>Confirm</button>
      </div>
    </div>
  );
};

export default OrderCard;
