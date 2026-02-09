import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProductContext } from './ProductContext';
import { FaCreditCard, FaPaypal, FaLock, FaCheckCircle } from 'react-icons/fa';
import './Payment.css';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { placeOrder } = useContext(ProductContext);
    const { order } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    });
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    if (!order) {
        return (
            <div className="payment-page">
                <div className="empty-payment">
                    <h2>لا توجد معلومات طلب</h2>
                    <button className="back-home-btn" onClick={() => navigate('/')}>
                        العودة للرئيسية
                    </button>
                </div>
            </div>
        );
    }

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cardNumber') {
            formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            if (formattedValue.length > 19) return;
        }

        if (name === 'expiryDate') {
            formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length >= 2) {
                formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
            }
            if (formattedValue.length > 5) return;
        }

        if (name === 'cvv' && value.length > 3) return;

        setCardData({ ...cardData, [name]: formattedValue });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validatePayment = () => {
        if (paymentMethod === 'paypal') return true;

        const newErrors = {};

        if (!cardData.cardNumber.replace(/\s/g, '')) {
            newErrors.cardNumber = 'رقم البطاقة مطلوب';
        } else if (cardData.cardNumber.replace(/\s/g, '').length < 16) {
            newErrors.cardNumber = 'رقم البطاقة غير صحيح';
        }

        if (!cardData.cardName.trim()) {
            newErrors.cardName = 'اسم حامل البطاقة مطلوب';
        }

        if (!cardData.expiryDate) {
            newErrors.expiryDate = 'تاريخ الانتهاء مطلوب';
        } else if (cardData.expiryDate.length < 5) {
            newErrors.expiryDate = 'تاريخ غير صحيح';
        }

        if (!cardData.cvv) {
            newErrors.cvv = 'CVV مطلوب';
        } else if (cardData.cvv.length < 3) {
            newErrors.cvv = 'CVV غير صحيح';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = () => {
        if (!validatePayment()) return;

        setIsProcessing(true);

        setTimeout(() => {
            const completeOrder = {
                ...order,
                paymentMethod: paymentMethod,
                paymentStatus: 'pending',
                ...(paymentMethod === 'card' && {
                    cardLast4: cardData.cardNumber.slice(-4)
                })
            };

            placeOrder(completeOrder);
            navigate('/order-confirmation', { state: { order: completeOrder } });
        }, 1500);
    };

    return (
        <div className="payment-page">
            {/* Breadcrumb */}
            <div className="payment-breadcrumb">
                <span className="breadcrumb-link" onClick={() => navigate('/')}>الرئيسية</span>
                <span className="breadcrumb-separator">{'>'}</span>
                <span className="breadcrumb-link" onClick={() => navigate('/cart')}>السلة</span>
                <span className="breadcrumb-separator">{'>'}</span>
                <span className="breadcrumb-link" onClick={() => navigate('/checkout')}>المعلومات</span>
                <span className="breadcrumb-separator">{'>'}</span>
                <span className="breadcrumb-current">الدفع</span>
            </div>

            {/* Progress Steps */}
            <div className="payment-steps">
                <div className="step completed">
                    <div className="step-icon"><FaCheckCircle /></div>
                    <span>السلة</span>
                </div>
                <div className="step-line active"></div>
                <div className="step completed">
                    <div className="step-icon"><FaCheckCircle /></div>
                    <span>معلومات التوصيل</span>
                </div>
                <div className="step-line active"></div>
                <div className="step active">
                    <div className="step-icon">3</div>
                    <span>الدفع</span>
                </div>
            </div>

            <div className="payment-container">
                {/* Payment Methods */}
                <div className="payment-content">
                    <div className="payment-header">
                        <h2>اختر طريقة الدفع</h2>
                        <p>اختر الطريقة الأنسب لك لإتمام الطلب</p>
                    </div>

                    {/* Payment Method Cards */}
                    <div className="payment-methods">
                        <div
                            className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('card')}
                        >
                            <input
                                type="radio"
                                name="payment"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                            />
                            <FaCreditCard className="method-icon" />
                            <div className="method-info">
                                <h3>بطاقة بنكية</h3>
                                <p>Visa, Mastercard, Maestro</p>
                            </div>
                        </div>

                        <div
                            className={`payment-method-card ${paymentMethod === 'paypal' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('paypal')}
                        >
                            <input
                                type="radio"
                                name="payment"
                                value="paypal"
                                checked={paymentMethod === 'paypal'}
                                onChange={() => setPaymentMethod('paypal')}
                            />
                            <FaPaypal className="method-icon paypal" />
                            <div className="method-info">
                                <h3>PayPal</h3>
                                <p>الدفع عبر حساب PayPal</p>
                            </div>
                        </div>
                    </div>

                    {/* Credit Card Form */}
                    {paymentMethod === 'card' && (
                        <div className="card-form">
                            <div className="form-group">
                                <label>رقم البطاقة</label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={cardData.cardNumber}
                                    onChange={handleCardChange}
                                    placeholder="1234 5678 9012 3456"
                                    className={errors.cardNumber ? 'input-error' : ''}
                                />
                                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                            </div>

                            <div className="form-group">
                                <label>اسم حامل البطاقة</label>
                                <input
                                    type="text"
                                    name="cardName"
                                    value={cardData.cardName}
                                    onChange={handleCardChange}
                                    placeholder="الاسم كما هو مكتوب على البطاقة"
                                    className={errors.cardName ? 'input-error' : ''}
                                />
                                {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>تاريخ الانتهاء</label>
                                    <input
                                        type="text"
                                        name="expiryDate"
                                        value={cardData.expiryDate}
                                        onChange={handleCardChange}
                                        placeholder="MM/YY"
                                        className={errors.expiryDate ? 'input-error' : ''}
                                    />
                                    {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                                </div>

                                <div className="form-group">
                                    <label>CVV</label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        value={cardData.cvv}
                                        onChange={handleCardChange}
                                        placeholder="123"
                                        className={errors.cvv ? 'input-error' : ''}
                                    />
                                    {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PayPal Info */}
                    {paymentMethod === 'paypal' && (
                        <div className="paypal-info">
                            <p>سيتم توجيهك إلى PayPal لإتمام عملية الدفع بشكل آمن</p>
                        </div>
                    )}

                    {/* Security Badge */}
                    <div className="security-badge">
                        <FaLock /> <span>جميع المعاملات محمية ومشفرة</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="payment-actions">
                        <button
                            className="pay-btn"
                            onClick={handlePayment}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'جاري المعالجة...' : `إتمام الدفع ($ ${order.total.toFixed(2)})`}
                        </button>
                        <button
                            className="back-btn"
                            onClick={() => navigate('/checkout')}
                        >
                            العودة للمعلومات
                        </button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="payment-summary">
                    <h3>ملخص الطلب</h3>
                    <div className="summary-items">
                        {order.items.map((item) => (
                            <div key={item.id} className="summary-item">
                                <span>{item.title} × {item.quantity}</span>
                                <span>$ {(item.quantity * (item.discount ? item.price - item.discount : item.price)).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="summary-total">
                        <span>الإجمالي</span>
                        <span>$ {order.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
