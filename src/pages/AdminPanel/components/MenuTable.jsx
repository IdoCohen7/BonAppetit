import React, { useState, useEffect } from "react";
import { apiFetch } from "../../../utils/api";

const MenuTable = ({ items: initialItems }) => {
  const [items, setItems] = useState(initialItems);
  const [isLoading, setIsLoading] = useState(true);
  const [editItem, setEditItem] = useState(null); // פריט העריכה הנוכחי
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    setIsLoading(true);
    apiFetch("/MenuItems")
      .then((data) => {
        setItems(data);
      })
      .catch((err) => {
        console.error("Failed to load menu items:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // טיפול בשדות הקלט
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // טיפול בלחיצה על כפתור EDIT
  const handleEdit = (item) => {
    setEditItem(item.PK); // מגדיר את ה-PK של המנה שהולכים לערוך
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description,
    });
  };

  // טיפול בלחיצה על SAVE
  const handleSave = async () => {
    try {
      await apiFetch("/MenuItems", {
        method: "PUT",
        body: JSON.stringify({
          itemId: editItem,
          ...formData,
        }),
      });

      const updatedItems = items.map((item) =>
        item.PK === editItem ? { ...item, ...formData } : item
      );
      setItems(updatedItems);
      setEditItem(null); // סגירת עריכת המנה
    } catch (err) {
      alert("Failed to save changes");
      console.error(err);
    }
  };

  // טיפול בהפיכת המנה לזמינה / לא זמינה
  const handleToggle = async (PK) => {
    const index = items.findIndex((item) => item.PK === PK);
    if (index === -1) return;

    const currentItem = items[index];
    const newAvailable = !currentItem.available;

    try {
      await apiFetch("/MenuItems", {
        method: "PATCH",
        body: JSON.stringify({
          itemId: PK,
        }),
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
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="6">No menu items available.</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.PK}>
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
                  <td>
                    {editItem === item.PK ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td>
                    {editItem === item.PK ? (
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    ) : (
                      item.description
                    )}
                  </td>
                  <td>
                    {editItem === item.PK ? (
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    ) : (
                      `₪${item.price}`
                    )}
                  </td>
                  <td>
                    <span
                      onClick={() => handleToggle(item.PK)}
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
                    {editItem === item.PK ? (
                      <button onClick={handleSave}>Save</button>
                    ) : (
                      <button onClick={() => handleEdit(item)}>Edit</button>
                    )}
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
