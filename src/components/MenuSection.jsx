import React from "react";

const MenuSection = ({ category, items, cart, setCart }) => {
  const addToCart = (item, qty) => {
    const existing = cart.find((i) => i.PK === item.PK);
    if (existing) {
      existing.quantity += qty;
      setCart([...cart]);
    } else {
      setCart([...cart, { PK: item.PK, quantity: qty }]);
    }
  };

  return (
    <div className="menu-category" id={category.toLowerCase()}>
      <h3 className="category-title">{category}</h3>
      <div className="delivery-list">
        {items.map((item) => (
          <MenuItem key={item.PK} item={item} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

const MenuItem = ({ item, addToCart }) => {
  const [qty, setQty] = React.useState(1);

  return (
    <div className="delivery-item">
      <img src={item.img} alt={item.name} className="delivery-img" />
      <div className="delivery-info">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <p>
          <strong>₪{item.price}</strong>
        </p>
        <div className="controls">
          <div className="qty-control">
            <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
            <span className="qty">{qty}</span>
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>
          <button className="add-btn" onClick={() => addToCart(item, qty)}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuSection;
