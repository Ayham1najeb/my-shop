import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = () => {
  const slides = [
    {
      url: process.env.PUBLIC_URL + "/images/hhh.png",
      title: "صورة محلية جميلة",
      subtitle: "هذه صورة مخزنة في مجلد public"
    },
    {
      url: "/images/fff.png",
      title: "صورة طبيعية",
      subtitle: "من Unsplash"
    },
   
   
  
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true
  };

  return (
    <div style={{ marginTop: "80px" }}>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div 
            key={index} 
            style={{ 
              position: "relative", 
              width: "100%", 
              height: "500px", // مثل قبل، لا تصغير
              borderRadius: "0px", // بدون تقطيع، يبقى fullscreen style
              overflow: "hidden",
              boxShadow: "0 6px 15px rgba(0,0,0,0.25)"
            }}
          >
            <img 
              src={slide.url} 
              alt={`slide-${index}`} 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover" 
              }}
            />
            {/* Overlay للنصوص */}
            <div style={{
              position: "absolute",
              bottom: "40px",
              left: "40px",
              color: "white",
              backgroundColor: "rgba(0,0,0,0.45)",
              padding: "20px 30px",
              borderRadius: "12px",
              backdropFilter: "blur(5px)",
              maxWidth: "60%"
            }}>
              <h2 style={{ 
                margin: "0 0 8px 0", 
                fontSize: "26px", 
                fontWeight: "bold", 
                textShadow: "2px 2px 6px rgba(0,0,0,0.7)" 
              }}>
                {slide.title}
              </h2>
              <p style={{ 
                margin: 0, 
                fontSize: "18px", 
                textShadow: "1px 1px 4px rgba(0,0,0,0.6)" 
              }}>
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
