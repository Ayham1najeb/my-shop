import React, { useState, useEffect } from 'react';
import API_URL from '../../apiConfig';
import './ManageReviews.css';

const ManageReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_URL}/api/admin/reviews`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            if (data.status === 200) {
                setReviews(data.reviews);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching reviews", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const updateStatus = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this review?`)) return;

        try {
            const token = localStorage.getItem('auth_token');
            await fetch(`${API_URL}/api/admin/reviews/${id}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            // Refresh list
            fetchReviews();
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    const deleteReview = async (id) => {
        if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا التقييم؟ لا يمكن التراجع عن هذا الإجراء.")) return;

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_URL}/api/admin/reviews/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Remove from local state immediately for faster UI feedback
                setReviews(reviews.filter(r => r.id !== id));
            } else {
                alert("فشل الحذف");
            }
        } catch (error) {
            console.error("Error deleting review", error);
        }
    };

    if (loading) return <div className="loading">Loading Reviews...</div>;

    return (
        <div className="manage-reviews-container">
            <h2>إدارة التقييمات</h2>
            <div className="admin-table-wrapper">
                <table className="reviews-table">
                    <thead>
                        <tr>
                            <th>المستخدم</th>
                            <th>المنتج</th>
                            <th>التقييم</th>
                            <th>التعليق</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((rev) => (
                            <tr key={rev.id}>
                                <td>{rev.user?.name || 'Unknown'}</td>
                                <td>{rev.product?.title_en || 'Unknown Product'}</td>
                                <td>
                                    <span className="rating-badge">⭐ {rev.rating}</span>
                                </td>
                                <td className="comment-cell">{rev.comment}</td>
                                <td>
                                    <span className={`status-badge ${rev.status}`}>
                                        {rev.status === 'pending' ? 'قيد الانتظار' : rev.status === 'approved' ? 'مقبول' : 'مرفوض'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {rev.status !== 'approved' && (
                                            <button className="btn-approve" onClick={() => updateStatus(rev.id, 'approved')}>قبول</button>
                                        )}
                                        {rev.status !== 'rejected' && (
                                            <button className="btn-reject" onClick={() => updateStatus(rev.id, 'rejected')}>رفض</button>
                                        )}
                                        <button
                                            className="btn-delete"
                                            onClick={() => deleteReview(rev.id)}
                                            style={{
                                                backgroundColor: '#ef4444',
                                                color: 'white',
                                                padding: '5px 10px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                marginLeft: '5px'
                                            }}
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageReviews;
