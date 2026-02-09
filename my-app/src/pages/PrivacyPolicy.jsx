import React from 'react';
import './PrivacyPolicy.css';
import { FaShieldAlt, FaUserSecret, FaLock, FaCookieBite, FaHeadset } from 'react-icons/fa';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-page" dir="rtl">
            {/* Hero Section */}
            <div className="privacy-hero">
                <div className="privacy-hero-content">
                    <FaShieldAlt className="hero-icon" />
                    <h1>سياسة الخصوصية</h1>
                    <p>نحن نقدر ثقتك ونلتزم بحماية بياناتك الشخصية بأعلى معايير الأمان.</p>
                </div>
            </div>

            <div className="privacy-container">

                {/* Introduction Card */}
                <div className="privacy-card intro-card">
                    <div className="card-icon-wrapper">
                        <FaUserSecret />
                    </div>
                    <h2>مقدمة</h2>
                    <p>
                        في <strong>MyShop</strong>، خصوصيتك هي أولويتنا القصوى. توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية عند استخدامك لموقعنا. نحن نلتزم بالشفافية الكاملة ونضمن لك تجربة تسوق آمنة وموثوقة.
                    </p>
                </div>

                {/* Data Collection */}
                <div className="privacy-section">
                    <div className="section-header">
                        <h3>ما هي المعلومات التي نجمعها؟</h3>
                    </div>
                    <p>نقوم بجمع بعض المعلومات الأساسية لضمان تقديم أفضل خدمة ممكنة، وتشمل:</p>
                    <ul className="privacy-list">
                        <li><strong>المعلومات الشخصية:</strong> مثل الاسم، البريد الإلكتروني، ورقم الهاتف عند التسجيل أو الشراء.</li>
                        <li><strong>بيانات الدفع:</strong> تتم معالجة جميع عمليات الدفع عبر بوابات آمنة ومشفرة بالكامل.</li>
                        <li><strong>بيانات التصفح:</strong> تحسين تجربتك من خلال تحليل كيفية استخدامك للموقع.</li>
                    </ul>
                </div>

                {/* Data Protection */}
                <div className="privacy-section highlight-bg">
                    <div className="section-header">
                        <FaLock className="section-icon" />
                        <h3>كيف نحمي بياناتك؟</h3>
                    </div>
                    <p>
                        نستخدم أحدث تقنيات التشفير (SSL) وبروتوكولات الأمان العالمية لحماية بياناتك من أي وصول غير مصرح به. بياناتك مخزنة في خوادم آمنة ولا يتم مشاركتها مع أي طرف ثالث لأغراض تجارية دون موافقتك.
                    </p>
                </div>

                {/* Cookies */}
                <div className="privacy-section">
                    <div className="section-header">
                        <FaCookieBite className="section-icon" />
                        <h3>ملفات تعريف الارتباط (Cookies)</h3>
                    </div>
                    <p>
                        نستخدم ملفات تعريف الارتباط لتحسين تجربتك في الموقع، وتذكر تفضيلاتك، وتقديم محتوى مخصص يناسب اهتماماتك. يمكنك التحكم في إعدادات الكوكيز من خلال متصفحك في أي وقت.
                    </p>
                </div>

                {/* Contact Us */}
                <div className="privacy-contact">
                    <FaHeadset className="contact-icon" />
                    <h3>لديك استفسار؟</h3>
                    <p>فريق الدعم لدينا جاهز للإجابة على جميع أسئلتك بخصوص الخصوصية.</p>
                    <button className="contact-btn">تواصل معنا</button>
                </div>

            </div>
        </div>
    );
};

export default PrivacyPolicy;
