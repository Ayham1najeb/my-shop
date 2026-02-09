```javascript
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaShoppingBag
} from 'react-icons/fa';
import { useLanguage } from '../LanguageContext';
import { ProductContext } from '../ProductContext';
import API_URL from '../apiConfig';
import './Profile.css';

const Profile = () => {
    const { language } = useLanguage();
    const { wishlist } = useContext(ProductContext);
    const navigate = useNavigate();

    // --- State ---
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user_info');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(() => !localStorage.getItem('user_info'));
    const [message, setMessage] = useState({ type: '', text: '' });
    const [myOrders, setMyOrders] = useState([]);

    // Form States
    const [formData, setFormData] = useState({
        displayName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        image: null
    });

    const [passData, setPassData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    const [previewImage, setPreviewImage] = useState(user?.profile_image_url || null);

    // --- Effects ---
    useEffect(() => {
        const fetchProfileAndOrders = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Fetch Profile
                const profileRes = await fetch(`${ API_URL } /api/profile`, {
                    headers: { "Authorization": `Bearer ${ token } `, "Accept": "application/json" }
                });

                if (profileRes.ok) {
                    const data = await profileRes.json();
                    setUser(data.data);
                    localStorage.setItem('user_info', JSON.stringify(data.data));
                    setFormData(prev => ({ ...prev, displayName: data.data.name, email: data.data.email, phone: data.data.phone || '' }));
                    if (data.data.profile_image_url) setPreviewImage(data.data.profile_image_url);
                }

                // Fetch Orders
                const ordersRes = await fetch(`${ API_URL } /api/orders`, {
                    headers: { "Authorization": `Bearer ${ token } `, "Accept": "application/json" }
                });

                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setMyOrders(ordersData);
                }

            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndOrders();
    }, [navigate]);

    // --- Handlers ---
    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        navigate('/login');
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            try {
                const token = localStorage.getItem('auth_token');
                const formDataToSend = new FormData();
                formDataToSend.append('image', file);
                formDataToSend.append('name', user?.name || formData.displayName);
                formDataToSend.append('phone', user?.phone || formData.phone);

                const response = await fetch(`${ API_URL } /api/profile / update`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${ token } `, "Accept": "application/json" },
                    body: formDataToSend
                });

                const data = await response.json();

                if (response.ok) {
                    setUser(data.data);
                    localStorage.setItem('user_info', JSON.stringify(data.data));
                    window.dispatchEvent(new Event('authChange'));
                    if (data.data.profile_image_url) setPreviewImage(data.data.profile_image_url);
                    showMessage('success', language === 'ar' ? 'تم تحديث الصورة بنجاح' : 'Image updated successfully');
                } else {
                    showMessage('error', data.message || 'Image upload failed');
                }
            } catch (error) {
                console.error("Upload error", error);
                showMessage('error', 'Upload failed');
            }
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth_token');
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.displayName);
            formDataToSend.append('phone', formData.phone);
            if (formData.image) formDataToSend.append('image', formData.image);

            const response = await fetch("http://127.0.0.1:8000/api/profile/update", {
                method: "POST",
                headers: { "Authorization": `Bearer ${ token } `, "Accept": "application/json" },
                body: formDataToSend
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data.data);
                localStorage.setItem('user_info', JSON.stringify(data.data));
                window.dispatchEvent(new Event('authChange'));
                if (data.data.profile_image_url) setPreviewImage(data.data.profile_image_url);
                showMessage('success', language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
            } else {
                throw new Error(data.message || 'Update failed');
            }
        } catch (error) {
            showMessage('error', error.message);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch("http://127.0.0.1:8000/api/profile/password", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${ token } `,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(passData)
            });

            const data = await response.json();
            if (response.ok) {
                showMessage('success', language === 'ar' ? 'تم تغيير كلمة المرور' : 'Password changed successfully');
                setPassData({ current_password: '', new_password: '', new_password_confirmation: '' });
            } else {
                throw new Error(data.message || 'Failed');
            }
        } catch (error) {
            showMessage('error', error.message);
        }
    };

    // --- Render Helpers ---
    if (loading) return <div className="loading-spinner">Loading...</div>;

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="tab-content fade-in">
                        <h2 className="tab-title">{language === 'ar' ? 'نظرة عامة' : 'Overview'}</h2>
                        <div className="stats-grid">
                            <div className="stat-card premium-card">
                                <div className="stat-icon-wrapper blue">
                                    <FaShoppingBag />
                                </div>
                                <div className="stat-info">
                                    <h3>{myOrders.length}</h3>
                                    <p>{language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</p>
                                </div>
                            </div>
                            <div className="stat-card premium-card">
                                <div className="stat-icon-wrapper red">
                                    <FaHeart />
                                </div>
                                <div className="stat-info">
                                    <h3>{wishlist.length}</h3>
                                    <p>{language === 'ar' ? 'المفضلة' : 'Wishlist Items'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="recent-activity premium-card">
                            <h3>{language === 'ar' ? 'معلومات سريعة' : 'Quick Info'}</h3>
                            <div className="info-row">
                                <span className="label"><FaUser /> {language === 'ar' ? 'الاسم' : 'Name'}</span>
                                <span className="value">{user?.name}</span>
                            </div>
                            <div className="info-row">
                                <span className="label"><FaEnvelope /> {language === 'ar' ? 'البريد' : 'Email'}</span>
                                <span className="value">{user?.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="label"><FaPhone /> {language === 'ar' ? 'الهاتف' : 'Phone'}</span>
                                <span className="value">{user?.phone || (language === 'ar' ? 'غير محدد' : 'Not set')}</span>
                            </div>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="tab-content fade-in">
                        <h2 className="tab-title">{language === 'ar' ? 'طلباتي' : 'My Orders'}</h2>
                        <div className="orders-list">
                            {myOrders.length === 0 ? (
                                <div className="empty-orders-container premium-card">
                                    <FaBoxOpen size={80} className="empty-icon" />
                                    <h2>{language === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}</h2>
                                    <p>{language === 'ar' ? 'ابدأ رحلة التسوق الخاصة بك الآن واكتشف أفضل العروض.' : 'Start your shopping journey now and discover the best deals.'}</p>
                                    <Link to="/products" className="start-shopping-btn">
                                        {language === 'ar' ? 'ابدأ التسوق' : 'Start Shopping'}
                                    </Link>
                                </div>
                            ) : (
                                myOrders.map(order => (
                                    <div key={order.id} className="order-card premium-card">
                                        <div className="order-header">
                                            <div>
                                                <span className="order-number">#{order.order_number}</span>
                                                <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <span className={`order - status status - ${ order.status } `}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="order-body">
                                            <div className="order-items-preview">
                                                {order.items && order.items.slice(0, 3).map((item, idx) => (
                                                    <span key={item.id} className="item-name">
                                                        {item.product_name} x{item.quantity}
                                                    </span>
                                                ))}
                                                {order.items && order.items.length > 3 && <span>...</span>}
                                            </div>
                                            <div className="order-total">
                                                <span>{language === 'ar' ? 'المجموع' : 'Total'}:</span>
                                                <span className="price">${Number(order.total).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="tab-content fade-in">
                        <h2 className="tab-title">{language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}</h2>
                        <form onSubmit={handleUpdateProfile} className="premium-form premium-card">
                            <div className="form-group">
                                <label>{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                                <div className="input-with-icon">
                                    <FaUser />
                                    <input
                                        type="text"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                                <div className="input-with-icon">
                                    <FaPhone />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+963..."
                                    />
                                </div>
                            </div>
                            <button type="submit" className="save-btn-primary">
                                <FaSave /> {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                );
            case 'security':
                return (
                    <div className="tab-content fade-in">
                        <h2 className="tab-title">{language === 'ar' ? 'الأمان وكلمة المرور' : 'Security'}</h2>
                        <form onSubmit={handleUpdatePassword} className="premium-form premium-card">
                            <div className="form-group">
                                <label>{language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}</label>
                                <div className="input-with-icon">
                                    <FaKey />
                                    <input
                                        type="password"
                                        value={passData.current_password}
                                        onChange={(e) => setPassData({ ...passData, current_password: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>{language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                                <div className="input-with-icon">
                                    <FaKey />
                                    <input
                                        type="password"
                                        value={passData.new_password}
                                        onChange={(e) => setPassData({ ...passData, new_password: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>{language === 'ar' ? 'تأكيد الجديدة' : 'Confirm New'}</label>
                                <div className="input-with-icon">
                                    <FaKey />
                                    <input
                                        type="password"
                                        value={passData.new_password_confirmation}
                                        onChange={(e) => setPassData({ ...passData, new_password_confirmation: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="save-btn-primary">
                                <FaSave /> {language === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="profile-dashboard-layout" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="dashboard-container">
                {/* Sidebar */}
                <aside className="dashboard-sidebar premium-card">
                    <div className="user-profile-summary">
                        <div className="profile-avatar-large">
                            {previewImage ? (
                                <img src={previewImage} alt="Profile" />
                            ) : (
                                <div className="avatar-placeholder">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                            <label className="camera-btn">
                                <FaCamera />
                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                        <h3>{user?.name}</h3>
                        <p className="user-email">{user?.email}</p>
                    </div>

                    <nav className="dashboard-nav">
                        <button
                            className={`nav - item ${ activeTab === 'overview' ? 'active' : '' } `}
                            onClick={() => setActiveTab('overview')}
                        >
                            <FaBoxOpen /> {language === 'ar' ? 'نظرة عامة' : 'Overview'}
                        </button>
                        <button
                            className={`nav - item ${ activeTab === 'orders' ? 'active' : '' } `}
                            onClick={() => setActiveTab('orders')}
                        >
                            <FaShoppingBag /> {language === 'ar' ? 'طلباتي' : 'My Orders'}
                        </button>
                        <button
                            className={`nav - item ${ activeTab === 'settings' ? 'active' : '' } `}
                            onClick={() => setActiveTab('settings')}
                        >
                            <FaEdit /> {language === 'ar' ? 'تعديل البيانات' : 'Edit Profile'}
                        </button>
                        <button
                            className={`nav - item ${ activeTab === 'security' ? 'active' : '' } `}
                            onClick={() => setActiveTab('security')}
                        >
                            <FaKey /> {language === 'ar' ? 'الأمان' : 'Security'}
                        </button>
                        <Link to="/wishlist" className="nav-item">
                            <FaHeart /> {language === 'ar' ? 'المفضلة' : 'Wishlist'}
                        </Link>
                        <button className="nav-item logout" onClick={handleLogout}>
                            <FaSignOutAlt /> {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="dashboard-content">
                    {message.text && (
                        <div className={`notification - toast ${ message.type } `}>
                            {message.text}
                        </div>
                    )}
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default Profile;
