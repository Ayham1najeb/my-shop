import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductContext } from "../ProductContext";
import "../MobileFixes.css"; // Ensure mobile fixes are applied
import { FaShoppingCart, FaEye, FaStar, FaGem } from "react-icons/fa";
import { useLanguage } from "../LanguageContext";

// Map URL param to internal category IDs if needed, or just use as is
const categoryMap = {
  men: 'men',
  women: 'women',
  kids: 'kids',
  jewelery: 'jewelery',
  electronics: 'electronics',
};

const ProductsByCategory = () => {
  const { categoryName } = useParams();
  const { products, setSelectedProduct, addToCart } = useContext(ProductContext);
  const { t, language } = useLanguage();
  const discountedIds = [3, 8, 11, 6, 9];
  const discountRate = 0.7;

  const getCategory = React.useCallback((name) => {
    if (!name) return 'all';
    return categoryMap[name.toLowerCase()] || name.toLowerCase();
  }, []);

  const activeCategory = getCategory(categoryName);

  // Data Augmentation (Mocking Brands, Colors, Ratings for Demo)
  const augmentedProducts = useMemo(() => {
    const brandsList = ['nike', 'adidas', 'puma', 'zara', 'h_m', 'apple', 'samsung', 'lc_waikiki'];

    return products.map((product, index) => {
      const brandIndex = product.id % brandsList.length;
      const rating = (product.id % 5) + 1;

      let catId = 'others';
      const titleLower = product.title.toLowerCase();
      const catLower = product.category ? product.category.toLowerCase() : '';

      if (catLower.includes('clothing') || titleLower.includes('shirt')) {
        catId = (titleLower.includes('women') || catLower.includes('women')) ? 'women' : 'men';
      } else if (catLower.includes('jewelery') || titleLower.includes('gold') || titleLower.includes('ring')) {
        catId = 'jewelery';
      } else if (catLower.includes('electronic') || titleLower.includes('ssd') || titleLower.includes('monitor')) {
        catId = 'electronics';
      }

      return {
        ...product,
        brand: brandsList[brandIndex],
        rating: rating > 5 ? 5 : rating,
        categoryId: catId
      };
    });
  }, [products]);


  // Simple Category-only Filtering
  const filteredProducts = useMemo(() => {
    return augmentedProducts.filter(product => product.categoryId === activeCategory);
  }, [augmentedProducts, activeCategory]);

  const handleAddToCart = (product) => {
    const finalPrice = discountedIds.includes(product.id)
      ? (Number(product.price) * discountRate).toFixed(2)
      : Number(product.price).toFixed(2);
    addToCart({ ...product, price: finalPrice, quantity: 1 });
  };

  useEffect(() => {
    // Animation for new items
    const cards = document.querySelectorAll(".product-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
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
  }, [filteredProducts]);

  // Color Map for Visual Tags
  const colorMap = {
    black: '#000000', white: '#ffffff', red: '#ef4444', blue: '#3b82f6',
    green: '#22c55e', yellow: '#eab308', purple: '#a855f7', gray: '#6b7280'
  };

  return (
    <div style={{ padding: "40px 20px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>

      {/* Premium Header (Customized for Category) */}
      <div className="premium-header-container">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <FaGem className="header-icon" />
          </div>
          <div>
            <h2 className="premium-title">{(categoryName || 'Category').toUpperCase()} COLLECTION</h2>
            <p className="premium-subtitle">أفضل التشكيلات المختارة خصيصاً لك</p>
          </div>
        </div>
      </div>

      <div className="products-layout" style={{
        maxWidth: "1600px",
        margin: "0 auto",
      }}>

        {/* Product Grid - Full Width */}
        <div style={{ width: "100%", minWidth: 0 }}>

          {/* Simple Results Count */}
          <div style={{ marginBottom: '20px', textAlign: language === 'ar' ? 'right' : 'left' }}>
            <span style={{ color: "#64748b", fontWeight: "600", fontSize: '0.9rem' }}>
              {t('results_found') || 'نتائج البحث'}: <span style={{ color: "#3BA3D9" }}>{filteredProducts.length}</span> {t('items') || 'قطعة'}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px",
              background: "white",
              borderRadius: "20px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}>
              <h3 style={{ color: "#94a3b8", fontSize: '1.5rem', marginBottom: '10px' }}>
                {language === 'ar' ? 'عذراً، لا توجد منتجات في هذا القسم حالياً! 😔' : 'Sorry, no products in this category yet! 😔'}
              </h3>
              <p style={{ color: "#cbd5e1", marginBottom: '20px' }}>
                {language === 'ar' ? 'تصفح بقية الأقسام للحصول على أفضل العروض.' : 'Check other categories for the best offers.'}
              </p>
              <Link
                to="/products"
                style={{
                  display: 'inline-block',
                  padding: "12px 25px",
                  background: "#3BA3D9",
                  color: "white",
                  textDecoration: 'none',
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1rem"
                }}
              >
                {language === 'ar' ? 'مشاهدة كافة المنتجات' : 'View All Products'}
              </Link>
            </div>
          ) : (
            <div
              className="cat-products-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "25px",
                padding: window.innerWidth <= 767 ? "0 8px" : "0",
              }}
            >
              {filteredProducts.map((product) => {
                const isDiscounted = discountedIds.includes(product.id);
                const priceNum = Number(product.price);
                const finalPrice = isDiscounted
                  ? (priceNum * discountRate).toFixed(2)
                  : priceNum.toFixed(2);

                return (
                  <div
                    key={product.id}
                    className="product-card"
                    style={{
                      backgroundColor: "white",
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      opacity: 0,
                      transform: "translateY(20px)",
                      transition: "all 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      border: "1px solid #f1f5f9"
                    }}
                  >
                    <Link
                      to={`/products/${product.id}`}
                      onClick={() => setSelectedProduct(product)}
                      style={{ textDecoration: "none", color: "inherit", position: "relative" }}
                    >
                      <div
                        className="cat-product-image-container"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          overflow: "hidden"
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="cat-product-img"
                        />

                        {/* Discount Badge */}
                        {isDiscounted && (
                          <div className="badge-discount">
                            SALE
                          </div>
                        )}
                      </div>
                    </Link>

                    <div
                      style={{
                        padding: window.innerWidth <= 767 ? "8px" : "20px",
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderTop: "1px solid #f8fafc"
                      }}
                    >
                      {/* Visual Tags (Brand & Color) */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{
                          fontSize: "0.75rem",
                          color: "#3BA3D9",
                          textTransform: "uppercase",
                          fontWeight: "800",
                          letterSpacing: "0.5px"
                        }}>
                          {product.brand}
                        </span>

                        {/* Color Dot Visual */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {product.colors && product.colors.length > 0 ? (
                            product.colors.slice(0, 3).map(c => (
                              <div
                                key={c.id}
                                title={c.name}
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  backgroundColor: c.hex,
                                  border: c.hex === '#ffffff' ? '1px solid #cbd5e1' : 'none',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}
                              />
                            ))
                          ) : (
                            /* Fallback */
                            product.color && colorMap[product.color] && (
                              <div
                                title={`Color: ${product.color}`}
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  backgroundColor: colorMap[product.color],
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}
                              />
                            )
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <Link
                        to={`/products/${product.id}`}
                        onClick={() => setSelectedProduct(product)}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <h3 style={{
                          fontSize: "1rem",
                          margin: "0 0 10px 0",
                          color: "#1e293b",
                          lineHeight: "1.4",
                          height: "40px",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                          fontWeight: "700"
                        }}>
                          {product.title}
                        </h3>
                      </Link>

                      {/* Rating Stars */}
                      <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} style={{ color: i < (product.rating || 4) ? "#fbbf24" : "#e2e8f0", fontSize: "0.8rem" }} />
                        ))}
                      </div>

                      {/* Price Section */}
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "15px" }}>
                        {isDiscounted ? (
                          <>
                            <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "#3BA3D9" }}>${finalPrice}</span>
                            <span style={{ fontSize: "0.95rem", color: "#94a3b8", textDecoration: "line-through" }}>${product.price}</span>
                          </>
                        ) : (
                          <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "#0f172a" }}>${product.price}</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="action-btn-primary"
                        >
                          <FaShoppingCart /> إضافة
                        </button>

                        <Link
                          to={`/products/${product.id}`}
                          className="action-btn-secondary"
                        >
                          <FaEye />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          /* Premium Header Styles */
          .premium-header-container {
             display: flex;
             justify-content: center;
             margin-bottom: 50px;
          }
          .header-content {
             display: flex;
             align-items: center;
             gap: 20px;
             text-align: right;
          }
          .header-icon-wrapper {
             width: 60px;
             height: 60px;
             background: linear-gradient(135deg, #3BA3D9 0%, #0f172a 100%);
             border-radius: 50%;
             display: flex;
             align-items: center;
             justify-content: center;
             box-shadow: 0 10px 20px rgba(59, 163, 217, 0.3);
          }
          .header-icon {
             font-size: 1.8rem;
             color: white;
          }
          .premium-title {
             font-size: 2.2rem;
             color: #0f172a;
             margin: 0;
             font-family: 'Segoe UI', sans-serif;
             font-weight: 800;
             letter-spacing: -0.5px;
          }
          .premium-subtitle {
             color: #64748b;
             margin: 5px 0 0;
             font-size: 1.1rem;
          }

          /* Card Badges */
          .badge-discount {
             position: absolute;
             top: 15px;
             left: 15px;
             background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
             color: white;
             font-weight: bold;
             padding: 6px 12px;
             border-radius: 8px;
             fontSize: 12px;
             box-shadow: 0 4px 10px rgba(220, 38, 38, 0.4);
             z-index: 2;
          }

          /* Buttons */
          .action-btn-primary {
             flex: 1;
             padding: 12px;
             background: #0f172a;
             color: white;
             border: none;
             border-radius: 12px;
             font-weight: 600;
             cursor: pointer;
             transition: all 0.2s;
             display: flex;
             align-items: center;
             justify-content: center;
             gap: 8px;
             font-size: 0.95rem;
             box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
          }
          .action-btn-primary:hover {
             background: #3BA3D9;
             transform: translateY(-2px);
          }
          
          .action-btn-secondary {
             padding: 12px;
             background: #f1f5f9;
             color: #0f172a;
             border: none;
             border-radius: 12px;
             font-weight: 600;
             cursor: pointer;
             transition: all 0.2s;
             text-decoration: none;
             display: flex;
             align-items: center;
             justify-content: center;
             flex: 0 0 50px;
          }
          .action-btn-secondary:hover {
             background: #e2e8f0;
             color: #3BA3D9;
          }

          /* Hover Effects */
          .product-card:hover {
             transform: translateY(-8px) !important;
             box-shadow: 0 25px 30px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.02) !important;
             border-color: #e2e8f0;
          }
          .product-card:hover img {
             transform: scale(1.08); 
          }
          .product-card.show {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
          .product-sidebar-container {
             flex: 0 0 300px;
          }

          /* Responsive Layout */
          @media (max-width: 900px) {
            .products-layout {
               flex-direction: column;
            }
            .products-layout > div:first-child {
               width: 100%;
               flex: none !important;
            }
            .product-sidebar {
               position: static;
               width: 100%;
               min-width: 100%;
            }
            .premium-header-container {
                flex-direction: column;
                text-align: center;
            }
            .header-content {
                flex-direction: column;
                text-align: center;
            .cat-products-grid {
                 display: grid !important;
                 grid-template-columns: repeat(2, 1fr) !important;
                 gap: 15px !important;
             }
             .product-card {
                 border-radius: 15px !important;
                 border: 1px solid #f1f5f9 !important;
             }
             .product-card a > div {
                 height: 90px !important;
                 padding: 6px !important;
             }
             .product-card h3 {
                font-size: 0.65rem !important; 
                height: 26px !important;
                margin-bottom: 4px !important;
             }
           }
        `}
      </style>
    </div >
  );
};

export default ProductsByCategory;
