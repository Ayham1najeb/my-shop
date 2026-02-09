import React, { useState, useEffect, useRef } from 'react';
import ReactCountryFlag from "react-country-flag";
import './LanguageSelector.css';

const LanguageSelector = ({ currentLang, onLanguageChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (lang) => {
        onLanguageChange(lang);
        setIsOpen(false);
    };

    return (
        <div className="language-selector" ref={dropdownRef}>
            <div
                className={`lang-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <ReactCountryFlag
                    countryCode={currentLang === 'ar' ? "SA" : "US"}
                    svg
                    style={{
                        width: '24px',
                        height: '18px',
                        marginRight: currentLang === 'en' ? '8px' : '0',
                        marginLeft: currentLang === 'ar' ? '8px' : '0'
                    }}
                />
                <span className="lang-code">{currentLang.toUpperCase()}</span>
                <span className="arrow-icon">▼</span>
            </div>

            {isOpen && (
                <div className="lang-menu">
                    <div
                        className={`lang-option ${currentLang === 'en' ? 'active' : ''}`}
                        onClick={() => handleSelect('en')}
                    >
                        <ReactCountryFlag
                            countryCode="US"
                            svg
                            style={{ width: '20px', height: '15px', marginRight: '8px' }}
                        />
                        English
                    </div>
                    <div
                        className={`lang-option ${currentLang === 'ar' ? 'active' : ''}`}
                        onClick={() => handleSelect('ar')}
                    >
                        <ReactCountryFlag
                            countryCode="SA"
                            svg
                            style={{ width: '20px', height: '15px', marginRight: '8px' }}
                        />
                        العربية
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
