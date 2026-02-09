import React from 'react';
import './SkeletonProductCard.css';

const SkeletonProductCard = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton-image shine"></div>
            <div className="skeleton-content">
                <div className="skeleton-title shine"></div>
                <div className="skeleton-price shine"></div>
                <div className="skeleton-button shine"></div>
            </div>
        </div>
    );
};

export default SkeletonProductCard;
