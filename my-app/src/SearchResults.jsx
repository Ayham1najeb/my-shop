import React, { useContext, useMemo } from "react";
import { ProductContext } from "./ProductContext";
import { useLocation, Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaEye, FaStar, FaHome } from "react-icons/fa";
import { useLanguage } from './LanguageContext';
import './SearchResults.css';

const SearchResults = () => {
  const { products, setSelectedProduct, addToCart } = useContext(ProductContext);
  const { t, language } = useLanguage();
  const location = useLocation();

  // Discount Data (Same as Products.jsx for consistency)
  const discountedIds = [3, 8, 11, 6, 9];
  const discountRate = 0.7;

  // Color Map for Visual Tags
  const colorMap = {
    black: '#000000', white: '#ffffff', red: '#ef4444', blue: '#3b82f6',
    green: '#22c55e', yellow: '#eab308', purple: '#a855f7', gray: '#6b7280'
  };

  // 1. Get Query
  const query = new URLSearchParams(location.search).get("query") || "";

  // 2. Data Augmentation (Mock Data Consistency)
  const augmentedProducts = useMemo(() => {
    const brandsList = ['nike', 'adidas', 'puma', 'zara', 'h_m', 'apple', 'samsung', 'lc_waikiki'];
    const colorsList = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 'gray'];

    return products.map((product) => {
      const brandIndex = product.id % brandsList.length;
      const colorIndex = (product.id * 2) % colorsList.length;
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
        // color: colorsList[colorIndex], // Removed mock
        rating: rating > 5 ? 5 : rating,
        categoryId: catId
      };
    });
  }, [products]);

  // 3. Enhanced Search Logic
  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();

    return augmentedProducts.filter(product => {
      const titleMatch = product.title.toLowerCase().includes(lowerQuery);
      const catMatch = product.category && product.category.toLowerCase().includes(lowerQuery);
      const brandMatch = product.brand && product.brand.toLowerCase().includes(lowerQuery);
      const descMatch = product.description && product.description.toLowerCase().includes(lowerQuery);

      return titleMatch || catMatch || brandMatch || descMatch;
    });
  }, [augmentedProducts, query]);


  const handleAddToCart = (product) => {
    const price = Number(product.price) || 0;
    const finalPrice = discountedIds.includes(product.id)
      ? (price * discountRate).toFixed(2)
      : price.toFixed(2);
    addToCart({ ...product, price: finalPrice, quantity: 1 });
  };

  return (
    <div className="search-results-container">

      {/* Header */}
      <div className="search-header-container">
        <div className="search-header-content">
          <div className="search-icon-wrapper">
            <FaSearch className="search-header-icon" />
          </div>
          <div>
            <h2 className="search-title">
              {t('search_results_for') || 'Search Results for'} <span className="highlight-text">"{query}"</span>
            </h2>
            <p className="search-subtitle">{t('exclusive_subtitle') || 'Discover our curated selection of premium products, designed for excellence.'}</p>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info-bar">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#64748b', fontWeight: '600' }}>
          <FaHome /> {t('home') || 'Home'}
        </Link>
        <span className="results-count">
          {filteredProducts.length} {t('results_found') || 'results found'}
        </span>
      </div>

      {/* Grid */}
      <div className="search-products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => {
            const isDiscounted = discountedIds.includes(product.id);
            const price = Number(product.price) || 0;
            const finalPrice = isDiscounted
              ? (price * discountRate).toFixed(2)
              : price.toFixed(2);

            return (
              <div key={product.id} className="search-product-card">
                <Link
                  to={`/products/${product.id}`}
                  onClick={() => setSelectedProduct(product)}
                  className="card-image-wrapper"
                >
                  <img src={product.image} alt={product.title} />
                  {isDiscounted && <span className="card-discount-badge">SALE</span>}
                </Link>

                <div className="card-content">
                  {/* Brand & Color */}
                  <div className="card-tags">
                    <span className="card-brand">{product.brand}</span>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {product.colors && product.colors.length > 0 ? (
                        product.colors.slice(0, 3).map(c => (
                          <div
                            key={c.id}
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: c.hex,
                              border: c.hex === '#ffffff' ? '1px solid #ddd' : 'none'
                            }}
                            title={c.name}
                          />
                        ))
                      ) : (
                        product.color && colorMap[product.color] && (
                          <div
                            className="card-color-dot"
                            style={{ backgroundColor: colorMap[product.color] }}
                            title={product.color}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/products/${product.id}`}
                    onClick={() => setSelectedProduct(product)}
                    style={{ textDecoration: 'none' }}
                  >
                    <h3 className="card-title">{product.title}</h3>
                  </Link>

                  {/* Rating */}
                  <div className="card-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        color={i < (product.rating || 4) ? "#fbbf24" : "#e2e8f0"}
                        size={14}
                      />
                    ))}
                  </div>

                  {/* Price */}
                  <div className="card-price">
                    {isDiscounted ? (
                      <>
                        <span className="price-current price-discounted">${finalPrice}</span>
                        <span className="price-original">${product.price}</span>
                      </>
                    ) : (
                      <span className="price-current">${product.price}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="card-actions">
                    <button
                      className="btn-add-cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FaShoppingCart /> {t('add_to_cart') || 'Add'}
                    </button>
                    <Link
                      to={`/products/${product.id}`}
                      className="btn-view-details"
                    >
                      <FaEye />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ color: '#64748b', fontSize: '1.5rem' }}>{t('no_results') || 'No results found'}</h3>
            <p style={{ color: '#94a3b8' }}>{t('try_different_keywords') || 'Try different keywords'}</p>
            <Link to="/" className="btn-back-home" style={{ marginTop: '20px', display: 'inline-block' }}>
              {t('back_home') || 'Back to Home'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
