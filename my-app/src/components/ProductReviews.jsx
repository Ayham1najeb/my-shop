import React, { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaCheckCircle, FaThumbsUp } from 'react-icons/fa';
import './ProductReviews.css';
import { useLanguage } from '../LanguageContext';
import API_URL from '../apiConfig';

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ average: 0, total: 0, breakdown: [0, 0, 0, 0, 0] });
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);
    // const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const { language } = useLanguage();

    const fetchReviews = React.useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/api/products/${productId}/reviews`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setReviews(data);

                // Calculate stats locally
                if (data.length > 0) {
                    const total = data.length;
                    const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
                    const average = (sum / total).toFixed(1);

                    const breakdown = [0, 0, 0, 0, 0];
                    data.forEach(r => {
                        if (r.rating >= 1 && r.rating <= 5) {
                            breakdown[5 - r.rating]++;
                        }
                    });
                    setStats({ average, total, breakdown });
                }
            } else {
                console.error("API returned non-array:", data);
                setReviews([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error loading reviews", error);
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        if (productId) {
            setReviews([]);
            setLoading(true);
            fetchReviews();
        }
    }, [productId, fetchReviews]);

    const submitReview = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('auth_token');
        if (!token) {
            alert(language === 'ar' ? 'يرجى تسجيل الدخول أولاً' : 'Please login first');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json' // Critical: Forces JSON response
                },
                body: JSON.stringify({ product_id: productId, rating, comment })
            });

            if (response.status === 401) {
                alert(language === 'ar' ? 'انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى' : 'Session expired, please login again');
                // Optional: Redirect to login or clear token
                localStorage.removeItem('auth_token');
                window.location.href = '/login';
                return;
            }

            if (response.ok) {
                const responseData = await response.json();

                // OPTIMISTIC UPDATE: Add new review to list immediately
                if (responseData.data) {
                    setReviews(prevReviews => [responseData.data, ...prevReviews]);
                    // Update stats locally (simplified)
                    setStats(prev => ({
                        ...prev,
                        total: prev.total + 1
                    }));
                } else {
                    fetchReviews(); // Fallback if no data returned
                }

                setSubmitted(true);
                setComment('');
                setRating(0);
                setTimeout(() => setSubmitted(false), 8000);
            } else {
                // Safe Error Handling
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errData = await response.json();
                    alert(language === 'ar' ? 'حدث خطأ: ' + (errData.message || 'فشل الإرسال') : 'Error: ' + (errData.message || 'Submission failed'));
                } else {
                    const errText = await response.text();
                    console.error("Non-JSON Error Response:", errText);
                    alert(language === 'ar' ? 'حدث خطأ في السيرفر (تحقق من الكونسول)' : 'Server Error (Check Console)');
                }
            }
        } catch (error) {
            console.error("Error submitting review", error);
            alert(language === 'ar' ? `حدث خطأ في الاتصال: ${error.message}` : `Connection Error: ${error.message}`);
        }
    };

    const renderStars = (score) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= score) stars.push(<FaStar key={i} className="star-icon filled" />);
            else if (i === Math.ceil(score) && !Number.isInteger(score)) stars.push(<FaStarHalfAlt key={i} className="star-icon half" />);
            else stars.push(<FaRegStar key={i} className="star-icon" />);
        }
        return stars;
    };

    return (
        <div className="reviews-wrapper" dir={language === 'ar' ? 'rtl' : 'ltr'}>

            {/* 1. Header & Stats Dashboard */}
            <div className="reviews-dashboard">
                <div className="overall-rating">
                    <span className="big-score">{stats.average || '0.0'}</span>
                    <div className="stars-summary">{renderStars(stats.average)}</div>
                    <span className="total-count">{stats.total} {language === 'ar' ? 'تقييم' : 'Reviews'}</span>
                </div>

                <div className="rating-bars">
                    {[5, 4, 3, 2, 1].map((star, index) => {
                        const count = stats.breakdown[index];
                        const percentage = stats.total ? (count / stats.total) * 100 : 0;
                        return (
                            <div key={star} className="rating-bar-row">
                                <span className="star-label">{star} <FaStar className="tiny-star" /></span>
                                <div className="progress-track">
                                    <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="count-label">{count}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Call to Action Box */}
                <div className="add-review-cta">
                    {!localStorage.getItem('auth_token') ? (
                        <div className="cta-login">
                            <p>{language === 'ar' ? 'شاركنا رأيك في المنتج' : 'Share your thoughts'}</p>
                            <a href="/login" className="btn-outline">{language === 'ar' ? 'سجل دخول للتقييم' : 'Login to Rate'}</a>
                        </div>
                    ) : (
                        <div className="cta-write">
                            <p>{language === 'ar' ? 'قيم هذا المنتج' : 'Rate this product'}</p>
                            <div className="star-input-group">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={`clickable-star ${i + 1 <= (hover || rating) ? 'active' : ''}`}
                                        onClick={() => setRating(i + 1)}
                                        onMouseEnter={() => setHover(i + 1)}
                                        onMouseLeave={() => setHover(0)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Success Message Banner */}
            {submitted && (
                <div className="review-success-message animate-fade-in">
                    <FaCheckCircle className="success-icon" />
                    <div className="success-content">
                        <h4>{language === 'ar' ? 'تم نشر تقييمك بنجاح!' : 'Review Published Successfully!'}</h4>
                        <p>{language === 'ar' ? 'شكراً لك. ظهر تقييمك الآن لجميع المستخدمين.' : 'Thank you. Your review is now visible to everyone.'}</p>
                    </div>
                </div>
            )}

            {/* 2. Write Review Area (Expandable/Visible if rating selected) */}
            {rating > 0 && localStorage.getItem('auth_token') && !submitted && (
                <div className="write-review-area animate-fade-in">
                    <textarea
                        className="review-input"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={language === 'ar' ? 'اكتب تفاصيل تجربتك...' : 'Tell us more about your experience...'}
                    />
                    <button onClick={submitReview} className="btn-submit-review">
                        {language === 'ar' ? 'نشر التقييم' : 'Post Review'}
                    </button>
                </div>
            )}

            {/* 3. Reviews List */}
            <div className="reviews-feed">
                <h3 className="section-title">{language === 'ar' ? 'تقييمات الأعضاء' : 'Member Reviews'}</h3>
                {reviews.length === 0 ? (
                    <div className="empty-state">
                        <FaRegStar size={40} color="#e5e7eb" />
                        <p>{language === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet'}</p>
                    </div>
                ) : (
                    reviews.map((rev) => (
                        <div key={rev.id} className="review-item">
                            <div className="review-user-col">
                                <div className="user-avatar">
                                    {rev.user?.profile_image_url ? (
                                        <img
                                            src={rev.user.profile_image_url}
                                            alt={rev.user.name}
                                            className="avatar-img"
                                            onError={(e) => {
                                                e.target.style.display = 'none'; // Hide broken image
                                                e.target.parentNode.innerText = rev.user.name.charAt(0).toUpperCase(); // Show initial
                                            }}
                                        />
                                    ) : (
                                        rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : '?'
                                    )}
                                </div>
                                <span className="user-name">{rev.user?.name || (language === 'ar' ? 'مستخدم' : 'User')}</span>
                                <span className="verified-badge"><FaCheckCircle /> {language === 'ar' ? 'مشتري' : 'Verified'}</span>
                            </div>
                            <div className="review-content-col">
                                <div className="stars-row">{renderStars(rev.rating)}</div>
                                <p className="review-text">{rev.comment}</p>
                                <div className="review-meta">
                                    <span className="date">{new Date(rev.created_at).toLocaleDateString()}</span>
                                    <button className="helpful-btn"><FaThumbsUp /> {language === 'ar' ? 'مفيد' : 'Helpful'}</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
