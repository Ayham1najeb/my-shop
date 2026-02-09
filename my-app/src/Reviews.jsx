import React from "react";
import { reviews } from "./reviewsData";
import ReviewCard from "./ReviewCard";
import { Link } from "react-router-dom";
import './Reviews.css';

const Reviews = () => {
  const previewReviews = reviews.slice(0, 4); // أول 4 مراجعات فقط
  const hasMore = reviews.length > 4; // هل يوجد أكثر من 4؟

  return (
    <section className="reviews">
      <h2 className="title">What Our Customers Say</h2>
      
      <div className="reviews-grid">
        {previewReviews.map((r) => (
          <ReviewCard
            key={r.id}
            name={r.name}
            image={r.image}
            comment={r.comment}
            rating={r.rating}
          />
        ))}

        {hasMore && (
          <Link to="/all-reviews" className="review-card see-more-card">
            <div className="see-more-inner">
              <span>عرض المزيد</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
};

export default Reviews;
