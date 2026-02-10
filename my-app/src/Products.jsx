// Products.jsx
import React, { useContext, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "./ProductContext";
import ProductSidebar from "./components/ProductSidebar";
import { FaShoppingCart, FaEye, FaStar, FaSortAmountDown, FaGem, FaFilter, FaTimes } from "react-icons/fa";
import { useLanguage } from './LanguageContext';
import './MobileFixes.css';

const Products = () => {
  const { products, setSelectedProduct, addToCart } = useContext(ProductContext);
  const { t, language } = useLanguage();
  const discountedIds = [3, 8, 11, 6, 9];
  const discountRate = 0.7;

  // Filter & Sort State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Handle body scroll lock and z-index stacking when filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.classList.add('body-filter-open');
    } else {
      document.body.classList.remove('body-filter-open');
    }
    return () => document.body.classList.remove('body-filter-open');
  }, [isMobileFilterOpen]);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    categories: [],
    brands: [],
    colors: [],
    materials: [],
    minRating: null,
    searchQuery: '',
    sortBy: 'default' // default, priceLowHigh, priceHighLow
  });

  // Data Augmentation (Mocking Brands, Colors, Materials, Ratings for Demo)
  const augmentedProducts = useMemo(() => {
    const brandsList = ['nike', 'adidas', 'puma', 'zara', 'h_m', 'apple', 'samsung', 'lc_waikiki'];
    const colorsList = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 'gray'];
    const materialsList = ['cotton', 'polyester', 'linen', 'wool', 'leather', 'denim', 'silk'];

    return products.map((product, index) => {
      const brandIndex = product.id % brandsList.length;
      const colorIndex = (product.id * 2) % colorsList.length;
      const materialIndex = (product.id * 3) % materialsList.length;
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
        // color: Removed mock color assignment to use real backend data
        material: materialsList[materialIndex],
        rating: rating > 5 ? 5 : rating,
        categoryId: catId
      };
    });
  }, [products]);


  // Filter & Logic
  const filteredProducts = useMemo(() => {
    let result = augmentedProducts.filter(product => {
      // 1. Search Filter
      if (filters.searchQuery && !product.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }

      // 2. Category Filter
      if (filters.categories.length > 0) {
        const catMatch = filters.categories.includes(product.categoryId);
        if (!catMatch) return false;
      }

      // 3. Price Filter
      const price = parseFloat(product.price);
      if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;

      // 4. Brand Filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      // 5. Color Filter
      if (filters.colors.length > 0) {
        // Check if product has ANY of the selected colors
        // Backend returns colors array: [{id, name, hex}, ...]
        const productColors = product.colors || [];
        const hasColor = productColors.some(c => filters.colors.includes(c.name.toLowerCase()));

        // Fallback for mock data if still present or mixed
        const mockColorMatch = product.color && filters.colors.includes(product.color);

        if (!hasColor && !mockColorMatch) return false;
      }

      // 6. Rating Filter
      if (filters.minRating && product.rating < filters.minRating) {
        return false;
      }

      // 7. Material Filter
      if (filters.materials.length > 0 && !filters.materials.includes(product.material)) {
        return false;
      }

      return true;
    });

    // Sorting Logic
    if (filters.sortBy === 'priceLowHigh') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (filters.sortBy === 'priceHighLow') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    return result;
  }, [augmentedProducts, filters]);

  const handleAddToCart = (product) => {
    const finalPrice = discountedIds.includes(product.id)
      ? (Number(product.price) * discountRate).toFixed(2)
      : Number(product.price).toFixed(2);
    addToCart({ ...product, price: finalPrice, quantity: 1 });
  };

  useEffect(() => {
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

      {/* Premium Header */}
      <div className="premium-header-container">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <FaGem className="header-icon" />
          </div>
          <div>
            <h2 className="premium-title">{t('exclusive_collection')}</h2>
            <p className="premium-subtitle">{t('exclusive_subtitle')}</p>
          </div>
        </div>
      </div>


      <div className="products-layout" style={{
        display: "flex",
        gap: "40px",
        maxWidth: "1600px",
        margin: "0 auto",
        alignItems: "flex-start"
      }}>

        {/* Sidebar Component */}
        <div
          className={`product-sidebar-container ${isMobileFilterOpen ? 'active' : ''}`}
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ProductSidebar
              filters={filters}
              setFilters={setFilters}
              onClose={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div style={{ flex: "1", minWidth: 0 }}>

          {/* Mobile Filter Toggle Button */}
          <div className="mobile-filter-toggle" onClick={() => setIsMobileFilterOpen(true)}>
            <FaFilter style={{ color: "#3BA3D9" }} />
            <span>{t('filters') || 'Filters'} & {t('sort_by') || 'Sort'}</span>
          </div>

          {/* Controls Bar (Count & Sort) */}
          <div style={{
            marginBottom: "40px",
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: '15px 25px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            <span style={{ color: "#64748b", fontWeight: "600" }}>
              {t('results_found')}: <span style={{ color: "#3BA3D9" }}>{filteredProducts.length}</span> {t('items')}
            </span>

            <div className="sort-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: "#475569" }}>
                <FaSortAmountDown style={{ fontSize: "1.2rem", color: "#3BA3D9" }} />
                <span style={{ fontSize: "1.1rem", fontWeight: "700" }}>{t('sort_by')}:</span>
              </div>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                style={{
                  minWidth: "240px",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  color: "#0f172a",
                  backgroundColor: "#f8fafc",
                  outline: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
                  textAlign: "center",
                  textAlignLast: "center"
                }}
                onMouseOver={(e) => e.target.style.borderColor = "#3BA3D9"}
                onMouseOut={(e) => e.target.style.borderColor = "#e2e8f0"}
              >
                <option value="default">{t('sort_newest')}</option>
                <option value="priceLowHigh">{t('sort_low_high')}</option>
                <option value="priceHighLow">{t('sort_high_low')}</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px",
              background: "white",
              borderRadius: "20px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}>
              <h3 style={{ color: "#94a3b8", fontSize: '1.5rem', marginBottom: '10px' }}>{t('no_results')}</h3>
              <p style={{ color: "#cbd5e1", marginBottom: '20px' }}>{t('try_adjust_filters')}</p>
              <button
                onClick={() => setFilters({ minPrice: '', maxPrice: '', categories: [], brands: [], colors: [], materials: [], minRating: null, searchQuery: '', sortBy: 'default' })}
                style={{
                  padding: "12px 25px",
                  background: "#3BA3D9",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1rem"
                }}
              >
                {t('reset_all')} 🔄
              </button>
            </div>
          ) : (
            <div className="products-grid">
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
                        style={{
                          height: "240px",
                          overflow: "hidden",
                          padding: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "white",
                          position: "relative"
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            transition: "transform 0.5s ease",
                          }}
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
                        padding: "20px",
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

                        {/* Color Swatches */}
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
                            /* Fallback for products with no variants or legacy mock data */
                            product.color && colorMap[product.color] && (
                              <div
                                title={product.color}
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  backgroundColor: colorMap[product.color],
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}
                              />
                            )
                          )}
                          {product.colors && product.colors.length > 3 && (
                            <span style={{ fontSize: '10px', color: '#94a3b8' }}>+</span>
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
                          <FaShoppingCart /> {t('add_to_cart')}
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
             text-align: ${language === 'ar' ? 'right' : 'left'};
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
             font-weight: 500;
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
             padding: 10px;
             background: #0f172a;
             color: white;
             border: none;
             border-radius: 10px;
             font-weight: 600;
             cursor: pointer;
             transition: all 0.2s;
             display: flex;
             align-items: center;
             justify-content: center;
             gap: 6px;
             font-size: 0.9rem;
             box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
          }
          .action-btn-primary:hover {
             background: #3BA3D9;
             transform: translateY(-2px);
          }
          
          .action-btn-secondary {
             padding: 10px;
             background: #f1f5f9;
             color: #0f172a;
             border: none;
             border-radius: 10px;
             font-weight: 600;
             cursor: pointer;
             transition: all 0.2s;
             text-decoration: none;
             display: flex;
             align-items: center;
             justify-content: center;
             flex: 0 0 45px;
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
             flex: 0 0 360px;
             transition: transform 0.3s ease;
          }
          
          /* Grid Layout */
          .products-grid {
             display: grid;
             grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
             gap: 25px;
          }

          /* Mobile Filter Toggle */
          .mobile-filter-toggle {
             display: none;
             width: 100%;
             padding: 14px;
             background: white;
             border: 1px solid #e2e8f0;
             border-radius: 12px;
             color: #0f172a;
             font-weight: 700;
             align-items: center;
             justify-content: center;
             gap: 10px;
             margin-bottom: 20px;
             box-shadow: 0 2px 5px rgba(0,0,0,0.03);
             cursor: pointer;
          }
          
          .mobile-filter-overlay {
             display: none; 
          }

          /* MOBILE NUCLEAR OVERRIDES */
          @media (max-width: 900px) {
            body.body-filter-open {
               overflow: hidden !important;
            }
            
            /* FORCE NAVBAR BELOW FILTER */
            body.body-filter-open .navbar-wrapper,
            body.body-filter-open .sticky-wrapper,
            body.body-filter-open .sticky-active,
            body.body-filter-open .scrolling-bar,
            body.body-filter-open .main-header {
               z-index: 1 !important;
            }

            .products-layout {
               flex-direction: column;
            }
            
            /* NUCLEAR FIX: High Z-Index for Mobile Filter Drawer */
            .product-sidebar-container {
               position: fixed !important;
               top: 0 !important;
               left: 0 !important;
               width: 100vw !important;
               height: 100vh !important;
               z-index: 999999 !important; /* Beat any Navbar */
               background: rgba(0,0,0,0.6) !important;
               visibility: hidden;
               opacity: 0;
               transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
               display: flex !important;
               justify-content: ${language === 'ar' ? 'flex-start' : 'flex-end'} !important;
            }
            
            .product-sidebar-container.active {
               visibility: visible !important;
               opacity: 1 !important;
            }
            
            /* Drawer Content - SOFT AND SMALL (EVEN SLIMMER) */
            .product-sidebar-container > * {
                width: 72% !important; 
                max-width: 280px !important;
                height: 100% !important;
                background: white !important;
                transform: translateX(${language === 'ar' ? '-100%' : '100%'}) !important;
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
                box-shadow: -10px 0 30px rgba(0,0,0,0.2) !important;
                display: flex !important;
                flex-direction: column !important;
                padding: 0 !important; /* NO PADDING AT TOP */
            }
            
            .product-sidebar-container.active > * {
                transform: translateX(0) !important;
            }

            /* Force filter content to top */
            .product-sidebar-container .product-sidebar {
                position: relative !important;
                top: 0 !important;
                margin-top: 0 !important;
                height: 100% !important;
                border-radius: 0 !important;
                padding-top: 0 !important;
            }
            
            .sidebar-mobile-header {
                display: flex !important;
                padding: 10px 15px !important;
                margin: 0 !important;
                background: white !important;
                border-bottom: 1px solid #f1f5f9 !important;
                position: sticky !important;
                top: 0 !important;
                z-index: 10 !important;
            }

             @media (max-width: 991px) {
                .products-grid {
                   grid-template-columns: repeat(2, 1fr) !important;
                   gap: 8px !important; 
                }
                
                .product-card {
                    border-radius: 15px !important; /* Softer corners as requested */
                    padding: 0 !important;
                    overflow: hidden !important;
                    border: 1px solid #f1f5f9 !important;
                 }
                 
                /* Product card image container */
                .product-card a > div {
                    height: 90px !important;
                    padding: 6px !important;
                }
                
                /* Product title */
                .product-card h3 {
                   font-size: 0.65rem !important; 
                   height: 26px !important;
                   margin-bottom: 4px !important;
                   line-height: 1.1 !important;
                }
                
                /* Product card content padding */
                .product-card > div:last-child {
                    padding: 10px !important;
                }
                
                /* Brand tag */
                .product-card span {
                    font-size: 0.6rem !important;
                }
                
                /* Price */
                .product-card div span {
                    font-size: 0.9rem !important;
                }
                
                /* Buttons */
                .action-btn-primary {
                   font-size: 0.6rem !important;
                   padding: 5px 6px !important;
                   border-radius: 5px !important;
                   gap: 2px !important;
                }
                .action-btn-secondary {
                   flex: 0 0 26px !important;
                   padding: 5px !important;
                   border-radius: 5px !important;
                   font-size: 0.9rem !important;
                }
                .badge-discount {
                   font-size: 7px !important;
                   padding: 2px 5px !important;
                   top: 5px !important;
                   left: 5px !important;
                }
                
                /* Rating stars */
                .product-card .fa-star {
                    font-size: 0.65rem !important;
                }
                
                /* Header section */
                .premium-title {
                    font-size: 1.1rem !important;
                }
                .premium-subtitle {
                    font-size: 0.75rem !important;
                }
                .header-icon-wrapper {
                    width: 40px !important;
                    height: 40px !important;
                }
                .header-icon {
                    font-size: 1.2rem !important;
                }
             }

            .premium-header-container {
                flex-direction: column;
                text-align: center;
                margin-bottom: 30px;
            }
            .header-content {
                flex-direction: column;
                text-align: center;
            }
          }
        `}
      </style>
    </div>

  );
};

export default Products;
