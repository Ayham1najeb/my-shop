import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaDownload, FaHome } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    if (!order) {
        return (
            <div className="confirmation-page">
                <div className="empty-confirmation">
                    <h2>لا توجد معلومات طلب</h2>
                    <button className="back-home-btn" onClick={() => navigate('/')}>
                        العودة للرئيسية
                    </button>
                </div>
            </div>
        );
    }

    const downloadPDF = async () => {
        try {
            const element = document.querySelector('.confirmation-container');

            // Hide action buttons before capturing
            const actionsElement = document.querySelector('.confirmation-actions');
            const promptElement = document.querySelector('.create-account-prompt');

            if (actionsElement) actionsElement.style.display = 'none';
            if (promptElement) promptElement.style.display = 'none';

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                allowTaint: true,
                logging: false
            });

            // Show buttons again
            if (actionsElement) actionsElement.style.display = 'flex';
            if (promptElement) promptElement.style.display = 'block';

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`invoice-${order.id}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('حدث خطأ أثناء تحميل الفاتورة');
        }
    };

    return (
        <div className="confirmation-page">
            <div className="confirmation-container">
                {/* Success Header */}
                <div className="success-header">
                    <div className="success-checkmark-container">
                        <svg className="checkmark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                    </div>
                    <div className="success-text-content">
                        <h1 className="animated-title">شكراً لك! تم تأكيد طلبك</h1>
                        <p className="animated-subtitle">سيصلك فريق التوصيل قريباً، شكراً لثقتك بنا</p>
                    </div>
                </div>

                {/* Order Details */}
                <div className="order-details-card">
                    <div className="order-header">
                        <h2>تفاصيل الطلب</h2>
                        <div className="order-id">رقم الطلب: {order.id}</div>
                    </div>

                    <div className="order-info-section">
                        <h3>معلومات العميل</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">الاسم:</span>
                                <span className="info-value">{order.customer.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">البريد:</span>
                                <span className="info-value">{order.customer.email}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">الهاتف:</span>
                                <span className="info-value">{order.customer.phone}</span>
                            </div>
                            <div className="info-item full-width">
                                <span className="info-label">العنوان:</span>
                                <span className="info-value">{order.customer.address}</span>
                            </div>
                            {order.customer.notes && (
                                <div className="info-item full-width">
                                    <span className="info-label">ملاحظات:</span>
                                    <span className="info-value">{order.customer.notes}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="order-items-section">
                        <h3>المنتجات المطلوبة</h3>
                        <div className="order-items-list">
                            {order.items.map((item) => {
                                const finalPrice = Number(item.discount ? item.price - item.discount : item.price);
                                const lineTotal = finalPrice * item.quantity;

                                return (
                                    <div key={item.id} className="order-item">
                                        <img src={item.image} alt={item.title} className="order-item-img" />
                                        <div className="order-item-details">
                                            <h4>{item.title}</h4>
                                            <p>الكمية: {item.quantity} × $ {finalPrice.toFixed(2)}</p>
                                        </div>
                                        <div className="order-item-total">$ {lineTotal.toFixed(2)}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="order-total-row">
                            <span>الإجمالي</span>
                            <span className="total-amount">$ {order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Create Account Prompt - Clean & Simple */}
                <div className="create-account-prompt">
                    <h3>استمتع بمزايا الحساب المجاني</h3>
                    <p className="prompt-description">
                        تتبع طلباتك • احفظ عناوينك • احصل على عروض حصرية
                    </p>

                    <button className="create-account-btn" onClick={() => navigate('/register')}>
                        إنشاء حساب مجاني
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="confirmation-actions">
                    <button className="continue-shopping-btn" onClick={() => navigate('/')}>
                        <FaHome /> الرجوع للرئيسية
                    </button>
                    <button className="download-pdf-btn" onClick={downloadPDF}>
                        <FaDownload /> تنزيل الفاتورة PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
