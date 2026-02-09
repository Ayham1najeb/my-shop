import React, { useContext, useState, useEffect } from 'react';
import { ProductContext } from './ProductContext';
import API_URL from './apiConfig';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaStickyNote, FaCheckCircle, FaTrashAlt, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useLanguage } from './LanguageContext';
import './Checkout.css';

const SyriaCities = [
    { ar: 'دمشق', en: 'Damascus' },
    { ar: 'حلب', en: 'Aleppo' },
    { ar: 'حمص', en: 'Homs' },
    { ar: 'حماة', en: 'Hama' },
    { ar: 'اللاذقية', en: 'Latakia' },
    { ar: 'طرطوس', en: 'Tartus' },
    { ar: 'إدلب', en: 'Idlib' },
    { ar: 'دير الزور', en: 'Deir ez-Zor' },
    { ar: 'الرقة', en: 'Raqqa' },
    { ar: 'الحسكة', en: 'Al-Hasakah' },
    { ar: 'القامشلي', en: 'Qamishli' },
    { ar: 'السويداء', en: 'Suwayda' },
    { ar: 'درعا', en: 'Daraa' },
    { ar: 'القنيطرة', en: 'Quneitra' },
    { ar: 'ريف دمشق', en: 'Rif Dimashq' }
];

const bankLogos = {
    'Visa': "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
    'Mastercard': "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    'American Express': "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg",
    'Ziraat Bank': "https://www.google.com/s2/favicons?domain=ziraatbank.com.tr&sz=128",
    'Kuveyt Turk': "https://www.google.com/s2/favicons?domain=kuveytturk.com.tr&sz=128",
    'Qatar National Bank (QNB)': "https://www.google.com/s2/favicons?domain=qnb.com&sz=128"
};

