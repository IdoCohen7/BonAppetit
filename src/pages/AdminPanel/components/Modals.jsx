import React, { useEffect, useState } from "react";
import { formatAddress } from "./helpers";
import { apiFetch } from "../../../utils/api";


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
  minWidth: 360,
  maxWidth: 600,
  width: "95%",
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

const th = {
  borderBottom: "1px solid #ccc",
  padding: 10,
  textAlign: "left",
};

const td = {
  padding: 10,
  borderBottom: "1px solid #eee",
};

const tdCenter = {
  ...td,
  textAlign: "center",
};

export const ViewSentModal = ({ couriers, onClose }) => {
  const [sentOrders, setSentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await apiFetch("/Orders");
        const deliverySent = data.filter(
          (o) => o.orderType === "delivery" && o.orderStatus === "sent"
        );
        deliverySent.forEach((o) => {
          try {
            const addr = JSON.parse(o.address);
            o._addressString = addr.address;
          } catch {
            o._addressString = "Unknown";
          }
        });
        const sorted = deliverySent
          .filter((o) => o.deliveryPositionInRoute != null)
          .sort((a, b) => a.deliveryPositionInRoute - b.deliveryPositionInRoute);
        setSentOrders(sorted);
      } catch (err) {
        console.error("Failed to fetch updated sent orders", err);
        setSentOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const getTimeLeft = (order) => {
    if (!order.courierDepartureTime || order.etaMinutesFromDeparture == null) {
      return "Unknown";
    }
    const departure = new Date(order.courierDepartureTime);
    const arrival = new Date(departure.getTime() + order.etaMinutesFromDeparture * 60000);
    const diffMs = arrival - now;
    if (diffMs <= 0) return "Arrived";
    const mins = Math.floor(diffMs / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    return `${mins}m ${secs}s`;
  };

  const grouped = {};
  sentOrders.forEach((o) => {
    const name =
      couriers.find((c) => c.PK === o.assignedCourierId)?.name ||
      o.assignedCourierId ||
      "Unknown Courier";
    if (!grouped[name]) grouped[name] = [];
    grouped[name].push(o);
  });

  return (
    <div style={modalStyle}>
      <h3>Sent Orders</h3>
      {loading ? (
        <p>Loading...</p>
      ) : sentOrders.length === 0 ? (
        <p>No sent orders found.</p>
      ) : (
        <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: 10 }}>
          {Object.entries(grouped).map(([courier, orders]) => (
            <div key={courier} style={{ marginBottom: 16 }}>
              <h5 style={{ margin: "10px 0" }}>{courier}</h5>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>#</th>
                    <th style={th}>Order ID</th>
                    <th style={th}>Address</th>
                    <th style={th}>ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.PK}>
                      <td style={tdCenter}>{o.deliveryPositionInRoute}</td>
                      <td style={tdCenter}>{o.PK.slice(-4)}</td>
                      <td style={td}>{o._addressString}</td>
                      <td style={tdCenter}>{getTimeLeft(o)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={onClose}
        style={{ ...buttonStyle, backgroundColor: "#6c757d", marginTop: 20 }}
      >
        Close
      </button>
    </div>
  );
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

// export const ViewSentModal = ({ sentOrders, couriers, onClose }) => {
//   const [sortedSentOrders, setSortedSentOrders] = useState([]);
//   const [now, setNow] = useState(new Date());

//   useEffect(() => {
//     const interval = setInterval(() => setNow(new Date()), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const fetchAndSort = async () => {
//       try {
//         const res = await fetch("/Orders");
//         const data = await res.json();
//         const updatedOrders = data.filter((o) => o.orderStatus === "sent");
//         updatedOrders.sort((a, b) => (a.deliveryPositionInRoute || 0) - (b.deliveryPositionInRoute || 0));
//         setSortedSentOrders(updatedOrders);
//       } catch (e) {
//         console.error("Failed to fetch updated sent orders", e);
//         setSortedSentOrders(sentOrders);
//       }
//     };
//     fetchAndSort();
//   }, [sentOrders]);

//   const getRemainingTime = (order) => {
//     try {
//       if (!order.courierDepartureTime || !order.etaMinutesFromDeparture) return "Unknown";
//       const departure = new Date(order.courierDepartureTime);
//       const arrival = new Date(departure.getTime() + order.etaMinutesFromDeparture * 60000);
//       const diffMs = arrival - now;
//       if (diffMs <= 0) return "Arrived";
//       const mins = Math.floor(diffMs / 60000);
//       const secs = Math.floor((diffMs % 60000) / 1000);
//       return `${mins}:${secs.toString().padStart(2, "0")} min`;
//     } catch {
//       return "Error";
//     }
//   };

//   const groups = {};
//   sortedSentOrders.forEach((order) => {
//     const name =
//       couriers.find((c) => c.PK === order.assignedCourierId)?.name || order.assignedCourierId || "Unknown";
//     if (!groups[name]) groups[name] = [];
//     groups[name].push(order);
//   });

//   return (
//     <div style={modalStyle}>
//       <h3>Sent Orders by Courier</h3>
//       {Object.entries(groups).map(([courier, orders]) => (
//         <div key={courier} style={{ marginBottom: 16 }}>
//           <h4>{courier}</h4>
//           <ul>
//             {orders.map((o) => (
//               <li key={o.PK}>
//                 #{o.PK.slice(-4)} — {formatAddress(o.address)} — ETA: {getRemainingTime(o)}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//       <button
//         onClick={onClose}
//         style={{ ...buttonStyle, backgroundColor: "#6c757d", marginTop: 16 }}
//       >
//         Close
//       </button>
//     </div>
//   );
// };

export const CouriersStatusModal = ({ couriers, onUpdateStatus, onClose }) => (
  <div style={overlayStyle}>
    <div style={modalStyle}>
      <h3 style={{ marginBottom: 20 }}>Courier Status</h3>
      {couriers.map((c) => (
        <div
          key={c.PK}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
            borderBottom: "1px solid #eee",
            paddingBottom: 8,
          }}
        >
          <div>
            <div style={{ fontWeight: "bold" }}>{c.name}</div>
            <div style={{ fontSize: "0.9em", color: "#666" }}>{c.phone}</div>
          </div>
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
      <div style={{ textAlign: "right", marginTop: 24 }}>
        <button
          onClick={onClose}
          style={{ ...buttonStyle, backgroundColor: "#6c757d" }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};