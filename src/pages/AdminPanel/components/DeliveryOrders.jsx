import React from "react";

const DeliveryOrders = ({ orders, couriers }) => {
  const deliveryOrders = orders.filter(
    (order) => order.orderType === "delivery"
  );

  return (
    <section className="section">
      <h2>Delivery Orders</h2>
      <div>
        {deliveryOrders.length === 0 ? (
          <p>No delivery orders available.</p>
        ) : (
          deliveryOrders.map((order) => {
            const itemsStr =
              order.items?.map((i) => `${i.name} x${i.quantity}`).join(", ") ||
              "";
            // eslint-disable-next-line
            const courier = couriers.find(
              (c) => c.PK === order.assignedCourierId
            );
            const eta = order.estimatedArrivalTime
              ? new Date(order.estimatedArrivalTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : null;

            return (
              <div key={order.PK} className="order-card">
                <h3>Order #{order.PK}</h3>
                <p>Items: {itemsStr}</p>
                <p>Status: {order.orderStatus}</p>
                {order.orderStatus === "in-transit" && eta && (
                  <>
                    <p>ETA: {eta}</p>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: "80%" }}></div>
                    </div>
                  </>
                )}
                {order.orderStatus === "completed" && <p>✅ Completed</p>}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default DeliveryOrders;
