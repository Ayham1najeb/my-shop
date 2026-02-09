import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "./ProductContext";
import { FaTrash, FaShoppingCart, FaTimes } from "react-icons/fa";
import { useLanguage } from './LanguageContext';
import Footer from "./Footer";
import "./Cart.css";

const Cart = () => {
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useContext(ProductContext);
  const { t, language } = useLanguage();

  const totalPrice = cart.reduce((acc, item) => {
    const price = Number(item.price);
    const discount = Number(item.discount || 0);
    const finalPrice = discount ? price - discount : price;
    return acc + finalPrice * Number(item.quantity);
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="empty-cart-container empty-cart-v2">
          <FaShoppingCart size={80} color="#ddd" />
          <h2>{t('cart_empty')}</h2>
          <p>{t('cart_empty_desc') || (language === 'ar' ? 'لم تقم بإضافة أي منتجات للسلة بعد.' : 'You have not added any items to the cart yet.')}</p>
          <Link to="/products" className="start-shopping-btn">{t('continue_shopping')}</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="cart-breadcrumb">
        <Link to="/" className="breadcrumb-link">{t('home')}</Link>
        <span className="breadcrumb-separator"> {language === 'ar' ? '<' : '>'} </span>
        <span className="breadcrumb-current">{t('cart_title') || (language === 'ar' ? 'السلة' : 'Cart')}</span>
      </div>

      <div className="cart-container">

        {/* Items List */}
        <div className="cart-items">
          <div className="cart-header">
            <div className="header-content">
              <div className="header-title-row">
                <h2>{t('cart_title') || (language === 'ar' ? 'السلة' : 'Cart')}</h2>
                <div className="header-icon-box"><FaShoppingCart /></div>
              </div>
              <div className="header-subtitle">
                {cart.length} {t('items')} - <span className="price-text">$ {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {cart.map((item) => {
            const finalPrice = Number(item.discount ? item.price - item.discount : item.price);
            const lineTotal = finalPrice * item.quantity;

            return (
              <div key={item.id} className="cart-item-card">

                {/* Right/Main Section (Image, Details) */}
                <div className="card-right">
                  <button className="delete-icon" onClick={() => removeFromCart(item)}>
                    <FaTimes size={16} />
                  </button>

                  <img src={item.image} alt={item.title} className="item-image" />

                  <div className="item-details">
                    <h4>{item.title}</h4>
                    <div className="item-unit-price">
                      {t('price')}: <span className="price-val">$ {finalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Left Section (Qty, Total) */}
                <div className="card-left">
                  <div className="item-line-total">$ {lineTotal.toFixed(2)}</div>
                  <div className="qty-group">
                    <button className="qty-btn" onClick={() => addToCart(item, false)}>+</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => decreaseQuantity(item)}>-</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h3 className="summary-header">{t('order_summary')}</h3>

          <div className="summary-row">
            <span>{t('items')}</span>
            <span>{cart.length}</span>
          </div>

          <div className="summary-row">
            <span>{t('subtotal')}</span>
            <span>$ {totalPrice.toFixed(2)}</span>
          </div>

          <div className="total-row">
            <span>{t('total')}</span>
            <span>$ {totalPrice.toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="checkout-page-btn">{t('proceed_checkout')}</Link>

          <Link to="/products" className="continue-shopping">
            {t('continue_shopping')}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Cart;
