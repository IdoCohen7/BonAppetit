// שמירה לזיכרון המקומי
export const saveToSessionStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (err) {
    console.error("Error saving to sessionStorage", err);
  }
};

// שליפה מהזיכרון המקומי
export const loadFromSessionStorage = (key) => {
  try {
    const serializedValue = sessionStorage.getItem(key);
    if (serializedValue === null) return null;
    return JSON.parse(serializedValue);
  } catch (err) {
    console.error("Error reading from sessionStorage", err);
    return null;
  }
};
