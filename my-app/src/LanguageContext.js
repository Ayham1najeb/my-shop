import React, { createContext, useState, useEffect, useContext } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const savedLang = localStorage.getItem('language');
        return savedLang || (navigator.language.startsWith('ar') ? 'ar' : 'en');
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.lang = language;
    }, [language]);

    // Translation function: t('key')
    const t = (key) => {
        const keys = key.split('.'); // Allow nested keys if needed (e.g. 'home.title')
        let value = translations[language];

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // Fallback to key if not found
            }
        }
        return value;
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
    }

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
