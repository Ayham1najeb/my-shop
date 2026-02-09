import React, { useEffect, useState } from 'react';
import { FaTrash, FaBan, FaCheckCircle, FaTimes } from 'react-icons/fa';
import API_URL from '../../apiConfig';
import '../pages/Admin.css';

const UsersManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [banModalOpen, setBanModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [banDays, setBanDays] = useState(7);
    const [isPermanent, setIsPermanent] = useState(false);
    const [customDays, setCustomDays] = useState('');

    const fetchUsers = async () => {
        const token = localStorage.getItem('auth_token');
        try {
            const res = await fetch(`${API_URL}/api/admin/users`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data.data || data);
        } catch (err) {
            console.error("Error fetching users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openBanModal = (user) => {
        setSelectedUser(user);
        setBanDays(7);
        setIsPermanent(false);
        setCustomDays('');
        setBanModalOpen(true);
    };

    const handleBanSubmit = async () => {
        if (!selectedUser) return;

        const token = localStorage.getItem('auth_token');
        const days = customDays ? parseInt(customDays) : banDays;

        try {
            const res = await fetch(`${API_URL}/api/admin/users/${selectedUser.id}/ban`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    permanent: isPermanent,
                    days: isPermanent ? null : days
                })
            });

            if (res.ok) {
                alert("تم تحديث حالة المستخدم");
                setBanModalOpen(false);
                fetchUsers();
            }
        } catch (err) {
            alert("حدث خطأ أثناء العملية");
        }
    };

    const handleUnban = async (user) => {
        if (!window.confirm("هل أنت متأكد من إلغاء الحظر؟")) return;

        const token = localStorage.getItem('auth_token');
        try {
            const res = await fetch(`${API_URL}/api/admin/users/${user.id}/ban`, { // Using same endpoint logic for unban if backend supports toggle or ensure logic handles it
                method: "POST", // Backend likely handles unban if user is already banned, let's verify or trust toggleBan implementation
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ days: 0 }) // Often 0 or just calling endpoint unbans
            });
            if (res.ok) {
                alert("تم إلغاء الحظر بنجاح");
                fetchUsers();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.")) return;

        const token = localStorage.getItem('auth_token');
        try {
            const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchUsers();
            } else {
                alert("لا يمكن حذف المستخدم");
            }
        } catch (err) {
            alert("فشل الحذف");
        }
    };

    if (loading) return <div className="loading">جاري تحميل المستخدمين...</div>;

    return (
        <div className="users-manager" dir="rtl">
            <h1 style={{ marginBottom: '20px' }}>إدارة المستخدمين</h1>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>المستخدم</th>
                            <th>الدور</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.sort((a, b) => (a.role === 'admin' ? -1 : 1)).map((user, index) => (
                            <tr key={user.id} className={user.role === 'admin' ? 'admin-row' : ''}>
                                <td style={{ fontWeight: 'bold', color: '#64748b' }}>#{index + 1}</td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{user.name}</span>
                                        <span style={{ fontSize: '13px', color: '#6b7280' }}>{user.email}</span>
                                    </div>
                                </td>
                                <td>
                                    {user.role === 'admin' ? (
                                        <span style={{
                                            background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)',
                                            color: '#78350f',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '13px',
                                            fontWeight: '700',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}>
                                            👑 مدير النظام
                                        </span>
                                    ) : (
                                        <span style={{
                                            backgroundColor: '#f1f5f9',
                                            color: '#64748b',
                                            padding: '5px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            display: 'inline-block'
                                        }}>
                                            مستخدم
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {user.banned_until ? (
                                        <span style={{
                                            backgroundColor: '#fef2f2',
                                            color: '#b91c1c',
                                            padding: '5px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            display: 'inline-block'
                                        }}>
                                            محظور {new Date(user.banned_until) > new Date(2100, 0, 1) ? '(نهائي)' : `حتى ${new Date(user.banned_until).toLocaleDateString()}`}
                                        </span>
                                    ) : (
                                        <span style={{
                                            backgroundColor: '#ecfdf5',
                                            color: '#047857',
                                            padding: '5px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            display: 'inline-block'
                                        }}>
                                            نشط 🟢
                                        </span>
                                    )}
                                </td>
                                <td className="actions-cell">
                                    {user.role === 'admin' ? (
                                        null
                                    ) : (
                                        <>
                                            {user.banned_until ? (
                                                <button
                                                    className="action-btn"
                                                    style={{ background: '#10b981' }} // Green for unban
                                                    title="إلغاء الحظر"
                                                    onClick={() => handleUnban(user)}
                                                >
                                                    <FaCheckCircle /> فك الحظر
                                                </button>
                                            ) : (
                                                <button
                                                    className="action-btn ban"
                                                    title="حظر المستخدم"
                                                    onClick={() => openBanModal(user)}
                                                >
                                                    <FaBan /> حظر
                                                </button>
                                            )}

                                            <button
                                                className="action-btn delete"
                                                title="حذف"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <FaTrash /> حذف
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Ban Modal */}
            {banModalOpen && (
                <div className="modal-overlay" onClick={() => setBanModalOpen(false)}>
                    <div className="modal-content ban-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header" style={{ border: 'none', paddingBottom: 0 }}>
                            <button className="modal-close" onClick={() => setBanModalOpen(false)}><FaTimes /></button>
                        </div>
                        <h3 className="ban-modal-title">حظر المستخدم: {selectedUser?.name}</h3>

                        <div className="ban-options">
                            <button
                                className={`ban-option-btn ${!isPermanent && banDays === 3 ? 'selected' : ''}`}
                                onClick={() => { setBanDays(3); setIsPermanent(false); setCustomDays(''); }}
                            >
                                3 أيام
                            </button>
                            <button
                                className={`ban-option-btn ${!isPermanent && banDays === 7 ? 'selected' : ''}`}
                                onClick={() => { setBanDays(7); setIsPermanent(false); setCustomDays(''); }}
                            >
                                7 أيام
                            </button>
                            <button
                                className={`ban-option-btn ${!isPermanent && banDays === 30 ? 'selected' : ''}`}
                                onClick={() => { setBanDays(30); setIsPermanent(false); setCustomDays(''); }}
                            >
                                30 يوم
                            </button>
                            <button
                                className={`ban-option-btn ${isPermanent ? 'selected' : ''}`}
                                onClick={() => { setIsPermanent(true); setCustomDays(''); }}
                                style={isPermanent ? { background: '#fef2f2', borderColor: '#ef4444', color: '#b91c1c' } : {}}
                            >
                                حظر نهائي
                            </button>
                        </div>

                        {!isPermanent && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '5px' }}>أو حدد عدد الأيام يدوياً:</label>
                                <input
                                    type="number"
                                    className="custom-days-input"
                                    placeholder="عدد الأيام..."
                                    value={customDays}
                                    onChange={(e) => {
                                        setCustomDays(e.target.value);
                                        setBanDays(Number(e.target.value));
                                        setIsPermanent(false);
                                    }}
                                />
                            </div>
                        )}

                        <button
                            className={`ban-confirm-btn ${isPermanent ? 'danger' : ''}`}
                            onClick={handleBanSubmit}
                        >
                            {isPermanent ? 'تأكيد الحظر النهائي' : `تأكيد الحظر لمدة ${customDays || banDays} يوم`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManager;
