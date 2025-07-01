export const formatDateIL = (isoString) => {
  if (!isoString || isoString === "a") return "Unknown";
  const date = new Date(isoString);
  return date.toLocaleString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
    timeZone: "Asia/Jerusalem",
  });
};

export const getCourierName = (courierId, couriers = []) => {
  const c = couriers.find((c) => c.PK === courierId);
  return c?.name || courierId || "Unknown Courier";
};

export const deliveryStatusColor = (status) => {
  return {
    ready: "#e6f4ea",
    "in-preparation": "#fff4e5",
    pending: "#fdecea",
    sent: "#e0e0e0",
  }[status] || "#f0f0f0";
};

export const formatAddress = (address) => {
  try {
    if (!address) return "No address provided";
    if (typeof address === "string") {
      if (address.startsWith("{")) {
        const parsed = JSON.parse(address);
        return parsed.address || "Unknown";
      }
      return address;
    }
    if (typeof address === "object") {
      return address.address || `${address.street || ""}, ${address.city || ""}`;
    }
    return "Invalid address format";
  } catch (e) {
    return "Malformed address";
  }
};

export const getCountdown = (departureTime, now = new Date()) => {
  if (!departureTime) return null;
  const time = new Date(departureTime);
  const diff = time - now;
  const absDiff = Math.abs(diff);
  const hours = Math.floor(absDiff / 1000 / 60 / 60).toString().padStart(2, "0");
  const minutes = Math.floor((absDiff / 1000 / 60) % 60).toString().padStart(2, "0");
  const seconds = Math.floor((absDiff / 1000) % 60).toString().padStart(2, "0");
  const timeStr = `${hours}:${minutes}:${seconds}`;
  return diff < 0 ? { text: `Delayed by: ${timeStr}`, delayed: true } : { text: timeStr, delayed: false };
};

export const sortOrders = (orders, now = new Date()) => {
  const statusOrder = { ready: 0, "in-preparation": 1, pending: 2, sent: 3 };

  return [...orders].sort((a, b) => {
    const statusDiff = statusOrder[a.orderStatus] - statusOrder[b.orderStatus];
    if (statusDiff !== 0) return statusDiff;
    const aTime = new Date(a.courierDepartureTime || 0);
    const bTime = new Date(b.courierDepartureTime || 0);
    const aIsLate = aTime < now;
    const bIsLate = bTime < now;
    if (aIsLate && !bIsLate) return -1;
    if (!aIsLate && bIsLate) return 1;
    if (aIsLate && bIsLate) return aTime - bTime;
    return aTime - bTime;
  });
};
