// שמירה לזיכרון המקומי
export const saveToLocalStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (err) {
    console.error("Error saving to localStorage", err);
  }
};

// שליפה מהזיכרון המקומי
export const loadFromLocalStorage = (key) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) return null;
    return JSON.parse(serializedValue);
  } catch (err) {
    console.error("Error reading from localStorage", err);
    return null;
  }
};
