// ProductDetails.js
import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { ProductContext } from "./ProductContext";
import API_URL from './apiConfig';
import {
  FaShoppingCart, FaStar, FaArrowRight, FaArrowLeft,
  FaTruck, FaUndo, FaShieldAlt, FaCheck, FaHeart, FaRegHeart,
  FaWhatsapp, FaFacebookF, FaTwitter, FaLink, FaShareAlt
} from "react-icons/fa";
import { useLanguage } from './LanguageContext';
import "./ProductDetails.css";
import ProductReviews from "./components/ProductReviews";

const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart, toggleWishlist, isInWishlist } = useContext(ProductContext);
  const { language } = useLanguage();

  const productFromContext = products.find((p) => p.id === parseInt(id));
  const [product, setProduct] = useState(productFromContext || null);
  const [loading, setLoading] = useState(true);

  // Variant States
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null); // Changed to null initially
  const [selectedColor, setSelectedColor] = useState(null);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Fetch Full Product Details (with Variants)
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);

          // Process Variants
          if (data.variants && data.variants.length > 0) {
            const uniqueColors = [];
            const seenColors = new Set();

            data.variants.forEach(v => {
              if (v.color && !seenColors.has(v.color.id)) {
                seenColors.add(v.color.id);
                uniqueColors.push({
                  id: v.color.id,
                  name: v.color.name_en || v.color.name, // Fallback if needed
                  nameAr: v.color.name_ar,
                  hex: v.color.hex_code
                });
              }
            });

            setAvailableColors(uniqueColors);

            // Select first color by default if available
            if (uniqueColors.length > 0) {
              setSelectedColor(uniqueColors[0]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch product details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Update Main Image & dependent states when product loads
  useEffect(() => {
    if (product) {
      setMainImage(product.image);
    }
  }, [product]);

  // Filter Sizes based on Selected Color (Trendyol Style)
  useEffect(() => {
    if (product && product.variants) {
      let relevantVariants = [];

      if (selectedColor) {
        // 1. If color selected, filter by it
        relevantVariants = product.variants.filter(
          v => v.color && v.color.id === selectedColor.id && v.stock > 0
        );
      } else {
        // 2. If no color selected (or no colors exist), show all available sizes
        relevantVariants = product.variants.filter(v => v.stock > 0);
      }

      // Deduplicate sizes
      const uniqueSizesMap = new Map();
      relevantVariants.forEach(v => {
        if (v.size && !uniqueSizesMap.has(v.size.id)) {
          uniqueSizesMap.set(v.size.id, {
            id: v.size.id,
            name: v.size.name,
            variantId: v.id,
            stock: v.stock
          });
        }
      });

      const processedSizes = Array.from(uniqueSizesMap.values());
      setAvailableSizes(processedSizes);

      // Auto-select first available size or reset
      if (processedSizes.length > 0) {
        // Only auto-select if current selection is invalid
        const isCurrentValid = processedSizes.find(s => s.name === selectedSize);
        if (!isCurrentValid) setSelectedSize(processedSizes[0].name);
      } else {
        setSelectedSize(null);
      }
    }
  }, [selectedColor, product, selectedSize]);




  if (loading && !product) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="error-container">Product not found</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      Swal.fire({
        title: language === 'ar' ? "تنبيه" : "Selection Required",
        text: language === 'ar' ? "يرجى اختيار اللون والمقاس أولاً" : "Please select a color and size first",
        icon: 'warning',
        confirmButtonText: language === 'ar' ? "حسناً" : "OK",
        confirmButtonColor: '#3BA3D9'
      });
      return;
    }

    addToCart({
      ...product,
      quantity,
      size: selectedSize,
      color: selectedColor?.name
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = product.title;

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    } else if (platform === 'native') {
      // Use native Web Share API
      if (navigator.share) {
        navigator.share({
          title: product.title,
          text: text,
          url: url
        }).catch(() => { });
      } else {
        // Fallback to copy
        navigator.clipboard.writeText(url);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  // Similar products (same category)
  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const isFavorite = isInWishlist(product.id);

  return (
    <div className="product-details-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="details-container">

        {/* Left Column: Gallery */}
        <div className="product-gallery-section">
          <div className="main-image-wrapper">
            {mainImage && <img src={mainImage} alt={product.title} className="main-img" />}
            {/* Wishlist Button */}
            <button
              className={`wishlist-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => toggleWishlist(product)}
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
          <div className="thumbnails-row">
            {[product.image, product.image, product.image].map((img, idx) => (
              <div
                key={idx}
                className={`thumb-item ${mainImage === img ? 'active' : ''}`}
                onClick={() => setMainImage(img)}
              >
                <img src={img} alt="thumb" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="product-info-section">
          <Link to="/products" className="back-link">
            {language === 'ar' ? <FaArrowRight /> : <FaArrowLeft />}
            {language === 'ar' ? 'العودة للمنتجات' : 'Back to Products'}
          </Link>

          <h1 className="product-title-large">
            {language === 'ar' ? (product.title_ar || product.title) : product.title}
          </h1>

          <div className="product-meta-row">
            <div className="rating-badge">
              <span>{product.rating?.rate ?? 0}</span> <FaStar />
            </div>
            <span className="review-count">{product.rating?.count ?? 0} {language === 'ar' ? 'تقييم' : 'reviews'}</span>
            <span className="separator">•</span>
            <span className="stock-status">{language === 'ar' ? 'متوفر' : 'In Stock'}</span>
          </div>

          <div className="price-box">
            <span className="current-price">${product.price}</span>
          </div>

          <p className="product-description-text">
            {product.description}
          </p>

          {/* Color Selector */}
          <div className="options-section">
            <div className="option-group">
              <span className="option-label">
                {language === 'ar' ? 'اللون' : 'Color'}:
                <span className="selected-option-name">
                  {selectedColor ? (language === 'ar' ? selectedColor.nameAr : selectedColor.name) : ''}
                </span>
              </span>
              <div className="color-selector">
                {availableColors.length > 0 ? availableColors.map(color => (
                  <button
                    key={color.id}
                    className={`color-btn ${selectedColor?.id === color.id ? 'active' : ''}`}
                    style={{ backgroundColor: color.hex, border: color.hex === '#ffffff' ? '1px solid #ddd' : 'none' }}
                    onClick={() => setSelectedColor(color)}
                    title={language === 'ar' ? color.nameAr : color.name}
                  >
                    {selectedColor?.id === color.id && <FaCheck className="check-icon" style={{ color: color.hex === '#ffffff' ? '#000' : '#fff' }} />}
                  </button>
                )) : <p style={{ color: '#999', fontSize: '0.9rem' }}>No colors available</p>}
              </div>
            </div>

            {/* Size Selector */}
            <div className="option-group">
              <span className="option-label">
                {language === 'ar' ? 'المقاس' : 'Size'}:
                <span className="selected-option-name">{selectedSize}</span>
              </span>
              <div className="size-selector">
                {availableSizes.length > 0 ? availableSizes.map(sizeObj => (
                  <button
                    key={sizeObj.id}
                    className={`size-btn ${selectedSize === sizeObj.name ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sizeObj.name)}
                  >
                    {sizeObj.name}
                  </button>
                )) : (
                  <p style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '5px' }}>
                    {language === 'ar' ? 'لا توجد مقاسات لهذا اللون' : 'No sizes for this color'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="action-buttons">
            <div className="quantity-selector">
              <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
              <span className="qty-value">{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            </div>
            <button
              className={`add-to-cart-large ${addedToCart ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? (
                <>
                  <FaCheck /> {language === 'ar' ? 'تمت الإضافة!' : 'Added!'}
                </>
              ) : (
                <>
                  <FaShoppingCart /> {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                </>
              )}
            </button>
          </div>

          {/* Social Share */}
          <div className="share-section">
            <span className="share-label">{language === 'ar' ? 'مشاركة:' : 'Share:'}</span>
            <div className="share-buttons">
              <button className="share-btn native" onClick={() => handleShare('native')} title={language === 'ar' ? 'مشاركة' : 'Share'}>
                <FaShareAlt />
              </button>
              <button className="share-btn whatsapp" onClick={() => handleShare('whatsapp')}>
                <FaWhatsapp />
              </button>
              <button className="share-btn facebook" onClick={() => handleShare('facebook')}>
                <FaFacebookF />
              </button>
              <button className="share-btn twitter" onClick={() => handleShare('twitter')}>
                <FaTwitter />
              </button>
              <button className="share-btn copy" onClick={() => handleShare('copy')}>
                <FaLink />
              </button>
            </div>
            {showShareToast && (
              <span className="share-toast">{language === 'ar' ? 'تم نسخ الرابط!' : 'Link copied!'}</span>
            )}
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="trust-item">
              <FaTruck className="trust-icon" />
              <div>
                <h4>{language === 'ar' ? 'شحن مجاني' : 'Free Delivery'}</h4>
                <p>{language === 'ar' ? 'للطلبات فوق 200$' : 'For orders over $200'}</p>
              </div>
            </div>
            <div className="trust-item">
              <FaUndo className="trust-icon" />
              <div>
                <h4>{language === 'ar' ? 'استرجاع سهل' : 'Easy Returns'}</h4>
                <p>{language === 'ar' ? 'خلال 30 يوم' : 'Within 30 days'}</p>
              </div>
            </div>
            <div className="trust-item">
              <FaShieldAlt className="trust-icon" />
              <div>
                <h4>{language === 'ar' ? 'دفع آمن' : 'Secure Payment'}</h4>
                <p>{language === 'ar' ? 'حماية 100%' : '100% Protected'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews Section - Full Width */}
      <ProductReviews productId={parseInt(id)} />
    </div>
  );
};

export default ProductDetails;
