import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";
import AddressInput from "./components/AdressInput";
import TimePickerWrapper from "./components/TimePicker";
import { saveToLocalStorage } from "../Helpers/storageUtils";




const OrderMethod = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("initial");
  const [address, setAddress] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const [addressData, setAddressData] = useState(null);

  const handleAddressSelect = (data) => {
    setAddressData(data);
  };

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
    if (addressData == null) {
      alert("Please enter your address.");
      return;
    }

    try {
      saveToLocalStorage("address", JSON.stringify(addressData));
      console.log("Address saved:", addressData);
      // Replace this mock with actual fetch to your Lambda function
      // const data = 3; // Mock: delivery ETA in hours
      // const etaDate = new Date(Date.now() + data * 60 * 60 * 1000);
      // setEstimatedTime(
      //   etaDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      // );
      // setStep("confirm");
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
            <h2>Enter Delivery Address</h2>
            <AddressInput onAddressSelect={handleAddressSelect} />
            {/* {addressData && (
              <div>
                <p><strong>Address:</strong> {addressData.address}</p>
                <p><strong>Lat:</strong> {addressData.lat}</p>
                <p><strong>Lng:</strong> {addressData.lng}</p>
              </div>
            )} */}
          <TimePickerWrapper />
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
