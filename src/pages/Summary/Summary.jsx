import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import { loadFromSessionStorage } from "../Helpers/storageUtils";
import { useState } from "react";
import TopBar from "../Helpers/TopBar";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = [], method, address, eta } = location.state || {};
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const total = cart.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity;
  }, 0);

  const isLoggedIn = !!sessionStorage.getItem("id_token");

  const handleConfirm = async () => {
    if (!isLoggedIn) {
      alert("You must be logged in to place an order.");
      return;
    }

    const idToken = sessionStorage.getItem("id_token");
    if (!idToken) {
      alert("Login is required to place an order.");
      return;
    }

    try {
      const result = await sendOrder(idToken);
      console.log("Server response:", result);
      alert("Your order has been sent to the restaurant!");
      navigate(`/track?id=${result.orderId}`);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const sendOrder = async (idToken) => {
    const orderData = buildOrderData();

    if (!orderData.items || orderData.items.length === 0) {
      const message = "Cannot send order: cart is empty";
      console.error(message);
      throw new Error(message);
    }

    try {
      const response = await apiFetch("/RestaurantStatus");
      if (!response.isOpen) {
        alert("The restaurant is currently closed. Please try again later.");
        navigate("/");
        return;
      }

      const result = await apiFetch("/Orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(orderData),
      });

      return result;
    } catch (err) {
      console.error("API error:", err);
      throw err;
    } finally {
      sessionStorage.removeItem("orderItems");
    }
  };

  const buildOrderData = () => {
    return {
      items: loadFromSessionStorage("bonapetit_cart") || [],
      orderType: loadFromSessionStorage("orderType") || "pickup",
      orderStatus: loadFromSessionStorage("orderStatus") || "pending",
      address: loadFromSessionStorage("address") || null,
      courierDepartureTime: loadFromSessionStorage("chosenTime") || null,
      estimatedArrivalTime: loadFromSessionStorage("orderEta") || null,
      assignedCourierId: loadFromSessionStorage("assignedCourierId") || null,
    };
  };

  const formatEta = (etaValue) => {
    if (!etaValue) return "N/A";
    const date = new Date(etaValue);
    if (isNaN(date.getTime())) return etaValue;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getFormattedAddress = () => {
    // אם זה אובייקט עם שדה 'address'
    if (typeof address === "object" && address?.address) {
      return address.address;
    }

    // אם זה פשוט מחרוזת (fallback)
    if (typeof address === "string") {
      return address;
    }

    return "N/A";
  };

  const addressObj = JSON.parse(loadFromSessionStorage("address"));

  return (
    <div className="order-summary-page">
      <TopBar />

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
            <strong>Address:</strong> {addressObj.address}
          </p>
          <p>
            <strong>Estimated Arrival:</strong> {formatEta(eta)}
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
