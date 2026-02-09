import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaLinkedin, FaInstagram, FaPaperPlane, FaWhatsapp } from "react-icons/fa";
import { SiX } from "react-icons/si";
import "./Contact.css";

const Contact = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const userLang = navigator.language || navigator.userLanguage;
    setLanguage(userLang.startsWith('ar') ? 'ar' : 'en');
  }, []);

  const content = {
    en: {
      title: "Get in Touch",
      subtitle: "We'd love to hear from you! Whether you have a question about products, pricing, or anything else, our team is ready to answer all your questions.",
      phone: "Phone",
      email: "Email",
      location: "Headquarters",
      address: "Istanbul, Turkey",
      followUs: "Follow Us",
      sendMessage: "Send Message",
      name: "Your Name",
      emailInput: "Your Email",
      subject: "Subject",
      message: "Message",
      send: "Send Message",
      success: "Message sent successfully!",
    },
    ar: {
      title: "تواصل معنا",
      subtitle: "نحن هنا لمساعدتك! سواء كان لديك سؤال حول المنتجات، الأسعار، أو أي شيء آخر، فريقنا جاهز للإجابة على جميع استفساراتك.",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      location: "المقر الرئيسي",
      address: "إسطنبول، تركيا",
      followUs: "تابعنا على",
      sendMessage: "أرسل رسالة",
      name: "الاسم الكامل",
      emailInput: "البريد الإلكتروني",
      subject: "الموضوع",
      message: "الرسالة",
      send: "إرسال الرسالة",
      success: "تم إرسال الرسالة بنجاح!",
    }
  };

  const t = content[language];
  const isRTL = language === 'ar';

  return (
    <div className={`contact-page ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Hero Section */}
      <div className="contact-hero">
        <div className="container">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </div>

      <div className="container contact-container">

        {/* Contact Info Cards */}
        <div className="contact-grid">
          <div className="contact-card">
            <div className="icon-wrapper">
              <FaMapMarkerAlt />
            </div>
            <h3>{t.location}</h3>
            <p>{t.address}</p>
          </div>

          <div className="contact-card">
            <div className="icon-wrapper">
              <FaPhoneAlt />
            </div>
            <h3>{t.phone}</h3>
            <p>+90 555 555 555</p>
          </div>

          <div className="contact-card">
            <div className="icon-wrapper">
              <FaEnvelope />
            </div>
            <h3>{t.email}</h3>
            <p>support@myshop.com</p>
          </div>
        </div>

        <div className="contact-content-wrapper">
          {/* Map Section */}
          <div className="map-section">
            <iframe
              title="Company Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.667527027553!2d28.978358!3d41.008237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7a2c23c43c5%3A0x2f9f4e8e3e39e4e2!2sIstanbul!5e0!3m2!1sen!2str!4v1633444590682!5m2!1sen!2str"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          {/* Form Section */}
          <div className="form-section">
            <h2>{t.sendMessage}</h2>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <input type="text" placeholder={t.name} required />
              </div>
              <div className="form-group">
                <input type="email" placeholder={t.emailInput} required />
              </div>
              <div className="form-group">
                <input type="text" placeholder={t.subject} required />
              </div>
              <div className="form-group">
                <textarea placeholder={t.message} rows="5" required></textarea>
              </div>
              <button type="submit" className="submit-btn">
                <FaPaperPlane /> {t.send}
              </button>
            </form>

            <div className="social-links">
              <h3>{t.followUs}</h3>
              <div className="icons">
                <a href="#" className="social-icon facebook"><FaFacebook /></a>
                <a href="#" className="social-icon instagram"><FaInstagram /></a>
                <a href="#" className="social-icon twitter"><SiX /></a>
                <a href="#" className="social-icon whatsapp"><FaWhatsapp /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
