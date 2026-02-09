import React, { useState, useEffect } from "react";
import { FaHeadset, FaWallet, FaTruck, FaShieldAlt } from "react-icons/fa"; // Added Shield for extra trust
import "./StrongFeaturesCard.css";

const StrongFeaturesCard = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const userLang = navigator.language || navigator.userLanguage;
    setLanguage(userLang.startsWith('ar') ? 'ar' : 'en');
  }, []);

  const isRTL = language === 'ar';

  const features = [
    {
      icon: <FaTruck />,
      title: { en: "Fast Shipping", ar: "شحن سريع" },
      subtitle: { en: "Delivery within 24h", ar: "توصيل خلال 24 ساعة" },
      color: "#3b82f6" // Blue
    },
    {
      icon: <FaWallet />,
      title: { en: "Secure Payment", ar: "دفع آمن" },
      subtitle: { en: "Multiple safe options", ar: "خيارات دفع متعددة" },
      color: "#10b981" // Green
    },
    {
      icon: <FaShieldAlt />,
      title: { en: "Money Back", ar: "ضمان استرجاع" },
      subtitle: { en: "30 Days Return", ar: "إرجاع خلال 30 يوم" },
      color: "#f59e0b" // Amber
    },
    {
      icon: <FaHeadset />,
      title: { en: "24/7 Support", ar: "دعم فني" },
      subtitle: { en: "Always here for you", ar: "نحن هنا دائماً" },
      color: "#8b5cf6" // Purple
    }
  ];

  return (
    <div className={`features-container ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="features-wrapper">
        {features.map((item, index) => (
          <div key={index} className="feature-item">
            <div className="feature-icon" style={{ color: item.color, backgroundColor: `${item.color}15` }}>
              {item.icon}
            </div>
            <div className="feature-text">
              <h3>{isRTL ? item.title.ar : item.title.en}</h3>
              <p>{isRTL ? item.subtitle.ar : item.subtitle.en}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrongFeaturesCard;
