import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "./ProductContext";
import { FaTags, FaShoppingBag, FaEye } from "react-icons/fa";
import "./Promotions.css";

const Promotions = () => {
  const { products, addToCart, setSelectedProduct } = useContext(ProductContext);

  // داتا المنتجات المختارة للعروض
  const discountedIds = [3, 8, 11, 6, 9, 1, 2, 7, 10, 15];
  const discountRate = 0.7;
  const discountedProducts = products.filter((p) => discountedIds.includes(p.id));

  const handleAddToCart = (product) => {
    const finalPrice = (product.price * discountRate).toFixed(2);
    addToCart({ ...product, price: parseFloat(finalPrice), quantity: 1 });
  };

  // وظيفة التعامل مع حركة الماوس لعمل تأثير الـ 3D التفاعلي
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // حساب الـ Mouse Position كنسبة مئوية (0 إلى 1)
    const px = x / rect.width;
    const py = y / rect.height;

    // إرسال القيم للـ CSS عبر الـ Variables
    card.style.setProperty('--mx', `${px * 100}%`);
    card.style.setProperty('--my', `${py * 100}%`);
    card.style.setProperty('--rx', `${(py - 0.5) * 35}deg`); // ميلان المحور X
    card.style.setProperty('--ry', `${(px - 0.5) * -35}deg`); // ميلان المحور Y
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    // تصفير القيم عند خروج الماوس لإعادة الكرت لوضعه الطبيعي بشياكة
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  };

  return (
    <div className="promotions-container">
      <div className="promotions-header">
        <h2 className="promotions-title">
          <FaTags className="tag-icon" /> عروضنا الحصرية
        </h2>
        <p className="promotions-subtitle">تفاعل مع العروض واكتشف قوة التصميم الحديث</p>
        <div className="promotions-underline"></div>
      </div>

      <div className="promotions-grid-container">
        {discountedProducts.map((product, index) => {
          const finalPrice = (product.price * discountRate).toFixed(2);
          const labels = ["وفر 30%", "أكثر مبيعاً", "عرض خاص", "منتج فاخر"];
          const currentLabel = labels[index % labels.length];

          return (
            <div
              key={`${product.id}-${index}`}
              className="promo-card holo-interactive"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* طبقة اللمعان الزجاجية التفاعلية */}
              <div className="holo-gloss"></div>

              <Link
                to={`/products/${product.id}`}
                onClick={() => setSelectedProduct(product)}
                className="promo-link"
              >
                <div className="promo-img-box">
                  <img src={product.image} alt={product.title} />
                  <div className="promo-discount-badge">{currentLabel}</div>
                </div>
              </Link>

              <div className="promo-info">
                <Link
                  to={`/products/${product.id}`}
                  onClick={() => setSelectedProduct(product)}
                  style={{ textDecoration: 'none' }}
                >
                  <h3 className="promo-title">{product.title}</h3>
                </Link>

                <div className="promo-price-row">
                  <span className="promo-price-old">${product.price}</span>
                  <span className="promo-price-new">${finalPrice}</span>
                </div>

                <div className="promo-actions">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-promo-cart magnetic-btn"
                  >
                    <FaShoppingBag /> إضافة
                  </button>
                  <Link
                    to={`/products/${product.id}`}
                    onClick={() => setSelectedProduct(product)}
                    className="btn-promo-details"
                  >
                    <FaEye /> تفاصيل
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Promotions;
