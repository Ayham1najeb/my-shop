import React, { useState } from 'react';
import { FaSave, FaLock, FaEnvelope } from 'react-icons/fa';
import Swal from 'sweetalert2';
import API_URL from '../../apiConfig';
import './Admin.css';

const Settings = () => {
    const [formData, setFormData] = useState({
        email: 'admin@gmail.com',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            Swal.fire({
                title: 'خطأ',
                text: 'كلمات المرور غير متطابقة',
                icon: 'error',
                confirmButtonText: 'حسناً'
            });
            return;
        }

        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${API_URL}/api/profile/password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    current_password: formData.currentPassword,
                    new_password: formData.newPassword,
                    new_password_confirmation: formData.confirmPassword
                })
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    title: 'تم بنجاح!',
                    text: 'تم تغيير كلمة المرور للمدير بنجاح ✅',
                    icon: 'success',
                    confirmButtonText: 'ممتاز',
                    timer: 3000
                });
                setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                Swal.fire({
                    title: 'خطأ',
                    text: data.message || 'كلمة المرور الحالية غير صحيحة',
                    icon: 'error',
                    confirmButtonText: 'محاولة مرة أخرى'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'خطأ اتصال',
                text: 'فشل الاتصال بالسيرفر، تأكد من تشغيل الباك إند',
                icon: 'error',
                confirmButtonText: 'إغلاق'
            });
        }
    };

    return (
        <div className="admin-page-container">
            <h1>إعدادات المسؤول</h1>

            <form onSubmit={handleSubmit} className="admin-form full-width-form">
                <div className="form-section">
                    <h3>أمان الحساب</h3>

                    <div className="form-group">
                        <label>البريد الإلكتروني للمسؤول</label>
                        <div className="input-with-icon">
                            <FaEnvelope className="field-icon" />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>كلمة المرور الحالية</label>
                        <div className="input-with-icon">
                            <FaLock className="field-icon" />
                            <input
                                name="currentPassword"
                                type="password"
                                placeholder="••••••••"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>كلمة المرور الجديدة</label>
                            <input
                                name="newPassword"
                                type="password"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>تأكيد كلمة المرور الجديدة</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn-primary">
                    <FaSave /> حفظ التغييرات الإدارية
                </button>
            </form>
        </div>
    );
};

export default Settings;
