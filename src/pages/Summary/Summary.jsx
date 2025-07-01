import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import { loadFromSessionStorage } from "../Helpers/storageUtils";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = [], method, address, eta } = location.state || {};

  const total = cart.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity;
  }, 0);

  const handleConfirm = async () => {
  try {
    const result = await sendOrder();
    console.log("Server response:", result);
    alert("Your order has been sent to the restaurant!");
    navigate("/");
  } catch (err) {
    alert("Error: " + err.message);
  }
};



const sendOrder = async () => {
  console.log(loadFromSessionStorage("bonapetit_cart"));
  
  const orderData = buildOrderData();

  if (!orderData.items || orderData.items.length === 0) {
    const message = "Cannot send order: cart is empty";
    console.error(message);
    throw new Error(message); // שינוי: לא Promise.reject אלא throw
  }

  try {
    const result = await apiFetch("/Orders", {
      method: "POST",
      body: JSON.stringify(orderData)
    });

    console.log("Order placed successfully:", result);
    sessionStorage.removeItem("orderItems");
    return result; // שינוי: אין צורך ב-Promise.resolve
  } catch (err) {
    console.error("API error:", err);
    throw err; // שינוי: לא Promise.reject אלא throw
  }
};

const buildOrderData = () => {
  return {
    items: loadFromSessionStorage("bonapetit_cart") || [],
    userId: loadFromSessionStorage("userId") || "unknown",
    orderType: loadFromSessionStorage("orderType") || "pickup",
    orderStatus: loadFromSessionStorage("orderStatus") || "pending",
    address: loadFromSessionStorage("address") || null,
    courierDepartureTime: loadFromSessionStorage("chosenTime") || null,
    estimatedArrivalTime: loadFromSessionStorage("orderEta") || null,
    assignedCourierId: loadFromSessionStorage("assignedCourierId") || null

  };
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
