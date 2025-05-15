import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/orderMethod.css";
import Logo from "../../assets/images/Logo.png";

const OrderMethod = () => {
  const navigate = useNavigate();

  const chooseOption = (option) => {
    if (option === "pickup") {
      navigate("/Delivery");
    } else {
      navigate("/Delivery");
    }
  };

  return (
    <div className="order-container">
      <img src={Logo} alt="Restaurant Logo" className="logo-img" />
      <h2 className="order-title">How would you like to place your order?</h2>
      <button className="cta-button" onClick={() => chooseOption("pickup")}>
        Pickup 🚶‍♂
      </button>
      <button className="cta-button" onClick={() => chooseOption("delivery")}>
        Delivery 🚚
      </button>
      <div className="copyright">Powered by BonAppetit ©</div>
    </div>
  );
};

export default OrderMethod;
