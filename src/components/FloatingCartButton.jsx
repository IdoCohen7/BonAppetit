import React from "react";

const FloatingCartButton = ({ cart }) => {
  const count = cart.reduce((sum, entry) => sum + entry.quantity, 0);

  const toggleCart = () => {
    const cartEl = document.getElementById("cart");
    if (cartEl) {
      cartEl.classList.toggle("open");
    }
  };

  return (
    <button
      className="floating-cart"
      onClick={toggleCart}
      aria-label="Open shopping cart"
    >
      🛒<span id="cart-count">{count}</span>
    </button>
  );
};

export default FloatingCartButton;
