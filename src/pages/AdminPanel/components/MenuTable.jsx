import React, { useState, useEffect } from "react";
import { apiFetch } from "../../../utils/api"; // Adjust path if needed

const MenuTable = ({ items: initialItems }) => {
  const [items, setItems] = useState(initialItems);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    apiFetch("/MenuItems")
      .then((data) => {
        const items = JSON.parse(data.body);
        setItems(items);
      })
      .catch((err) => {
        console.error("Failed to load menu items:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleToggle = async (PK, SK) => {
    const index = items.findIndex((item) => item.PK === PK && item.SK === SK);
    if (index === -1) return;

    const currentItem = items[index];
    const itemId = currentItem.PK;
    const newAvailable = !currentItem.available;

    try {
      await apiFetch("/MenuItems", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });

      const updatedItems = [...items];
      updatedItems[index] = {
        ...currentItem,
        available: newAvailable,
      };
      setItems(updatedItems);
    } catch (error) {
      alert("Failed to update item status.");
      console.error(error);
    }
  };

  const handleEdit = (item) => {
    alert(`Editing item: ${item.name}`);
  };

  return (
    <section className="section">
      <h2>Menu</h2>

      {isLoading ? (
        <div className="spinner"></div>
      ) : (
        <table className="menu-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="5">No menu items available.</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={`${item.PK}-${item.SK}`}>
                  <td>
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>₪{item.price}</td>
                  <td>
                    <span
                      onClick={() => handleToggle(item.PK, item.SK)}
                      style={{
                        color: item.available ? "green" : "red",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      {item.available ? "AVAILABLE" : "UNAVAILABLE"}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default MenuTable;
