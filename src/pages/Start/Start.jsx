import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";

const OrderMethod = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("initial");
  const [address, setAddress] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const chooseOption = (option) => {
    if (option === "pickup") {
      navigate("/menu", {
        state: {
          method: "pickup",
        },
      });
    } else if (option === "delivery") {
      setStep("address");
    }
  };

  const handleAddressSubmit = async () => {
    if (address.trim() === "") {
      alert("Please enter your address.");
      return;
    }

    try {
      // Replace this mock with actual fetch to your Lambda function
      const data = 3; // Mock: delivery ETA in hours
      const etaDate = new Date(Date.now() + data * 60 * 60 * 1000);
      setEstimatedTime(
        etaDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      setStep("confirm");
    } catch (err) {
      console.error("Failed to get ETA:", err);
      alert("Failed to calculate delivery time. Please try again.");
    }
  };

  const confirmDelivery = (proceed) => {
    if (proceed) {
      navigate("/menu", {
        state: {
          method: "delivery",
          address,
          eta: estimatedTime,
        },
      });
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="order-page">
      <div className="order-container">
        <img src={Logo} alt="Restaurant Logo" className="logo-img" />
        <h2 className="order-title">How would you like to place your order?</h2>

        {step === "initial" && (
          <>
            <button
              className="cta-button"
              onClick={() => chooseOption("pickup")}
            >
              Pickup 🚶‍♂
            </button>
            <button
              className="cta-button"
              onClick={() => chooseOption("delivery")}
            >
              Delivery 🚚
            </button>
          </>
        )}

        {step === "address" && (
          <div className="address-input-container">
            <input
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="address-input"
            />
            <button className="cta-button" onClick={handleAddressSubmit}>
              Continue
            </button>
          </div>
        )}

        {step === "confirm" && (
          <div className="confirmation-container">
            <p>
              Estimated delivery time to <strong>{address}</strong> is:{" "}
              <strong>{estimatedTime}</strong>
            </p>
            <p>Do you want to continue with your order?</p>
            <div className="confirm-buttons">
              <button
                className="cta-button"
                onClick={() => confirmDelivery(true)}
              >
                Yes, proceed
              </button>
              <button
                className="cta-button cancel"
                onClick={() => confirmDelivery(false)}
              >
                No, go back
              </button>
            </div>
          </div>
        )}

        <div className="copyright">Powered by BonAppetit ©</div>
      </div>
    </div>
  );
};

export default OrderMethod;
