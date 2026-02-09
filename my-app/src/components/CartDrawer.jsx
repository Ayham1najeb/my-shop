import React, { useContext, useEffect } from 'react';
import { ProductContext } from '../ProductContext';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import './CartDrawer.css';

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cart, removeFromCart, addToCart, decreaseQuantity } = useContext(ProductContext);
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const totalPrice = cart.reduce((acc, item) => {
        const price = Number(item.price);
        const discount = Number(item.discount || 0);
        const finalPrice = discount ? price - discount : price;
        return acc + finalPrice * Number(item.quantity);
    }, 0);

    // Prevent background scrolling when drawer is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '15px'; // Avoid layout shift
        } else {
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0';
        }
    }, [isCartOpen]);

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/cart');
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`drawer-overlay ${isCartOpen ? 'open' : ''}`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="drawer-header">
                    <div className="header-top">
                        <button className="close-btn" onClick={() => setIsCartOpen(false)}>
                            <FaTimes />
                        </button>
                        <h3>{t('cart_title') || (language === 'ar' ? 'السلة' : 'Cart')} <span className="item-count">({cart.length} {t('items')})</span></h3>
                    </div>
                    <div className="header-bottom">
                        <span>{t('total')}: </span>
                        <span className="header-total">${totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                <div className="drawer-body">
                    {cart.length === 0 ? (
                        <div className="empty-cart-msg">
                            <p>{t('cart_empty')}</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="drawer-card">
                                <div className="card-image-container">
                                    <img src={item.image} alt={item.title} className="card-img" />
                                </div>

                                <div className="card-details">
                                    <h4>{item.title}</h4>
                                    <div className="card-price">
                                        ${(() => {
                                            const price = Number(item.price);
                                            const discount = Number(item.discount || 0);
                                            const finalPrice = discount ? price - discount : price;
                                            return finalPrice.toFixed(2);
                                        })()}
                                    </div>

                                    <div className="card-actions">
                                        <div className="quantity-controls">
                                            <button onClick={() => addToCart(item)}>+</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => decreaseQuantity(item)}>-</button>
                                        </div>
                                        <button
                                            className="delete-btn"
                                            onClick={() => removeFromCart(item)}
                                        >
                                            <FaTrash style={{ marginRight: '5px' }} /> {t('remove')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="drawer-footer">
                    <div className="footer-total">
                        <span>{t('total')}:</span>
                        <h3>${totalPrice.toFixed(2)}</h3>
                    </div>
                    <button className="checkout-btn" onClick={handleCheckout} disabled={cart.length === 0}>
                        {t('proceed_checkout')}
                    </button>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
