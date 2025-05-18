import React from "react";

const History = () => {
  // In the future this data will come from the API
  const shifts = [
    { date: "2025-03-22", period: "Evening" },
    { date: "2025-03-29", period: "Morning" },
  ];

  return (
    <section className="section">
      <h2>Shift History</h2>
      {shifts.length === 0 ? (
        <p>No history data available.</p>
      ) : (
        <ul>
          {shifts.map((shift, index) => (
            <li key={index}>
              {shift.date} - {shift.period}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default History;
