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
      .then((data) => {
        console.log("Order data:", data);
        setOrder(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const getProgress = (status) => {
    switch (status) {
      case "in-preparation":
        return { percent: 30, color: "#e74c3c" }; // אדום
      case "on-the-way":
        return { percent: 70, color: "#e67e22" }; // כתום
      case "delivered":
      case "ready":
        return { percent: 100, color: "#2ecc71" }; // ירוק
      default:
        return { percent: 0, color: "#ccc" };
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!order) return <div>No order data available.</div>;

  const progress = getProgress(order.orderStatus);

  return (
    <div className="track-container">
      <h2>Order Details</h2>

      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{
            width: `${progress.percent}%`,
            backgroundColor: progress.color,
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
            <strong>Estimated Arrival:</strong> {order.estimatedArrivalTime}
          </p>
        </>
      )}
      <p>
        <strong>Created At:</strong> {order.createdAt}
      </p>
      <p>
        <strong>Items:</strong>
      </p>
      <ul>
        {order.items?.length > 0 ? (
          order.items.map((item, index) => (
            <li key={index}>
              {item.quantity}× {item.name}
            </li>
          ))
        ) : (
          <li>No items found</li>
        )}
      </ul>
    </div>
  );
};

export default TrackPage;
