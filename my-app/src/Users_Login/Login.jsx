import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../apiConfig";
import { FaEnvelope, FaLock, FaArrowRight, FaSpinner } from "react-icons/fa";
import { useLanguage } from "../LanguageContext";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "1"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (language === 'ar' ? 'البريد أو كلمة المرور غير صحيحة' : 'Invalid login details'));
      }

      // Store Token & User Data
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('user_info', JSON.stringify(data.data.user));

      // Quick fix for specific admin email if backend role is missing
      if (email.trim().toLowerCase() === 'admin@gmail.com') {
        data.data.role = 'admin';
        data.data.user.role = 'admin'; // Ensure user object also has role
        localStorage.setItem('user_info', JSON.stringify(data.data.user)); // Update local storage with role
      }

      // Sync Local Wishlist to Server
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (localWishlist.length > 0) {
        try {
          await fetch(`${API_URL}/api/wishlist/sync`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${data.data.token} `,
              "Content-Type": "application/json",
              "Accept": "application/json",
              "ngrok-skip-browser-warning": "1"
            },
            body: JSON.stringify({
              product_ids: localWishlist.map(p => p.id)
            })
          });
        } catch (syncErr) {
          console.error("Wishlist sync failed", syncErr);
        }
      }

      // Dispatch event to update navbar/context if needed
      window.dispatchEvent(new Event('authChange'));

      setLoading(false);

      const isAdmin = data.data.role === 'admin' || email.trim().toLowerCase() === 'admin@gmail.com';
      if (isAdmin) {
        window.location.href = "/admin/dashboard";
        return;
      }

      if (!data.data.is_verified) {
        navigate("/verify-email");
        return;
      }

      window.location.href = "/";
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="auth-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Left Side - Branding */}
      <div className="auth-branding">
        <div className="branding-content">
          <div className="brand-logo">
            <span>MYSHOP</span>
          </div>
          <h1 className="brand-headline">
            {language === 'ar' ? 'مرحباً بعودتك!' : 'Welcome Back!'}
          </h1>
          <p className="brand-subtext">
            {language === 'ar'
              ? 'سجل دخولك واستكشف منتجاتنا الحصرية'
              : 'Sign in and explore our exclusive products'}
          </p>
        </div>
        <div className="branding-decoration">
          <div className="deco-circle deco-1"></div>
          <div className="deco-circle deco-2"></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-form-section">
        <div className="auth-form-container large-form">
          <div className="form-header">
            <h2>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</h2>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label>{language === 'ar' ? 'كلمة المرور' : 'Password'}</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <FaSpinner className="spinner" />
              ) : (
                <>
                  {language === 'ar' ? 'دخول' : 'Sign In'}
                  <FaArrowRight className="btn-arrow" />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}
              <Link to="/register" className="auth-link">
                {language === 'ar' ? 'إنشاء حساب' : 'Create Account'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
