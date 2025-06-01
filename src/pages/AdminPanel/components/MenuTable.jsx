import React, { useState, useEffect } from "react";
import { apiFetch } from "../../../utils/api";

const MenuTable = ({ items: initialItems }) => {
  const [items, setItems] = useState(initialItems);
  const [isLoading, setIsLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);

  const EditModal = ({ item, onSave, onClose }) => {
    const [form, setForm] = useState({
      name: item.name,
      price: item.price,
      description: item.description,
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    };

    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Edit Menu Item</h3>
          <label>
            Name:
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>
            Price:
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>
          <div className="modal-actions">
            <button onClick={() => onSave(form)}>Save</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setIsLoading(true);
    apiFetch("/MenuItems")
      .then((data) => {
        const items = data;
        setItems(items);
      })
      .catch((err) => {
        console.error("Failed to load menu items:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

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

  const handleEdit = (item) => {
    setEditItem(item);
  };

  const handleSave = async (formData) => {
    try {
      await apiFetch("/MenuItems", {
        method: "PUT",
        body: JSON.stringify({
          itemId: editItem.PK,
          ...formData,
        }),
      });

      const updatedItems = items.map((i) =>
        i.PK === editItem.PK ? { ...i, ...formData } : i
      );
      setItems(updatedItems);
      setEditItem(null);
    } catch (err) {
      alert("Failed to save changes");
      console.error(err);
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
                <tr key={`${item.PK}`}>
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
                  <td>{item.description}</td>
                  <td>₪{item.price}</td>
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
                    <button onClick={() => handleEdit(item)}>Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Modal מופיע רק אם יש פריט לעריכה */}
      {editItem && (
        <EditModal
          item={editItem}
          onSave={handleSave}
          onClose={() => setEditItem(null)}
        />
      )}
    </section>
  );
};

export default MenuTable;
