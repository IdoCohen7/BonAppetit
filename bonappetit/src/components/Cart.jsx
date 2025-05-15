import React, { useState } from "react";

const Cart = ({ cart, setCart, menuItems }) => {
  const [open, setOpen] = useState(false);

  const toggleCart = () => setOpen(!open);

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
      <button id="checkout-btn">Checkout</button>
    </div>
  );
};

export default Cart;
