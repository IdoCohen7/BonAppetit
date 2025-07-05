import React, { useEffect, useRef, useState } from "react";
import { apiFetch } from "../../../utils/api";

const History = () => {
  const tableRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/Orders/History")
      .then((data) => setOrders(data))
      .catch((err) => console.error("Failed to fetch", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (orders.length > 0 && window.$.fn.dataTable) {
      tableRef.current.DataTable();
    }
  }, [orders]);

  const formatDate = (str) => {
    if (!str) return "-";
    const d = new Date(str);
    return `${d.toLocaleTimeString("en-IL", {
      hour: "2-digit",
      minute: "2-digit",
    })} | ${d.toLocaleDateString("en-IL")}`;
  };

  const parseAddress = (addr) => {
    if (!addr) return "-";
    try {
      return JSON.parse(addr).address || "-";
    } catch {
      return "-";
    }
  };

  return (
    <section className="section">
      <h2>Monthly Order History</h2>

      {loading ? (
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <div className="table-responsive">
          <table
            ref={tableRef}
            className="table table-bordered table-hover"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Address</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx}>
                  <td>{order.sk || order.SK}</td>
                  <td>{order.orderType}</td>
                  <td>{order.orderStatus}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{parseAddress(order.address)}</td>
                  <td>
                    <ul className="mb-0 ps-3">
                      {order.items?.map((i, iIdx) => (
                        <li key={iIdx}>
                          {(i.name || i.PK) + " x" + i.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default History;
