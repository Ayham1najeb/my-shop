import React from "react";
import { reviews } from "./reviewsData";

const AllReviews = () => {
  const sectionStyle = {
    padding: "70px 20px",
    textAlign: "center",
    background: "#f9f9f9",
  };

  const titleStyle = {
    fontSize: "2.2rem",
    marginBottom: "30px",
    fontWeight: 700,
    color: "#333",
  };

  const underlineStyle = {
    width: "70px",
    height: "3px",
    background: "#001b6b",
    margin: "12px auto 0",
    borderRadius: "2px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    justifyItems: "center",
    padding: "0 10px",
  };

  const cardStyle = {
    width: "100%",
  };

  const cardInnerStyle = {
    background: "#fff",
    borderRadius: "16px",
    padding: "25px 20px",
    border: "1px solid rgba(0,0,0,0.1)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "all 0.3s ease",
  };

  const imgStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "15px",
    border: "3px solid #001b6b",
    transition: "transform 0.3s ease, border 0.3s ease",
  };

  const nameStyle = {
    marginBottom: "10px",
    fontSize: "1.2rem",
    color: "#001b6b",
    fontWeight: 600,
  };

  const commentStyle = {
    fontSize: "0.95rem",
    color: "#555",
    marginBottom: "12px",
    lineHeight: 1.5,
    fontStyle: "italic",
  };

  const ratingStyle = {
    color: "#f1c40f",
    fontSize: "1.1rem",
    letterSpacing: "1.5px",
  };

  return (
    <section style={sectionStyle}>
      <h2 style={titleStyle}>All Customer Reviews</h2>
      <div style={underlineStyle}></div>
      <div style={gridStyle}>
        {reviews.map((r) => (
          <div key={r.id} style={cardStyle}>
            <div style={cardInnerStyle} 
                 onMouseEnter={e => {
                   e.currentTarget.style.transform = "translateY(-10px) scale(1.04)";
                   e.currentTarget.querySelector("img").style.transform = "scale(1.1) rotate(-4deg)";
                   e.currentTarget.querySelector("img").style.borderColor = "#00c6ff";
                 }}
                 onMouseLeave={e => {
                   e.currentTarget.style.transform = "none";
                   e.currentTarget.querySelector("img").style.transform = "none";
                   e.currentTarget.querySelector("img").style.borderColor = "#001b6b";
                 }}>
              <img src={r.image} alt={r.name} style={imgStyle} />
              <h4 style={nameStyle}>{r.name}</h4>
              <p style={commentStyle}>{r.comment}</p>
              <p style={ratingStyle}>{"⭐".repeat(r.rating)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllReviews;
