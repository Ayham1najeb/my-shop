import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HeroSlider.css";
// import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const HeroSlider = () => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const userLang = navigator.language || navigator.userLanguage;
        setLanguage(userLang.startsWith('ar') ? 'ar' : 'en');
    }, []);

    const isRTL = language === 'ar';

    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop", // Smart Watch
            title: { en: "Smart Wearables", ar: "أحدث الساعات الذكية" },
            subtitle: { en: "Up to 50% Off", ar: "خصم يصل إلى 50%" },
            desc: { en: "Track your fitness and stay connected with style.", ar: "تتبع لياقتك وابق على اتصال بأناقة." },
            bg: "linear-gradient(135deg, #e2e2e2 0%, #ffffff 100%)"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2224&auto=format&fit=crop", // Dynamic Floating Sneaker
            title: { en: "Sports Collection", ar: "تشكيلة رياضية جديدة" },
            subtitle: { en: "New Arrivals", ar: "واصل حديثاً" },
            desc: { en: "Maximize your performance with our latest gear.", ar: "ارفع مستوى أدائك مع أحدث معداتنا." },
            bg: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=2070&auto=format&fit=crop", // iPhone X on Desk with Laptop (Clear & Elegant)
            title: { en: "The Smart Choice", ar: "الخيار الذكي" },
            subtitle: { en: "Premium Devices", ar: "أجهزة بمستوى رفيع" },
            desc: { en: "Experience the synergy of high-end technology.", ar: "جرب التناغم الحقيقي للتكنولوجيا الفاخرة." },
            bg: "linear-gradient(135deg, #eef2f3 0%, #8e9eab 100%)" // Metallic Silver/Blue
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop", // Elegant Store/Clothing Rack
            title: { en: "Premium Collection", ar: "تشكيلة فاخرة" },
            subtitle: { en: "Selected with Care", ar: "مختارة بعناية" },
            desc: { en: "Explore our latest arrivals in fashion and style.", ar: "استكشف أحدث ما وصلنا من أزياء وموضة." },
            bg: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)" // Warm/Neutral Grey
        }
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        rtl: isRTL,
        arrows: false,
        pauseOnHover: true,
    };

    return (
        <div className={`hero-slider-wrapper ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <Slider {...settings}>
                {slides.map((slide) => (
                    <div key={slide.id} className="hero-slide">
                        <div className="hero-slide-content" style={{ background: slide.bg }}>

                            {/* Text Section */}
                            <div className="hero-text">
                                <span className="hero-badge">{isRTL ? slide.subtitle.ar : slide.subtitle.en}</span>
                                <h1>{isRTL ? slide.title.ar : slide.title.en}</h1>
                                <p>{isRTL ? slide.desc.ar : slide.desc.en}</p>
                                <button className="hero-btn">
                                    {isRTL ? "اكتشف العروض" : "Shop Now"}
                                </button>
                            </div>

                            {/* Image Section */}
                            <div className="hero-image">
                                <img src={slide.image} alt={isRTL ? slide.title.ar : slide.title.en} />
                            </div>

                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HeroSlider;
