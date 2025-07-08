import React, { useEffect, useState } from 'react';
import { apiFetch } from "../../../utils/api";

// Enrich item data with menu item details
const enrichItems = (orderItems, menuItems) => {
  return orderItems.map((item) => {
    const match = menuItems.find((m) => m.PK === item.PK);
    return {
      name: match?.name || item.PK,
      price: match?.price || 0,
      img: match?.img || '',
      quantity: item.quantity,
      total: (match?.price || 0) * item.quantity,
    };
  });
};

// Format ISO date to readable
const formatDate = (iso) => {
  const date = new Date(iso);
  return date.toLocaleString('en-GB', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

// Add minutes to ISO timestamp
const addMinutes = (isoTime, minutes) => {
  const date = new Date(isoTime);
  date.setMinutes(date.getMinutes() + minutes);
  return formatDate(date.toISOString());
};

// Calculate total cost of enriched items
const calculateOrderTotal = (items) => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

// Generate consistent light background colors for couriers
const generateCourierColors = (orders) => {
  const uniqueCouriers = [...new Set(orders.map(o => o.assignedCourierId))];
  const colors = [
    "#e3f2fd", "#e8f5e9", "#fff3e0", "#f3e5f5", "#fbe9e7",
    "#ede7f6", "#f9fbe7", "#e0f2f1", "#fffde7", "#fce4ec"
  ];
  const courierColorMap = {};
  uniqueCouriers.forEach((cid, index) => {
    courierColorMap[cid] = colors[index % colors.length];
  });
  return courierColorMap;
};

const History = () => {
  const [history, setHistory] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    Promise.all([
      apiFetch("/Orders/History"),
      apiFetch("/MenuItems")
    ])
      .then(([historyRes, menuRes]) => {
        setHistory(historyRes.history);
        setMenuItems(menuRes);
      })
      .catch((err) => setError(err.message));
  }, []);

  const toggleRow = (orderId) => {
    setExpandedRows(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const courierColors = generateCourierColors(history);

  // Sort history by estimated arrival time (descending)
  const sortedHistory = [...history].sort((a, b) => {
    const aTime = new Date(a.courierDepartureTime).getTime() + (a.etaMinutesFromDeparture || 0) * 60000;
    const bTime = new Date(b.courierDepartureTime).getTime() + (b.etaMinutesFromDeparture || 0) * 60000;
    return bTime - aTime;
  });

  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Delivery History</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#f5f5f5' }}>
          <tr>
            <th style={th}>Order ID</th>
            <th style={th}>User ID</th>
            <th style={th}>Address</th>
            <th style={th}>Created at</th>
            <th style={th}>Dispatched at</th>
            <th style={th}>Arrived at</th>
            <th style={th}>Items</th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map((order) => {
            const address = JSON.parse(order.address || '{}');
            const enriched = enrichItems(order.items, menuItems);
            const arrivalTime = order.courierDepartureTime && order.etaMinutesFromDeparture
              ? addMinutes(order.courierDepartureTime, order.etaMinutesFromDeparture)
              : 'Unknown';
            const bgColor = courierColors[order.assignedCourierId] || 'transparent';

            return (
              <React.Fragment key={order.pk}>
                <tr style={{ borderBottom: '1px solid #ddd', backgroundColor: bgColor }}>
                  <td style={td}>{order.pk}</td>
                  <td style={td}>{order.userId}</td>
                  <td style={td}>{address.address}</td>
                  <td style={td}>{formatDate(order.createdAt)}</td>
                  <td style={td}>{formatDate(order.courierDepartureTime)}</td>
                  <td style={td}>{arrivalTime}</td>
                  <td style={td}>
                    <button
                      style={button}
                      onClick={() => toggleRow(order.pk)}
                    >
                      {expandedRows[order.pk] ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {expandedRows[order.pk] && (
                  <tr style={{ backgroundColor: bgColor }}>
                    <td colSpan="7" style={{ padding: '1rem 2rem' }}>
                      <div>
                        <h4>Items:</h4>
                        {enriched.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <img src={item.img} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6, marginRight: 10 }} />
                            <div>
                              <div>{item.name} × {item.quantity}</div>
                              <div style={{ fontSize: '0.9em', color: '#666' }}>
                                Price: ₪{item.price} — Total: ₪{item.total}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                          Order Total: ₪{calculateOrderTotal(enriched)}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Basic styling for headers, cells, buttons
const th = {
  padding: '12px',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
  fontWeight: 'bold',
};

const td = {
  padding: '12px',
  borderBottom: '1px solid #eee',
};

const button = {
  padding: '6px 12px',
  backgroundColor: '#007BFF',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default History;
