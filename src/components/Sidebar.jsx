import React, { useEffect } from "react";

const Sidebar = ({ categories }) => {
  useEffect(() => {
    const updateActiveStation = () => {
      const sections = document.querySelectorAll(".menu-category");
      let current = "";
      sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - 150) {
          current = sec.id;
        }
      });

      document.querySelectorAll(".station").forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", updateActiveStation);
    updateActiveStation();
    return () => window.removeEventListener("scroll", updateActiveStation);
  }, []);

  return (
    <div className="subway-line" id="category-nav">
      <div className="line-track"></div>
      {categories.map((cat) => (
        <a
          key={cat}
          className="station"
          href={`#${cat.toLowerCase()}`}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById(cat.toLowerCase())
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="circle"></span>
          <span className="label">{cat}</span>
        </a>
      ))}
    </div>
  );
};

export default Sidebar;