const Checkout = () => {
    const { cart, clearCart } = useContext(ProductContext);
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    // State
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

    // Modal State
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        city: '',
        street_address: '',
        zip_code: '',
        country: 'Syria',
        is_default: false
    });

    // Card State
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: '',
        cardType: 'Visa' // Default
    });
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);

    // Fetch Addresses on Mount
    useEffect(() => {
        const fetchAddresses = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) return;

            try {
                const response = await fetch(`${API_URL}/api/addresses`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setAddresses(data);
                    const defaultAddr = data.find(a => a.is_default) || data[0];
                    if (defaultAddr) setSelectedAddressId(defaultAddr.id);
                }
            } catch (error) {
                console.error('Failed to fetch addresses', error);
            } finally {
                setIsLoadingAddresses(false);
            }
        };

        fetchAddresses();
    }, [navigate]);

    // Totals
    const subtotal = cart.reduce((acc, item) => {
        const price = Number(item.price);
        const discount = Number(item.discount || 0);
        const finalPrice = discount ? price - discount : price;
        return acc + finalPrice * Number(item.quantity);
    }, 0);
    const shippingCost = 10.00;
    const total = subtotal + shippingCost;

    // Handlers
    const handleSaveAddress = async (e) => {
        e.preventDefault();
        if (isSavingAddress) return;

        setIsSavingAddress(true);
        const token = localStorage.getItem('auth_token');
        const url = editingAddressId
            ? `${API_URL}/api/addresses/${editingAddressId}`
            : `${API_URL}/api/addresses`;
        const method = editingAddressId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newAddress)
            });

            if (response.ok) {
                const savedAddress = await response.json();
                if (editingAddressId) {
                    setAddresses(addresses.map(a => a.id === editingAddressId ? savedAddress : a));
                } else {
                    setAddresses([...addresses, savedAddress]);
                    setSelectedAddressId(savedAddress.id);
                }

                setIsAddressModalOpen(false);
                setEditingAddressId(null);
                setNewAddress({ first_name: '', last_name: '', phone: '', city: '', street_address: '', zip_code: '', country: 'Syria', is_default: false });

                Swal.fire({
                    title: language === 'ar' ? 'تم الحفظ' : 'Saved',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    title: language === 'ar' ? 'خطأ' : 'Error',
                    text: errorData.message || (language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Failed to save address'),
                    icon: 'error'
                });
            }
        } catch (error) {
            console.error('Error saving address', error);
        } finally {
            setIsSavingAddress(false);
        }
    };

    const handleEditAddress = (addr, e) => {
        e.stopPropagation();
        setEditingAddressId(addr.id);
        setNewAddress({
            first_name: addr.first_name,
            last_name: addr.last_name,
            phone: addr.phone,
            city: addr.city,
            street_address: addr.street_address,
            zip_code: addr.zip_code || '',
            country: addr.country || 'Syria',
            is_default: addr.is_default || false
        });
        setIsAddressModalOpen(true);
    };

    const handleDeleteAddress = async (id, e) => {
        e.stopPropagation(); // Don't select the address when deleting

        const result = await Swal.fire({
            title: language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?',
            text: language === 'ar' ? 'سيتم حذف هذا العنوان نهائياً' : 'This address will be permanently deleted',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#aaa',
            confirmButtonText: language === 'ar' ? 'نعم، احذف' : 'Yes, delete',
            cancelButtonText: language === 'ar' ? 'إلغاء' : 'Cancel'
        });

        if (result.isConfirmed) {
            const token = localStorage.getItem('auth_token');
            try {
                const response = await fetch(`${API_URL}/api/addresses/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    setAddresses(addresses.filter(a => a.id !== id));
                    if (selectedAddressId === id) setSelectedAddressId(null);
                    Swal.fire(language === 'ar' ? 'تم الحذف!' : 'Deleted!', '', 'success');
                }
            } catch (error) {
                console.error('Delete error', error);
            }
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            Swal.fire({
                title: language === 'ar' ? 'تنبيه' : 'Notice',
                text: language === 'ar' ? 'يرجى اختيار عنوان توصيل' : 'Please select an address',
                icon: 'warning',
                confirmButtonText: language === 'ar' ? 'حسناً' : 'OK',
                confirmButtonColor: '#3BA3D9'
            });
            return;
        }

        // Validate Card Details if method is card
        if (paymentMethod === 'card') {
            if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardName) {
                Swal.fire({
                    title: language === 'ar' ? 'بيانات ناقصة' : 'Missing Info',
                    text: language === 'ar' ? 'يرجى إكمال بيانات البطاقة' : 'Please complete card details',
                    icon: 'warning',
                    confirmButtonText: language === 'ar' ? 'حسناً' : 'OK',
                    confirmButtonColor: '#3BA3D9'
                });
                return;
            }
        }

        setIsSubmitting(true);

        // Simulate Payment Processing
        if (paymentMethod === 'card') {
            setIsProcessingPayment(true);
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
            setIsProcessingPayment(false);
        }

        const token = localStorage.getItem('auth_token');

        const orderPayload = {
            address_id: selectedAddressId,
            payment_method: paymentMethod,
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                color: item.color,
                size: item.size
            }))
        };

        try {
            const response = await fetch(`${API_URL}/api/checkout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(orderPayload)
            });

            if (response.ok) {
                const data = await response.json();
                clearCart();
                Swal.fire({
                    title: language === 'ar' ? 'تم بنجاح!' : 'Success!',
                    text: language === 'ar' ? 'تم إنشاء طلبك بنجاح' : 'Your order has been placed successfully',
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false,
                    timerProgressBar: true
                });
                setTimeout(() => navigate('/orders'), 3000);
            } else {
                const err = await response.json();
                Swal.fire({
                    title: language === 'ar' ? 'فشل الطلب' : 'Order Failed',
                    text: err.message || (language === 'ar' ? 'حدث خطأ أثناء معالجة طلبك' : 'Something went wrong'),
                    icon: 'error',
                    confirmButtonText: language === 'ar' ? 'حسناً' : 'OK',
                    confirmButtonColor: '#ef4444'
                });
            }
        } catch (error) {
            console.error('Order error', error);
            Swal.fire({
                title: language === 'ar' ? 'خطأ' : 'Error',
                text: language === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred',
                icon: 'error',
                confirmButtonText: language === 'ar' ? 'حسناً' : 'OK'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="empty-checkout">
                    <h2>{t('cart_empty')}</h2>
                    <p>{t('checkout_empty_desc') || (language === 'ar' ? 'لا توجد منتجات لإتمام الطلب' : 'No items to checkout')}</p>
                    <button className="back-to-shop-btn" onClick={() => navigate('/products')}>
                        {t('continue_shopping')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>

            {/* Steps & Breadcrumb */}
            <div className="checkout-steps">
                <div className="step completed"><div className="step-icon"><FaCheckCircle /></div><span>{t('cart_title')}</span></div>
                <div className="step-line active"></div>
                <div className="step active"><div className="step-icon">2</div><span>{t('checkout')}</span></div>
                <div className="step-line"></div>
                <div className="step"><div className="step-icon">3</div><span>{t('place_order')}</span></div>
            </div>

            <div className="checkout-container">
                {/* RIGHT: Order Summary (Sticky) */}
                <div className="checkout-summary">
                    <h3 className="summary-header">{t('order_summary')}</h3>
                    <div className="summary-items">
                        {cart.map((item) => {
                            const finalPrice = Number(item.discount ? item.price - item.discount : item.price);
                            return (
                                <div key={item.id} className="summary-item">
                                    <img src={item.image} alt={item.title} className="summary-item-img" />
                                    <div className="summary-item-details">
                                        <h4>{item.title}</h4>
                                        <p>{item.quantity} x ${finalPrice.toFixed(2)}</p>
                                    </div>
                                    <div className="summary-item-price">${(finalPrice * item.quantity).toFixed(2)}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="summary-totals">
                        <div className="summary-row"><span>{t('subtotal')}</span><span>${subtotal.toFixed(2)}</span></div>
                        <div className="summary-row"><span>{t('shipping')}</span><span>${shippingCost.toFixed(2)}</span></div>
                        <div className="summary-total"><span>{t('total')}</span><span>${total.toFixed(2)}</span></div>

                        <button
                            className="submit-order-btn"
                            onClick={handlePlaceOrder}
                            disabled={isSubmitting || !selectedAddressId}
                            style={{ marginTop: '20px', width: '100%' }}
                        >
                            {isSubmitting
                                ? (isProcessingPayment ? (language === 'ar' ? 'جاري الدفع...' : 'Processing Payment...') : t('processing'))
                                : (paymentMethod === 'card' ? (language === 'ar' ? `دفع $${total.toFixed(2)}` : `Pay $${total.toFixed(2)}`) : `${t('place_order')} ($${total.toFixed(2)})`)
                            }
                        </button>
                    </div>
                </div>

                {/* LEFT: Forms (Address & Payment) */}
                <div className="checkout-form-wrapper">

                    {/* 1. Address Section */}
                    <div className="form-header">
                        <h2 className="checkout-title">{t('shipping_address') || (language === 'ar' ? 'عنوان الشحن' : 'Shipping Address')}</h2>
                        <p className="checkout-subtitle">{t('select_address_desc') || (language === 'ar' ? 'اختر عنوان التوصيل' : 'Select where you want your order delivered')}</p>
                    </div>

                    <div className="address-grid">
                        {!localStorage.getItem('auth_token') && (
                            <div className="auth-required-notice" style={{ gridColumn: '1 / -1', padding: '20px', background: '#fff5f5', border: '2px dashed #feb2b2', borderRadius: '16px', textAlign: 'center', marginBottom: '10px' }}>
                                <p style={{ color: '#c53030', fontWeight: '800', fontSize: '18px', margin: '0 0 10px 0' }}>
                                    {language === 'ar' ? '⚠️ يلزم تسجيل الدخول للمتابعة' : '⚠️ Login Required to Continue'}
                                </p>
                                <button
                                    onClick={() => navigate('/login?redirect=checkout')}
                                    style={{
                                        background: 'linear-gradient(135deg, #c53030 0%, #9b2222 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 35px',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontWeight: '800',
                                        fontSize: '16px',
                                        boxShadow: '0 4px 12px rgba(197, 48, 48, 0.2)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {language === 'ar' ? 'تسجيل الدخول للمتابعة' : 'Login to Continue'}
                                </button>
                            </div>
                        )}
                        {addresses.map(addr => (
                            <div
                                key={addr.id}
                                className={`address-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                                onClick={() => setSelectedAddressId(addr.id)}
                            >
                                <div className="address-card-header">
                                    <span className="address-type">{addr.type || 'Shipping'}</span>
                                    <div className="address-check-container">
                                        <button
                                            className="edit-address-mini-btn"
                                            onClick={(e) => handleEditAddress(addr, e)}
                                            title={language === 'ar' ? 'تعديل' : 'Edit'}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="delete-address-mini-btn"
                                            onClick={(e) => handleDeleteAddress(addr.id, e)}
                                            title={language === 'ar' ? 'حذف' : 'Delete'}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                        <FaCheckCircle className="address-check" />
                                    </div>
                                </div>
                                <div className="address-details">
                                    <h4>{addr.first_name} {addr.last_name}</h4>
                                    <p>{addr.city}, {addr.street_address}</p>
                                    <p>{addr.phone}</p>
                                </div>
                            </div>
                        ))}

                        {/* Add Address Button */}
                        <div className="add-address-card" onClick={() => { setEditingAddressId(null); setNewAddress({ first_name: '', last_name: '', phone: '', city: '', street_address: '', zip_code: '', country: 'Syria', is_default: false }); setIsAddressModalOpen(true); }}>
                            <div className="add-address-icon">+</div>
                            <span className="add-address-text">{t('add_new_address') || (language === 'ar' ? 'إضافة عنوان جديد' : 'Add New Address')}</span>
                        </div>
                    </div>

                    {/* 2. Payment Section */}
                    <div className="form-header" style={{ marginTop: '40px' }}>
                        <h2 className="checkout-title">{t('payment_method') || (language === 'ar' ? 'طريقة الدفع' : 'Payment Method')}</h2>
                    </div>

                    <div className="payment-methods">
                        <div
                            className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('cod')}
                        >
                            <FaStickyNote className="payment-icon" />
                            <span className="checkout-method-label">{t('cod') || (language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery')}</span>
                        </div>
                        <div
                            className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('card')}
                        >
                            <FaCheckCircle className="payment-icon" />
                            <span className="checkout-method-label">{language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card'}</span>
                        </div>
                    </div>

                    {/* Credit Card Form (Conditional) */}
                    {paymentMethod === 'card' && (
                        <div className="credit-card-form fade-in" style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div className="form-group">
                                <label>{language === 'ar' ? 'نوع البطاقة / البنك' : 'Card Type / Bank'}</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <select
                                        value={cardDetails.cardType}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cardType: e.target.value })}
                                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white' }}
                                    >
                                        <option value="Visa">Visa</option>
                                        <option value="Mastercard">Mastercard</option>
                                        <option value="American Express">American Express</option>
                                        <option value="Ziraat Bank">Ziraat Bankası</option>
                                        <option value="Kuveyt Turk">Kuveyt Türk</option>
                                        <option value="Qatar National Bank (QNB)">Qatar National Bank (QNB)</option>
                                    </select>
                                    {/* Bank Logo Preview */}
                                    <div className="bank-logo-preview" style={{ width: '60px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #eee', borderRadius: '6px', overflow: 'hidden' }}>
                                        {bankLogos[cardDetails.cardType] ? (
                                            <img
                                                src={bankLogos[cardDetails.cardType]}
                                                alt={cardDetails.cardType}
                                                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <FaCheckCircle style={{ color: '#aaa', fontSize: '20px' }} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card Visual */}
                            <div className="card-visual" style={{
                                margin: '20px 0',
                                padding: '20px',
                                borderRadius: '15px',
                                background: cardDetails.cardType === 'Ziraat Bank' ? 'linear-gradient(135deg, #e30a17 0%, #b30000 100%)' :
                                    cardDetails.cardType === 'Kuveyt Turk' ? 'linear-gradient(135deg, #005a3c 0%, #00402b 100%)' :
                                        cardDetails.cardType === 'Qatar National Bank (QNB)' ? 'linear-gradient(135deg, #8A1538 0%, #5e0d24 100%)' :
                                            cardDetails.cardType === 'Visa' || cardDetails.cardType === 'Mastercard' ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' :
                                                'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                                color: 'white',
                                position: 'relative',
                                height: '200px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', opacity: 0.9, textTransform: 'uppercase' }}>
                                        {cardDetails.cardType || 'Bank Name'}
                                    </div>
                                    <div style={{ width: '60px', height: '35px', background: 'rgba(255,255,255,0.95)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                                        {bankLogos[cardDetails.cardType] && (
                                            <img
                                                src={bankLogos[cardDetails.cardType]}
                                                alt="Logo"
                                                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div style={{ fontSize: '22px', letterSpacing: '2px', textAlign: 'center', fontFamily: 'monospace', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                                    {cardDetails.cardNumber || '0000 0000 0000 0000'}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '14px' }}>
                                    <div>
                                        <div style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase' }}>Card Holder</div>
                                        <div style={{ textTransform: 'uppercase', fontWeight: '500' }}>{cardDetails.cardName || 'YOUR NAME'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase' }}>Expires</div>
                                        <div style={{ fontWeight: '500' }}>{cardDetails.expiryDate || 'MM/YY'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Supported Banks Icons */}
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                                {[
                                    { name: 'Visa', src: bankLogos['Visa'] },
                                    { name: 'Mastercard', src: bankLogos['Mastercard'] },
                                    { name: 'American Express', src: bankLogos['American Express'] },
                                    { name: 'Ziraat Bank', src: bankLogos['Ziraat Bank'] },
                                    { name: 'Kuveyt Turk', src: bankLogos['Kuveyt Turk'] },
                                    { name: 'Qatar National Bank (QNB)', src: bankLogos['Qatar National Bank (QNB)'] }
                                ].map((bank, i) => (
                                    <img
                                        key={i}
                                        src={bank.src}
                                        alt={bank.name}
                                        title={bank.name}
                                        style={{ width: '40px', height: '25px', objectFit: 'contain', opacity: 0.8 }}
                                    />
                                ))}
                            </div>

                            <div className="form-group">
                                <label>{language === 'ar' ? 'اسم حامل البطاقة' : 'Card Holder Name'}</label>
                                <input
                                    type="text"
                                    placeholder="ex. JOHN DOE"
                                    value={cardDetails.cardName}
                                    onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>{language === 'ar' ? 'رقم البطاقة' : 'Card Number'}</label>
                                <input
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    maxLength="19"
                                    value={cardDetails.cardNumber}
                                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                />
                            </div>
                            <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>{language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        value={cardDetails.expiryDate}
                                        onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>CVV</label>
                                    <input
                                        type="password"
                                        placeholder="123"
                                        maxLength="3"
                                        value={cardDetails.cvv}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Add Address Modal */}
            {isAddressModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">{editingAddressId ? (language === 'ar' ? 'تعديل العنوان' : 'Edit Address') : t('add_new_address')}</h3>
                            <button className="close-modal-btn" onClick={() => { setIsAddressModalOpen(false); setEditingAddressId(null); }}>✕</button>
                        </div>
                        <form onSubmit={handleSaveAddress}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>{t('first_name')}</label>
                                    <input required value={newAddress.first_name} onChange={e => setNewAddress({ ...newAddress, first_name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>{t('last_name')}</label>
                                    <input required value={newAddress.last_name} onChange={e => setNewAddress({ ...newAddress, last_name: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>{t('phone')}</label>
                                <input required type="tel" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>{t('city')}</label>
                                    <select
                                        required
                                        value={newAddress.city}
                                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                        className="form-select"
                                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e1e4e8', fontSize: '16px', background: '#fdfdfd' }}
                                    >
                                        <option value="">{language === 'ar' ? '-- اختر المدينة --' : '-- Select City --'}</option>
                                        {SyriaCities.map(city => (
                                            <option key={city.en} value={city.ar}>
                                                {language === 'ar' ? city.ar : city.en}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{t('street') || 'Street'}</label>
                                    <input required value={newAddress.street_address} onChange={e => setNewAddress({ ...newAddress, street_address: e.target.value })} />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsAddressModalOpen(false)}>{t('cancel')}</button>
                                <button type="submit" className="save-btn" disabled={isSavingAddress}>
                                    {isSavingAddress ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (t('save_address') || 'Save Address')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Checkout;
