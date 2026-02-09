import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaUserCircle, FaChevronDown, FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaHeart, FaRegHeart } from 'react-icons/fa';
import { ProductContext } from "./ProductContext";
import { useLanguage } from './LanguageContext'; // Import the new hook
import './NavBar.css';
import LanguageSelector from './components/LanguageSelector';
import API_URL from './apiConfig';
import './Notifications.css';
import { FaBell, FaCheckDouble, FaTrashAlt, FaInfoCircle, FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

const NavBar = () => {
  const { cart, searchTerm, setSearchTerm, clearSessionData } = useContext(ProductContext);
  const { language, changeLanguage, t } = useLanguage(); // Use global context
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [click, setClick] = useState(false);
  const { wishlist } = useContext(ProductContext); // Access wishlist for count/icon

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Toggle Hamburger Menu
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  // Check Auth State
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userInfo = localStorage.getItem('user_info');
      if (token && userInfo) {
        setUser(JSON.parse(userInfo));
      } else {
        setUser(null);
      }
    };

    checkAuth();
    // Listen for login/logout events
    window.addEventListener('authChange', checkAuth);

    // Clear search term when going back to home
    if (location.pathname === '/') {
      setSearchTerm('');
    }

    return () => window.removeEventListener('authChange', checkAuth);
  }, [location.pathname]); // Add location.pathname to dependency array

  // Fetch Notifications
  const fetchNotifications = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setNotifications(data.data);
        setUnreadCount(data.data.filter(n => !n.is_read).length);
      }
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); // Poll every minute
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const markAsRead = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
      await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      await fetch(`${API_URL}/api/notifications/read-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      closeMobileMenu();
    }
  };

  const handleLogout = async () => {
    // Call API logout if needed, otherwise just clear local storage
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await fetch(`${API_URL}/api/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
      } catch (e) {
        console.error("Logout failed", e);
      }
    }

    // Clear all context data (wishlist, cart, orders)
    clearSessionData();

    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
    setShowLogoutMenu(false);
    closeMobileMenu();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-menu-container") &&
        !e.target.closest(".auth-menu-container") &&
        !e.target.closest(".notifications-container")) {
        setShowLoginMenu(false);
        setShowLogoutMenu(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sticky Navbar Logic
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on screen resize (if it exceeds mobile breakpoint)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setClick(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* 1. Scrolling Top Bar - Green */}
      <div className="scrolling-bar">
        <div className="scrolling-content">
          <span className="scroll-item">خصومات تصل لغاية 50% على جميع المنتجات</span>
          <span className="scroll-item">شحن مجاني للطلبات فوق 200 دولار</span>
          <span className="scroll-item">عروض حصرية لفترة محدودة</span>
          {/* Duplicate for seamless loop */}
          <span className="scroll-item">خصومات تصل لغاية 50% على جميع المنتجات</span>
          <span className="scroll-item">شحن مجاني للطلبات فوق 200 دولار</span>
          <span className="scroll-item">عروض حصرية لفترة محدودة</span>
        </div>
      </div>

      {/* Placeholder to prevent jump */}
      <div style={{ height: isSticky ? '130px' : '0' }}></div>

      <div className={`sticky-wrapper ${isSticky ? 'sticky-active' : ''}`}>
        {/* 2. Main Header - White (Logo, Search, Actions) */}
        <div className="main-header">
          <div className="container header-container">

            {/* Logo */}
            <Link to="/" onClick={closeMobileMenu} className="header-logo">
              <h2>MYSHOP</h2>
            </Link>

            {/* Language Selector (Moved here) */}
            <div className="header-lang">
              <LanguageSelector currentLang={language} onLanguageChange={changeLanguage} />
            </div>

            {/* Search Bar - Centered */}
            <div className="header-search">
              <form onSubmit={handleSearch}>
                <button type="submit" className="search-btn">
                  <FaSearch />
                </button>
                <input
                  type="text"
                  placeholder={t('search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>

            {/* Actions: Login, Cart, Wishlist */}
            <div className="header-actions">

              {/* Wishlist Link */}
              <Link to="/wishlist" className="action-item wishlist-action" onClick={closeMobileMenu}>
                <div className={`icon-btn-wrapper wishlist-wrapper ${wishlist.length > 0 ? 'active' : ''}`}>
                  {wishlist.length > 0 ? <FaHeart className="action-icon filled" /> : <FaRegHeart className="action-icon" />}
                </div>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="action-item cart-action" onClick={closeMobileMenu}>
                <div className="cart-icon-wrapper">
                  <FaShoppingCart />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </div>
              </Link>

              {/* Notifications */}
              {user && (
                <div className="action-item notifications-container">
                  <div
                    className={`notification-bell-wrapper ${showNotifications ? 'active' : ''}`}
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowLoginMenu(false);
                      setShowLogoutMenu(false);
                    }}
                  >
                    <FaBell />
                    {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                  </div>

                  {showNotifications && (
                    <div className="notifications-dropdown">
                      <div className="notif-header">
                        <h3>{language === 'ar' ? 'التنبيهات' : 'Notifications'}</h3>
                        {unreadCount > 0 && (
                          <button className="mark-all-btn" onClick={markAllRead}>
                            <FaCheckDouble style={{ marginLeft: language === 'ar' ? '5px' : '0', marginRight: language === 'en' ? '5px' : '0' }} />
                            {language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}
                          </button>
                        )}
                      </div>
                      <div className="notif-list">
                        {notifications.length > 0 ? (
                          notifications.map(notif => (
                            <div
                              key={notif.id}
                              className={`notif-item ${!notif.is_read ? 'unread' : ''}`}
                              onClick={() => !notif.is_read && markAsRead(notif.id)}
                            >
                              <div className={`notif-icon-box ${notif.type || 'info'}`}>
                                {notif.type === 'success' && <FaCheckCircle />}
                                {notif.type === 'warning' && <FaExclamationCircle />}
                                {notif.type === 'error' && <FaTimesCircle />}
                                {(notif.type === 'info' || !notif.type) && <FaInfoCircle />}
                              </div>
                              <div className="notif-content">
                                <span className="notif-title">{notif.title}</span>
                                <span className="notif-message">{notif.message}</span>
                                <span className="notif-time">{new Date(notif.created_at).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="notif-empty">
                            <FaBell className="notif-empty-icon" />
                            <p>{language === 'ar' ? 'لا توجد تنبيهات حالياً' : 'No notifications yet'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Login / User */}
              <div className="action-item auth-action">
                {user ? (
                  <div className="user-menu-container">
                    <div className="user-trigger-btn" onClick={() => setShowLogoutMenu(!showLogoutMenu)}>
                      {user.profile_image || user.profile_image_url ? (
                        <img
                          src={user.profile_image_url || `${API_URL}/storage/${user.profile_image}`}
                          alt="Profile"
                          className="user-avatar-img"
                        />
                      ) : (
                        <div className="user-avatar-placeholder">
                          <FaUserCircle />
                        </div>
                      )}
                    </div>

                    {showLogoutMenu && (
                      <div className="dropdown-menu">
                        <div className="menu-header" style={{ padding: '10px', borderBottom: '1px solid #eee', marginBottom: '5px' }}>
                          <strong>{user.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>{user.email}</div>
                        </div>
                        <Link to="/profile" className="auth-dropdown-item" onClick={() => setShowLogoutMenu(false)}>
                          {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
                        </Link>
                        <Link to="/orders" className="auth-dropdown-item" onClick={() => setShowLogoutMenu(false)}>
                          {language === 'ar' ? 'طلباتي' : 'My Orders'}
                        </Link>
                        <Link to="/wishlist" className="auth-dropdown-item" onClick={() => setShowLogoutMenu(false)}>
                          {language === 'ar' ? 'المفضلة' : 'Wishlist'}
                        </Link>
                        {/* Admin Dashboard Link */}
                        {(user.role === 'admin' || user.email === 'admin@gmail.com') && (
                          <Link to="/admin/dashboard" className="auth-dropdown-item" onClick={() => setShowLogoutMenu(false)} style={{ color: '#ef4444', fontWeight: 'bold' }}>
                            {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                          </Link>
                        )}
                        <button onClick={handleLogout} className="logout-btn">
                          {t('logout') || (language === 'ar' ? 'خروج' : 'Logout')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="auth-menu-container">
                    <div className="auth-trigger" onClick={() => setShowLoginMenu(!showLoginMenu)}>
                      <FaUserCircle className="auth-icon" />
                      <span>{t('login')}</span>
                      <FaChevronDown className="chevron-icon" />
                    </div>

                    {showLoginMenu && (
                      <div className="auth-dropdown">
                        <Link to="/login" className="auth-dropdown-item" onClick={() => { setShowLoginMenu(false); closeMobileMenu(); }}>
                          {t('login')}
                        </Link>
                        <Link to="/register" className="auth-dropdown-item" onClick={() => { setShowLoginMenu(false); closeMobileMenu(); }}>
                          {t('register')}
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 5. Mobile Toggle - Moved to Far Right */}
            <div className="mobile-toggle" onClick={handleClick}>
              {click ? <FaTimes /> : <FaBars />}
            </div>

          </div>
        </div>

        {/* 3. Bottom Navigation - Links */}
        <div className={`bottom-nav ${click ? 'active' : ''}`}>
          <div className="container">
            <div className="mobile-nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>{t('menu') || 'Menu'}</h3>
              <div onClick={closeMobileMenu} style={{ padding: '8px', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>
                <FaTimes />
              </div>
            </div>
            <ul className="nav-menu">
              <li>
                <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/products" className={`nav-item ${location.pathname === '/products' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className={`nav-item ${location.pathname === '/categories' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  {t('categories')}
                </Link>
              </li>
              <li>
                <Link to="/about" className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      <div className={`nav-backdrop ${click ? 'active' : ''}`} onClick={closeMobileMenu}></div>
    </>
  );
};

export default NavBar;
