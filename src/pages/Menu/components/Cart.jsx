import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Cart = ({ cart, menuItems }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCart = () => setOpen(!open);

  const checkout = () => {
    const { method, address, eta } = location.state || {};

    const enrichedCart = cart.map((entry) => {
      const item = menuItems.find((i) => i.PK === entry.PK);
      return {
        ...entry,
        name: item?.name || "Unknown",
        price: item?.price || 0,
      };
    });

    const orderData = {
      cart: enrichedCart,
      method,
      ...(method === "delivery" && { address, eta }),
    };

    navigate("/summary", { state: orderData });
  };

  const total = cart.reduce((sum, entry) => {
    const item = menuItems.find((i) => i.PK === entry.PK);
    return item ? sum + item.price * entry.quantity : sum;
  }, 0);

  return (
    <div className={`cart-panel ${open ? "open" : ""}`} id="cart">
      <button className="cart-close" onClick={toggleCart}>
        ✕
      </button>
      <h3>🛒 Your Cart</h3>
      <div id="cart-items">
        {cart.map((entry) => {
          const item = menuItems.find((i) => i.PK === entry.PK);
          if (!item) return null;
          return (
            <div key={entry.PK}>
              {item.name} × {entry.quantity} — ₪
              {(item.price * entry.quantity).toFixed(2)}
            </div>
          );
        })}
      </div>
      <div className="cart-summary">
        <span>Total:</span>
        <strong>
          ₪<span id="cart-total">{total.toFixed(2)}</span>
        </strong>
      </div>
      <button id="checkout-btn" onClick={checkout}>
        Checkout
      </button>
    </div>
  );
};

export default Cart;
