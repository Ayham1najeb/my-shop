import React, { useState } from "react";
// import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
// import { auth } from "../firebase/config";
import API_URL from "../apiConfig";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaSpinner } from "react-icons/fa";
import { useLanguage } from "../LanguageContext";
import "./Auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(language === 'ar' ? 'كلمة المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError(language === 'ar' ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 chars');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          phone, // Phone from state
          password,
          password_confirmation: confirmPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors).flat()[0];
          throw new Error(firstError || (language === 'ar' ? 'حدث خطأ ما' : 'Something went wrong'));
        }
        throw new Error(data.message || (language === 'ar' ? 'حدث خطأ ما' : 'Something went wrong'));
      }

      // Success - Store only the token for the Verification stage
      // We do NOT set user_info or dispatch authChange so the site stays in "Guest" mode
      localStorage.setItem("auth_token", data.data.token);

      // Clear any old user_info to be safe
      localStorage.removeItem("user_info");

      navigate("/verify-email");

    } catch (err) {
      setLoading(false);
      // Detailed error translation for common cases
      const msg = err.message;
      if (msg.includes('email has already been taken')) {
        setError(language === 'ar' ? 'هذا البريد الإلكتروني مسجل بالفعل' : 'Email already taken');
      } else if (msg.includes('phone has already been taken')) {
        setError(language === 'ar' ? 'رقم الهاتف مسجل بالفعل' : 'Phone already taken');
      } else {
        setError(msg);
      }
    }
  };

  return (
    <div className="auth-page register-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Left Side - Form */}
      <div className="auth-form-section">
        <div className="auth-form-container large-form">
          <div className="form-header">
            <h2>{language === 'ar' ? 'إنشاء حساب' : 'Create Account'}</h2>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleRegister} className="auth-form">
            <div className="input-group">
              <label>{language === 'ar' ? 'الاسم' : 'Name'}</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'اسمك الكامل' : 'Your full name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label>{language === 'ar' ? 'البريد' : 'Email'}</label>
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
              <label>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="tel"
                  placeholder="+963 912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
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

            <div className="input-group">
              <label>{language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {language === 'ar' ? 'إنشاء حساب' : 'Create Account'}
                  <FaArrowRight className="btn-arrow" />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {language === 'ar' ? 'لديك حساب؟' : 'Already have an account?'}
              <Link to="/login" className="auth-link">
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="auth-branding register-branding">
        <div className="branding-content">
          <div className="brand-logo">
            <span>MYSHOP</span>
          </div>
          <h1 className="brand-headline">
            {language === 'ar' ? 'انضم إلينا!' : 'Join Us!'}
          </h1>
          <p className="brand-subtext">
            {language === 'ar'
              ? 'أنشئ حسابك واحصل على عروض حصرية'
              : 'Create your account and get exclusive offers'}
          </p>
        </div>
        <div className="branding-decoration">
          <div className="deco-circle deco-1"></div>
          <div className="deco-circle deco-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
