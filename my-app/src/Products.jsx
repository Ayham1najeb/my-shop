// Products.jsx
import React, { useContext, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "./ProductContext";
import ProductSidebar from "./components/ProductSidebar";
import { FaShoppingCart, FaEye, FaStar, FaSortAmountDown, FaGem, FaFilter, FaTimes } from "react-icons/fa";
import { useLanguage } from './LanguageContext';

const Products = () => {
  const { products, setSelectedProduct, addToCart } = useContext(ProductContext);
  const { t, language } = useLanguage();
  const discountedIds = [3, 8, 11, 6, 9];
  const discountRate = 0.7;

  // Filter & Sort State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
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

          /* Responsive Layout */
          @media (max-width: 900px) {
            .products-layout {
               flex-direction: column;
            }
            
            /* Hide Sidebar by default on mobile */
            .product-sidebar-container {
               position: fixed;
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               z-index: 2000;
               background: rgba(0,0,0,0.5);
               visibility: hidden;
               opacity: 0;
               transition: all 0.3s;
               display: flex;
               justify-content: flex-end; /* Drawer from right */
            }
            
            .product-sidebar-container.active {
               visibility: visible;
               opacity: 1;
            }
            
            /* Allow access to sidebar content */
            .product-sidebar-container > * {
                width: 85%;
                max-width: 380px;
                height: 100%;
                background: white;
                transform: translateX(${language === 'ar' ? '-100%' : '100%'});
                transition: transform 0.3s ease;
                overflow-y: auto;
                box-shadow: -5px 0 20px rgba(0,0,0,0.1);
            }
            
            .product-sidebar-container.active > * {
                transform: translateX(0);
            }

            .mobile-filter-toggle {
               display: flex;
            }

             @media (max-width: 991px) {
                .products-grid {
                   grid-template-columns: repeat(2, 1fr) !important;
                   gap: 8px !important; 
                }
                
                .product-card {
                    border-radius: 12px !important; 
                 }
                 
                /* Product card image container */
                .product-card a > div {
                    height: 120px !important;
                    padding: 8px !important;
                }
                
                /* Product title */
                .product-card h3 {
                   font-size: 0.75rem !important; 
                   height: 30px !important;
                   margin-bottom: 6px !important;
                   line-height: 1.2 !important;
                }
                
                /* Brand tag */
                .product-card span {
                    font-size: 0.65rem !important;
                }
                
                /* Price */
                .product-card div span {
                    font-size: 1rem !important;
                }
                
                /* Buttons */
                .action-btn-primary {
                   font-size: 0.7rem !important;
                   padding: 6px 8px !important;
                   border-radius: 6px !important;
                   gap: 3px !important;
                }
                .action-btn-secondary {
                   flex: 0 0 30px !important;
                   padding: 6px !important;
                   border-radius: 6px !important;
                }
                .badge-discount {
                   font-size: 8px !important;
                   padding: 3px 6px !important;
                   top: 6px !important;
                   left: 6px !important;
                }
                
                /* Header section */
                .premium-title {
                    font-size: 1.2rem !important;
                }
                .premium-subtitle {
                    font-size: 0.8rem !important;
                }
                .header-icon-wrapper {
                    width: 45px !important;
                    height: 45px !important;
                }
                .header-icon {
                    font-size: 1.4rem !important;
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
