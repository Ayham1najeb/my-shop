import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaSignOutAlt, FaPlus, FaLock, FaStar, FaClipboardList } from 'react-icons/fa';
import TopBar from './TopBar';
import '../pages/Admin.css';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        window.dispatchEvent(new Event('authChange'));
        navigate('/login');
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="admin-layout">
            {/* Mobile Backdrop */}
            {sidebarOpen && <div className="admin-backdrop" onClick={closeSidebar}></div>}

            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>لوحة التحكم</h2>
                    {/* Close button for mobile inside sidebar if needed, or just let backdrop handle it */}
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} onClick={closeSidebar}>
                        <FaHome /> <span>الرئيسية</span>
                    </NavLink>
                    <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} onClick={closeSidebar}>
                        <FaClipboardList /> <span>الطلبات</span>
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} onClick={closeSidebar}>
                        <FaUsers /> <span>المستخدمين</span>
                    </NavLink>
                    <NavLink to="/admin/products/create" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} onClick={closeSidebar}>
                        <FaPlus /> <span>إضافة منتج</span>
                    </NavLink>
                    <NavLink to="/admin/reviews" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} onClick={closeSidebar}>
                        <FaStar /> <span>التقييمات</span>
                    </NavLink>
                    <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} onClick={closeSidebar}>
                        <FaLock /> <span>الإعدادات</span>
                    </NavLink>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <FaSignOutAlt /> <span>تسجيل خروج</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="main-wrapper">
                <TopBar onMenuClick={toggleSidebar} />
                <main className="admin-content">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
