import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductContext } from "./ProductContext";
import { FaEye, FaShoppingBag, FaHeart, FaRegHeart, FaPlus } from "react-icons/fa"; // Import Icons
import SkeletonProductCard from "./components/SkeletonProductCard";
import "./ProductListv2.css";
import "./ProductListMobile.css";

const HomeProductList = () => {
  const navigate = useNavigate();
  const { products, setSelectedProduct, addToCart, toggleWishlist, isInWishlist } = useContext(ProductContext);

  const discountedIds = [3, 8, 11, 6, 9];
  const discountRate = 0.7;

  // عرض عدد محدود من المنتجات المميزة في الصفحة الرئيسية
  const visibleCount = 10;
  const previewProducts = products.slice(0, visibleCount);

  // إزالة التكرار: ننتقل لصفحة مستقلة لعرض كل شيء
  const handleAddToCart = (product) => {
    const priceValue = discountedIds.includes(product.id)
      ? product.price * discountRate
      : product.price;
    addToCart({ ...product, price: priceValue, quantity: 1 });
  };

  // Animation logic for showing products as they come into view
  useEffect(() => {
    const cards = document.querySelectorAll(".product-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Small micro-delay for staggered entry
            setTimeout(() => {
              entry.target.classList.add("show");
            }, index * 50);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [previewProducts]);

  return (
    <div className="product-list-container">
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-icon">🛒</span> المنتجات المميزة
        </h2>
        <div className="section-underline"></div>
      </div>

      <div className="products-grid">
        {!products || products.length === 0 ? (
          // Show Skeletons while loading
          Array.from({ length: 8 }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))
        ) : (
          previewProducts.map((product, index) => {
            const isDiscounted = discountedIds.includes(product.id);
            const priceNum = Number(product.price);
            const finalPrice = isDiscounted
              ? (priceNum * discountRate).toFixed(2)
              : priceNum.toFixed(2);

            // Debugging
            if (index === 0) console.log("Product Data:", product);

            return (
              <div
                key={product.id}
                className="product-card" // Removed 'show' class, will be added by IntersectionObserver
                data-aos="fade-up" // Added AOS attribute
                data-aos-delay={index * 50} // Added AOS attribute
              >
                <div className="product-image-wrapper">
                  <Link
                    to={`/products/${product.id}`}
                    onClick={() => setSelectedProduct(product)}
                    style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <img src={product.image} alt={product.title} className="product-image" />

                    <button
                      className={`card-favorite-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                    >
                      {isInWishlist(product.id) ? <FaHeart style={{ color: '#ef4444' }} /> : <FaRegHeart />}
                    </button>

                    <div className="product-overlay">
                      <div className="overlay-box">
                        <FaEye className="overlay-icon" />
                        <span className="overlay-text-small">تفاصيل المنتج</span>
                      </div>
                    </div>
                  </Link>

                  {isDiscounted && <div className="badge badge-sale">Sale</div>}
                </div>

                <div className="product-info">
                  <Link
                    to={`/products/${product.id}`}
                    onClick={() => setSelectedProduct(product)}
                    style={{ textDecoration: "none" }}
                  >
                    <h3 className="product-title">{product.title}</h3>
                  </Link>

                  {/* Color Swatches */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="product-color-swatches" style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                      {product.colors.slice(0, 4).map(color => (
                        <div
                          key={color.id}
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: color.hex,
                            border: color.hex === '#ffffff' ? '1px solid #ddd' : '1px solid transparent',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                          }}
                          title={color.name}
                        />
                      ))}
                      {product.colors.length > 4 && <span style={{ fontSize: '10px', color: '#888' }}>+{product.colors.length - 4}</span>}
                    </div>
                  )}

                  <div className="price-row">
                    {isDiscounted ? (
                      <>
                        <span className="price-original">${product.price}</span>
                        <span className="price-final">${finalPrice}</span>
                      </>
                    ) : (
                      <span className="price-final">${product.price}</span>
                    )}
                  </div>

                  <div className="product-actions">
                    <button onClick={() => handleAddToCart(product)} className="btn-add-cart">
                      <span>إضافة إلى السلة</span>
                      <FaShoppingBag className="cart-icon" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="load-more-container">
        <Link to="/products" className="btn-load-more">
          <span>عرض كافة المنتجات والأقسام</span>
          <FaPlus className="plus-icon" />
        </Link>
      </div>
    </div>
  );
};

export default HomeProductList;
