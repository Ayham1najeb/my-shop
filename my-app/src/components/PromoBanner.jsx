import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import './PromoBanner.css';

const PromoBanner = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();

    const isAr = language === 'ar';

    return (
        <section className="legendary-banner" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="banner-bg-pattern"></div>

            {/* Moving Text Marquee */}
            <div className="banner-marquee">
                <div className="marquee-content">
                    {Array(10).fill(0).map((_, i) => (
                        <span key={i}>
                            {isAr ? ' • تشكيلة الربيع الحصرية • خصم يصل إلى 60% • فخامة بلا حدود • جودة أسطورية ' : ' • EXCLUSIVE SPRING COLLECTION • UP TO 60% OFF • TIMELESS LUXURY • LEGENDARY QUALITY '}
                        </span>
                    ))}
                </div>
            </div>

            <div className="banner-inner">
                {/* Images Section */}
                <div className="banner-visual-gallery">
                    <div className="image-card card-1">
                        <img src="/images/banner/model1.png" alt="Fashion 1" />
                    </div>
                    <div className="image-card card-2">
                        <img src="/images/banner/model2.png" alt="Fashion 2" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="banner-text-content">
                    <div className="banner-badge-bubble">
                        {isAr ? 'استكشف الأناقة' : 'Shop Elegance'}
                    </div>

                    <h2 className="banner-main-title">
                        {isAr ? (
                            <>أناقة <span className="text-glow">بلا حدود</span></>
                        ) : (
                            <>Timeless <span className="text-glow">Elegance</span></>
                        )}
                    </h2>

                    <div className="banner-discount-box">
                        <div className="discount-value">{isAr ? '%60 خصم' : '60% OFF'}</div>
                        <div className="discount-label">{isAr ? 'خصم على التشكيلة الجديدة' : 'Discount on new collection'}</div>
                    </div>

                    <p className="banner-sub-text">
                        {isAr
                            ? 'اكتشف التشكيلة الجديدة التي تجمع بين الفخامة والعصرية بأفضل الأسعار.'
                            : 'Discover the new collection that combines luxury and modernity at the best prices.'}
                    </p>

                    <button className="banner-action-btn" onClick={() => navigate('/products')}>
                        {isAr ? 'تسوق الآن' : 'Shop Now'}
                    </button>

                    <div className="banner-date-tag">
                        03 - 28 Feb
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;
