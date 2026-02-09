import React, { useState, useEffect } from "react";
import API_URL from "../apiConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle, FaSpinner, FaEnvelopeOpenText } from "react-icons/fa";
import { useLanguage } from "../LanguageContext";
import "./Auth.css";

const VerifyEmail = () => {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { language } = useLanguage();

    // Redirect if not logged in (we need the token to verify)
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (code.length !== 6) {
            setError(language === 'ar' ? 'يرجى إدخال 6 أرقام' : 'Please enter 6 digits');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`${API_URL}/api/email/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ code })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || (language === 'ar' ? 'رمز غير صحيح' : 'Invalid code'));
            }

            setMessage(
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <FaCheckCircle />
                    {language === 'ar' ? 'تم تفعيل الحساب! يرجى تسجيل الدخول' : 'Account verified! Please login'}
                </div>
            );

            // CRITICAL: Clear all session data so the user MUST login manually
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_info");
            window.dispatchEvent(new Event('authChange'));

            setTimeout(() => navigate("/login"), 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError("");
        setMessage("");

        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`${API_URL}/api/email/resend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to resend');
            }

            setMessage(language === 'ar' ? 'تم إعادة إرسال الرمز بنجاح' : 'Verification code resent successfully');
        } catch (err) {
            setError(err.message);
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="auth-page verify-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="auth-form-section">
                <div className="auth-form-container">
                    <div className="verify-icon-wrapper">
                        <FaEnvelopeOpenText className="verify-icon" />
                    </div>

                    <div className="form-header">
                        <h2>{language === 'ar' ? 'تأكيد الحساب' : 'Verify Account'}</h2>
                        <p className="verify-subtitle">
                            {language === 'ar'
                                ? 'لقد أرسلنا رمزاً مكوناً من 6 أرقام إلى بريدك الإلكتروني'
                                : 'We have sent a 6-digit code to your email address'}
                        </p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}
                    {message && <div className="auth-success">{message}</div>}

                    <form onSubmit={handleVerify} className="auth-form">
                        <div className="input-group">
                            <input
                                type="text"
                                className="otp-input"
                                placeholder="000000"
                                maxLength="6"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                                required
                                autoFocus
                            />
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? (
                                <FaSpinner className="spinner" />
                            ) : (
                                language === 'ar' ? 'تأكيد الآن' : 'Verify Now'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {language === 'ar' ? 'لم يصلك الرمز؟' : "Didn't receive the code?"}
                            <button
                                onClick={handleResend}
                                className="resend-btn"
                                disabled={resending}
                                style={{ background: 'none', border: 'none', color: '#0ea5e9', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }}
                            >
                                {resending ? '...' : (language === 'ar' ? 'إعادة إرسال' : 'Resend')}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
