// src/components/About.jsx
import React, { useState, useEffect } from "react";
import "./About.css";
import "../MobileFixes.css"; // Mobile fixes - must be last
import { FaCheckCircle, FaRocket, FaHeart, FaUsers, FaBoxOpen, FaGlobe } from "react-icons/fa";

const About = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const userLang = navigator.language || navigator.userLanguage;
    setLanguage(userLang.startsWith('ar') ? 'ar' : 'en');
  }, []);

  const content = {
    en: {
      title: "About Us",
      subtitle: "Dedicated to providing high-quality products and exceptional service since 2024.",
      mission: "Our Mission",
      missionDesc: "Make shopping simple, enjoyable, and affordable for everyone.",
      vision: "Our Vision",
      visionDesc: "Become the most trusted online shopping destination globally.",
      values: "Our Values",
      valuesDesc: "Customer satisfaction, quality products, and integrity in everything we do.",
      stats: {
        customers: "Happy Customers",
        products: "Products",
        countries: "Countries Served"
      },
      cta: "Contact Us"
    },
    ar: {
      title: "من نحن",
      subtitle: "نكرس جهودنا لتقديم منتجات عالية الجودة وخدمة استثنائية منذ عام 2024.",
      mission: "مهمتنا",
      missionDesc: "جعل التسوق بسيطاً وممتعاً وبأسعار معقولة للجميع.",
      vision: "رؤيتنا",
      visionDesc: "أن نصبح وجهة التسوق الإلكتروني الأكثر ثقة عالمياً.",
      values: "قيمنا",
      valuesDesc: "رضا العملاء، جودة المنتجات، والنزاهة في كل ما نقوم به.",
      stats: {
        customers: "عميل سعيد",
        products: "منتج متنوع",
        countries: "دولة نخدمها"
      },
      cta: "تواصل معنا"
    }
  };

  const t = content[language];
  const isRTL = language === 'ar';

  return (
    <div className={`about-page ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Hero Section */}
      <div className="about-hero">
        <div className="container">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </div>

      <div className="container">
        {/* Stats Section */}
        <div className="about-stats">
          <div className="stat-item">
            <FaUsers className="stat-icon" />
            <h3>10,000+</h3>
            <p>{t.stats.customers}</p>
          </div>
          <div className="stat-item">
            <FaBoxOpen className="stat-icon" />
            <h3>5,000+</h3>
            <p>{t.stats.products}</p>
          </div>
          <div className="stat-item">
            <FaGlobe className="stat-icon" />
            <h3>20+</h3>
            <p>{t.stats.countries}</p>
          </div>
        </div>

        {/* Mission/Vision/Values Cards */}
        <div className="about-cards">
          <div className="about-card">
            <div className="card-icon-wrapper">
              <FaCheckCircle />
            </div>
            <h3>{t.mission}</h3>
            <p>{t.missionDesc}</p>
          </div>

          <div className="about-card">
            <div className="card-icon-wrapper">
              <FaRocket />
            </div>
            <h3>{t.vision}</h3>
            <p>{t.visionDesc}</p>
          </div>

          <div className="about-card">
            <div className="card-icon-wrapper">
              <FaHeart />
            </div>
            <h3>{t.values}</h3>
            <p>{t.valuesDesc}</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="about-cta-section">
          <h2>{language === 'ar' ? "جاهز للتسوق؟" : "Ready to Shop?"}</h2>
          <a href="/products" className="cta-btn primary">{language === 'ar' ? "تصفح المنتجات" : "Browse Products"}</a>
          <a href="/contact" className="cta-btn secondary">{t.cta}</a>
        </div>
      </div>
    </div>
  );
};

export default About;
