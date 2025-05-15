import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import MenuSection from "../../components/MenuSection";
import Cart from "../../components/Cart";
import FloatingCartButton from "../../components/FloatingCartButton";
import "../../styles/Delivery.css";
import Logo from "../../assets/images/Logo.png";

const Delivery = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("/mockMenu.json")
      .then((res) => res.json())
      .then((data) => {
        const availableItems = data.menuItems.filter((item) => item.available);
        setMenuItems(availableItems);
        setCategories([...new Set(availableItems.map((i) => i.category))]);
      });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("bonapetit_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("bonapetit_cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <>
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
        <section className="container delivery-section">
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
        <Cart cart={cart} setCart={setCart} menuItems={menuItems} />
        <FloatingCartButton cart={cart} />
      </main>

      <footer className="footer">
        <p>&copy; 2025 BonApetit. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Delivery;
