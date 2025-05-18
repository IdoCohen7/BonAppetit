import React from "react";

const PickupOrders = ({ orders }) => {
  const pickupOrders = orders.filter((order) => order.orderType === "pickup");

  return (
    <section className="section">
      <h2>Pickup Orders</h2>
      <div>
        {pickupOrders.length === 0 ? (
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
                {order.orderStatus === "completed" ? (
                  <p>✅ Collected</p>
                ) : (
                  <button
                    onClick={() => alert("Mark as collected logic here")}
                    className="mark-complete-btn"
                  >
                    ✔️ Mark as Collected
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
