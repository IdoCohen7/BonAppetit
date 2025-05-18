import React from "react";

const Couriers = ({ couriers }) => {
  return (
    <section className="section">
      <h2>Couriers</h2>
      <div className="courier-list">
        {couriers.length === 0 ? (
          <p>No couriers available.</p>
        ) : (
          couriers.map((c) => (
            <div key={c.PK} className="courier-card">
              <strong>{c.name}</strong>
              <p>Phone: {c.phone}</p>
              <p>Status: {c.available ? "Available" : "Unavailable"}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Couriers;
