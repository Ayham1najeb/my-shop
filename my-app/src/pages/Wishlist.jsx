import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../ProductContext';
import { useLanguage } from '../LanguageContext';
import { FaHeart, FaTrash, FaShoppingCart, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist, removeFromWishlist, addToCart } = useContext(ProductContext);
    const { language } = useLanguage();

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    return (
        <div className="wishlist-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="wishlist-container">
                <div className="wishlist-header">
                    <div className="header-left">
                        <Link to="/profile" className="back-btn">
                            {language === 'ar' ? <FaArrowRight /> : <FaArrowLeft />}
                        </Link>
                        <h1>
                            <FaHeart className="heart-icon" />
                            {language === 'ar' ? 'قائمة المفضلة' : 'Wishlist'}
                        </h1>
                    </div>
                    <span className="wishlist-count-badge">{wishlist.length} {language === 'ar' ? 'عنصر' : 'Items'}</span>
                </div>

                {wishlist.length === 0 ? (
                    <div className="empty-wishlist">
                        <FaHeart className="empty-icon" />
                        <h2>{language === 'ar' ? 'قائمتك فارغة' : 'Your wishlist is empty'}</h2>
                        <p>{language === 'ar' ? 'أضف منتجاتك المفضلة هنا' : 'Add your favorite products here'}</p>
                        <Link to="/products" className="shop-btn">
                            {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                        </Link>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {wishlist.map((product) => (
                            <div key={product.id} className="wishlist-card">
                                <Link to={`/products/${product.id}`} className="wishlist-card-media">
                                    <div className="media-overlay"></div>
                                    <img src={product.image} alt={product.title} />
                                    <button
                                        className="remove-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeFromWishlist(product.id);
                                        }}
                                        title={language === 'ar' ? 'إزالة' : 'Remove'}
                                    >
                                        <FaTrash />
                                    </button>
                                </Link>

                                <div className="wishlist-card-content">
                                    <Link to={`/products/${product.id}`} className="card-title-link">
                                        <h3>{product.title}</h3>
                                    </Link>

                                    <div className="card-bottom-row">
                                        <div className="price-tag">
                                            <span className="currency">$</span>
                                            {product.price}
                                        </div>
                                        <button
                                            className="add-to-cart-btn"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            <FaShoppingCart />
                                            {language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
