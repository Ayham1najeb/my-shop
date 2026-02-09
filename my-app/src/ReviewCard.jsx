// ReviewCard.jsx
import React from "react";

const ReviewCard = ({ name, image, comment, rating }) => {
  return (
    <div className="review-card">
      <img src={image} alt={name} className="review-img" />
      <h4>{name}</h4>
      <p className="comment">{comment}</p>
      <p className="rating">{"⭐".repeat(rating)}</p>
    </div>
  );
};

export default ReviewCard;
