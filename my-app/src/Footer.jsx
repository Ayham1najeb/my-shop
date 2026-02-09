import React from "react";
import { Link } from "react-router-dom";
import './Footer.css';
import { FaFacebookF, FaInstagram, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcApplePay, FaGooglePay, FaShieldAlt } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { useLanguage } from './LanguageContext';

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="footer" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="footer-content">
        {/* Brand Column */}
        <div className="footer-column">
          <h2>MyShop</h2>
          <p>
            {language === 'ar'
              ? 'متجرك المفضل لأحدث المنتجات والعروض الحصرية. جودة عالية وتوصيل سريع.'
              : 'Your favorite store for the latest products and exclusive deals. High quality and fast delivery.'}
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer"><SiX /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>{language === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h3>
          <Link to="/products">{language === 'ar' ? 'المنتجات' : 'Products'}</Link>
          <Link to="/categories">{language === 'ar' ? 'التصنيفات' : 'Categories'}</Link>
          <Link to="/promotions">{language === 'ar' ? 'العروض' : 'Promotions'}</Link>
          <Link to="/cart">{language === 'ar' ? 'السلة' : 'Cart'}</Link>
        </div>

        {/* Support */}
        <div className="footer-column">
          <h3>{language === 'ar' ? 'الدعم' : 'Support'}</h3>
          <Link to="/contact">{language === 'ar' ? 'تواصل معنا' : 'Contact Us'}</Link>
          <Link to="/about">{language === 'ar' ? 'من نحن' : 'About Us'}</Link>
          <Link to="/privacy">{language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
          <Link to="/terms">{language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}</Link>
        </div>

        {/* Newsletter */}
        <div className="footer-column">
          <h3>{language === 'ar' ? 'النشرة البريدية' : 'Newsletter'}</h3>
          <p>{language === 'ar' ? 'اشترك للحصول على أحدث العروض' : 'Subscribe for the latest offers'}</p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder={language === 'ar' ? 'بريدك الإلكتروني' : 'Your email address'}
            />
            <button>{language === 'ar' ? 'اشتراك' : 'Subscribe'}</button>
          </div>
        </div>
      </div>

      {/* Payment Cards Section */}
      <div className="payment-cards-section">
        <span className="payment-label">{language === 'ar' ? 'طرق الدفع المقبولة' : 'WE ACCEPT'}</span>
        <div className="payment-icons">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
            alt="Visa"
            className="payment-logo"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="Mastercard"
            className="payment-logo"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
            alt="PayPal"
            className="payment-logo"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
            alt="Apple Pay"
            className="payment-logo apple"
          />
        </div>
        <p className="payment-security">
          <FaShieldAlt />
          {language === 'ar' ? 'دفع آمن 100%' : 'Secure Payment - 100% Protected'}
        </p>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© 2026 MyShop. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}</p>
        <div className="developer-signature">
          <span className="dev-text">
            {language === 'ar' ? 'تطوير المهندس أيهم نجيب' : 'Developed by Eng. Ayham Najeeb'}
          </span>
          <div className="dev-line"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
