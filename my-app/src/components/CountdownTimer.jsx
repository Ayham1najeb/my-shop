import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

const CountdownTimer = ({ targetDate, language = 'en' }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(targetDate) - new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const labels = {
        days: language === 'ar' ? 'يوم' : 'Days',
        hours: language === 'ar' ? 'ساعة' : 'Hours',
        minutes: language === 'ar' ? 'دقيقة' : 'Mins',
        seconds: language === 'ar' ? 'ثانية' : 'Secs'
    };

    const formatNumber = (num) => String(num).padStart(2, '0');

    return (
        <div className="countdown-timer" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="countdown-item">
                <span className="countdown-value">{formatNumber(timeLeft.days)}</span>
                <span className="countdown-label">{labels.days}</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-item">
                <span className="countdown-value">{formatNumber(timeLeft.hours)}</span>
                <span className="countdown-label">{labels.hours}</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-item">
                <span className="countdown-value">{formatNumber(timeLeft.minutes)}</span>
                <span className="countdown-label">{labels.minutes}</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-item">
                <span className="countdown-value">{formatNumber(timeLeft.seconds)}</span>
                <span className="countdown-label">{labels.seconds}</span>
            </div>
        </div>
    );
};

export default CountdownTimer;
