import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MenuSection from "./components/MenuSection";
import Cart from "./components/Cart";
import FloatingCartButton from "./components/FloatingCartButton";
import Logo from "../../assets/images/Logo.png";
import { apiFetch } from "../../utils/api";
import { saveToSessionStorage } from "../Helpers/storageUtils";

const Delivery = () => {
  const location = useLocation();
  const { method, address, eta } = location.state || {};

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    apiFetch("/MenuItems")
      .then((data) => {
        const items = data;
        const availableItems = items.filter((item) => item.available);
        setMenuItems(availableItems);
        setCategories([...new Set(availableItems.map((i) => i.category))]);
      })
      .catch((err) => {
        console.error("Failed to fetch menu items:", err);
      });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("bonapetit_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("bonapetit_cart", JSON.stringify(cart));
    saveToSessionStorage("bonapetit_cart", cart);
  }, [cart]);

  return (
    <div className="delivery-page">
      <header className="header">
        <div className="container header-flex">
          <a href="/" className="logo">
            <img
              src={Logo}
              alt="BonApetit Logo"
              className="logo-img small-logo"
            />
          </a>
          <nav className="top-nav">
            <ul>
              <li>
                <a href="/">Return</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <aside className="side-nav" id="sideNav">
        <Sidebar categories={categories} />
      </aside>

      <main className="main">
        <section className="delivery-section">
          <h2 className="section-title">Place Your Order</h2>
          {categories.map((category) => (
            <MenuSection
              key={category}
              category={category}
              items={menuItems.filter((i) => i.category === category)}
              cart={cart}
              setCart={setCart}
            />
          ))}
        </section>
        <Cart
          cart={cart}
          setCart={setCart}
          menuItems={menuItems}
          location={{ state: { method, address, eta } }}
        />
        <FloatingCartButton cart={cart} />
      </main>

      <footer className="footer">
        <p>&copy; 2025 BonApetit. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Delivery;
