import { FaSearch, FaUserCircle, FaBars } from 'react-icons/fa';
import '../pages/Admin.css';

const TopBar = ({ onMenuClick }) => {
    return (
        <div className="admin-topbar">
            <div className="topbar-left">
                <button className="menu-toggle-btn" onClick={onMenuClick}>
                    <FaBars />
                </button>
            </div>

            <div className="topbar-right">
                <div className="profile-menu">
                    <div className="avatar-wrapper">
                        <img src="https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff&bold=true" alt="Admin" />
                    </div>
                    <div className="profile-details user-info-hide">
                        <span className="name">المدير العام</span>
                        <span className="role">مسؤول النظام</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
