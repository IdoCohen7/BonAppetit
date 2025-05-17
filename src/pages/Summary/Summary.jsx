import { useLocation, useNavigate } from "react-router-dom";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = [], method, address, eta } = location.state || {};

  const total = cart.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity;
  }, 0);

  const handleConfirm = () => {
    // TODO: Send order to backend
    alert("Your order has been sent to the restaurant!");
    navigate("/");
  };

  return (
    <div className="order-summary-page">
      <h2>Order Summary</h2>

      <ul className="order-list">
        {cart.map((item, index) => (
          <li key={index}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₪{(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="order-total">
        <strong>Total:</strong> ₪{total.toFixed(2)}
      </div>

      {method === "delivery" ? (
        <div className="delivery-details">
          <p>
            <strong>Address:</strong> {address}
          </p>
          <p>
            <strong>Estimated Arrival:</strong> {eta}
          </p>
          <p>Please pay the courier in cash.</p>
        </div>
      ) : (
        <div className="pickup-details">
          <p>Please pay in cash upon pickup at the restaurant.</p>
        </div>
      )}

      <button className="cta-button" onClick={handleConfirm}>
        Confirm Order
      </button>
    </div>
  );
};

export default OrderSummary;
