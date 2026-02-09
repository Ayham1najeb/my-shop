import React from "react";
import { Link } from "react-router-dom";
import { FaMale, FaFemale, FaChild, FaRunning, FaRing, FaLaptop, FaCompass, FaPlus, FaGem, FaTshirt } from "react-icons/fa";
import "./Categories.css";

const Categories = ({ isHomePage = false }) => {
  const categories = [
    { name: "أزياء رجالية", path: "/categories/men", image: "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=800", icon: <FaMale size={40} />, category: "men" },
    { name: "أزياء نسائية", path: "/categories/women", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80", icon: <FaFemale size={40} />, category: "women" },
    { name: "ملابس أطفال", path: "/categories/kids", image: "https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg?auto=compress&cs=tinysrgb&w=800", icon: <FaChild size={40} />, className: "kids", category: "kids" },
    { name: "ملابس رياضية", path: "/categories/sports", image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80", icon: <FaRunning size={40} />, category: "sports" },
    { name: "إكسسوارات الفخامة", path: "/categories/accessories", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80", icon: <FaRing size={40} />, category: "accessories" },
    { name: "إلكترونيات سريعة", path: "/categories/electronics", image: "https://images.pexels.com/photos/2651794/pexels-photo-2651794.jpeg?auto=compress&cs=tinysrgb&w=800", icon: <FaLaptop size={40} />, category: "electronics" },
    { name: "مجوهرات ثمينة", path: "/categories/jewelery", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80", icon: <FaGem size={40} />, category: "jewelery" },
    { name: "أزياء صيفية", path: "/categories/summer", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80", icon: <FaTshirt size={40} />, category: "summer" },
  ];

  // في الصفحة الرئيسية نعرض أول 6 فقط
  const displayedCategories = isHomePage ? categories.slice(0, 6) : categories;

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = x / rect.width;
    const py = y / rect.height;

    card.style.setProperty('--mx', `${px * 100}%`);
    card.style.setProperty('--my', `${py * 100}%`);
    card.style.setProperty('--rx', `${(py - 0.5) * 25}deg`);
    card.style.setProperty('--ry', `${(px - 0.5) * -25}deg`);
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  };

  return (
    <div className="categories-container">
      <div className="section-header">
        <h2 className="section-title">
          <FaCompass className="title-icon" /> {isHomePage ? "تسوق حسب الفئة" : "جميع الأقسام"}
        </h2>
        <div className="section-underline"></div>
      </div>

      <div className="categories-grid">
        {displayedCategories.map((cat) => (
          <Link
            key={cat.name}
            to={cat.path}
            className={`category-card holo-interactive ${cat.className || ""}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="cat-img-wrapper">
              <img src={cat.image} alt={cat.name} />
              <div className="cat-holo-gloss"></div>
            </div>

            <div className="cat-overlay">
              <div className="cat-icon-box">{cat.icon}</div>
              <h3 className="cat-name">{cat.name}</h3>
              <div className="cat-explore-btn">استكشف الآن</div>
            </div>
          </Link>
        ))}
      </div>

      {isHomePage && (
        <div className="categories-footer">
          <Link to="/categories" className="btn-show-all-categories">
            <span>عرض كافة أقسام المتجر</span>
            <FaPlus className="plus-icon" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Categories;
