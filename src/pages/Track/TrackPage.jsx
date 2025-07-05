import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../../utils/api";

const TrackPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided in URL.");
      setLoading(false);
      return;
    }

    apiFetch(`/Orders/${orderId}`)
      .then((data) => setOrder(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  const getProgress = (status, type) => {
    if (type === "pickup") {
      switch (status) {
        case "in-preparation":
          return { percent: 30, color: "#e74c3c" };
        case "ready":
          return { percent: 70, color: "#f39c12" };
        case "collected":
          return { percent: 100, color: "#2ecc71" };
        default:
          return { percent: 0, color: "#ccc" };
      }
    } else {
      // delivery
      switch (status) {
        case "in-preparation":
          return { percent: 33, color: "#e74c3c" };
        case "ready":
          return { percent: 66, color: "#e67e22" };
        case "sent":
        case "ready":
          return { percent: 100, color: "#2ecc71" };
        default:
          return { percent: 0, color: "#ccc" };
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jerusalem",
    })} | ${date.toLocaleDateString("en-IL", {
      timeZone: "Asia/Jerusalem",
    })}`;
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!order) return <div>No order data available.</div>;
  console.log("Order data:", order);
  const progress = getProgress(order.orderStatus, order.orderType);

  return (
    <div className="track-container">
      <h2>Order Details</h2>

      <div
        className="progress-bar-container"
        style={{
          height: "12px",
          borderRadius: "8px",
          backgroundColor: "#eee",
          marginBottom: "1rem",
        }}
      >
        <div
          className="progress-bar-fill"
          style={{
            width: `${progress.percent}%`,
            backgroundColor: progress.color,
            height: "100%",
            borderRadius: "8px",
            transition: "width 0.5s ease",
          }}
        />
      </div>

      <p>
        <strong>Status:</strong> {order.orderStatus}
      </p>
      <p>
        <strong>Type:</strong> {order.orderType}
      </p>

      {order.orderType === "delivery" && (
        <>
          <p>
            <strong>Address:</strong> {JSON.parse(order.address).address}
          </p>
          <p>
            <strong>Estimated Arrival:</strong>{" "}
            {formatDate(order.estimatedArrivalTime)}
          </p>
        </>
      )}

      <p>
        <strong>Created At:</strong> {formatDate(order.createdAt)}
      </p>

      <div style={{ marginTop: "2rem" }}>
        <h3 style={{ color: "#b58b56" }}>Items:</h3>
        {order.items?.length > 0 ? (
          <div style={{ display: "grid", gap: "1rem" }}>
            {order.items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "1rem",
                  background: "#fff8f0",
                  padding: "1rem",
                  borderRadius: "8px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  style={{
                    width: "64px",
                    height: "64px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div style={{ flexGrow: 1 }}>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{item.name}</p>
                  <p
                    style={{
                      margin: "0.25rem 0",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    {item.description}
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>{item.quantity}×</strong> ₪{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No items found</p>
        )}
      </div>
    </div>
  );
};

export default TrackPage;
