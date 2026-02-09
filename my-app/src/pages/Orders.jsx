import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../ProductContext';
import { useLanguage } from '../LanguageContext';
import { FaBox, FaCheck, FaTruck, FaArrowRight, FaArrowLeft, FaBoxOpen } from 'react-icons/fa';
import './Orders.css';

const Orders = () => {
    const { orders } = useContext(ProductContext);
    const { language } = useLanguage();

    const getStatusInfo = (status) => {
        const statuses = {
            pending: {
                icon: <FaBox />,
                label: language === 'ar' ? 'قيد المعالجة' : 'Processing',
                color: '#f59e0b'
            },
            shipped: {
                icon: <FaTruck />,
                label: language === 'ar' ? 'تم الشحن' : 'Shipped',
                color: '#3b82f6'
            },
            delivered: {
                icon: <FaCheck />,
                label: language === 'ar' ? 'تم التوصيل' : 'Delivered',
                color: '#22c55e'
            }
        };
        return statuses[status] || statuses.pending;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="orders-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="orders-container">
                <div className="orders-header">
                    <Link to="/profile" className="back-btn">
                        {language === 'ar' ? <FaArrowRight /> : <FaArrowLeft />}
                    </Link>
                    <h1>{language === 'ar' ? 'سجل الطلبات' : 'Order History'}</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-orders-v2">
                        <FaBoxOpen size={80} className="empty-icon" />
                        <h2>{language === 'ar' ? 'لا توجد طلبات بعد' : 'No Orders Yet'}</h2>
                        <p>{language === 'ar' ? 'ابدأ رحلة التسوق الخاصة بك الآن واكتشف أفضل العروض الحصرية.' : 'Start your shopping journey now and discover the best exclusive offers.'}</p>
                        <Link to="/products" className="start-shopping-btn">
                            {language === 'ar' ? 'ابدأ التسوق' : 'Start Shopping'}
                        </Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.slice().reverse().map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            return (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <div className="order-info">
                                            <span className="order-id">#{order.id}</span>
                                            <span className="order-date">{formatDate(order.date)}</span>
                                        </div>
                                        <div className="order-status" style={{ background: `${statusInfo.color}20`, color: statusInfo.color }}>
                                            {statusInfo.icon}
                                            <span>{statusInfo.label}</span>
                                        </div>
                                    </div>

                                    <div className="order-items">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="order-item">
                                                <img src={item.image} alt={item.title} />
                                                <div className="item-info">
                                                    <h4>{item.title.substring(0, 30)}...</h4>
                                                    <span className="item-qty">x{item.quantity}</span>
                                                </div>
                                                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <p className="more-items">
                                                +{order.items.length - 3} {language === 'ar' ? 'منتجات أخرى' : 'more items'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="order-footer">
                                        <div className="order-total">
                                            <span>{language === 'ar' ? 'المجموع:' : 'Total:'}</span>
                                            <span className="total-amount">${order.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
