import React from 'react';
import './PrivacyPolicy.css'; // Reusing the same attractive styles
import { FaFileContract, FaGavel, FaHandshake, FaBan, FaCheckCircle } from 'react-icons/fa';

const TermsAndConditions = () => {
    return (
        <div className="privacy-page" dir="rtl">
            {/* Hero Section */}
            <div className="privacy-hero">
                <div className="privacy-hero-content">
                    <FaFileContract className="hero-icon" />
                    <h1>الشروط والأحكام</h1>
                    <p>أهلاً بك في MyShop. يرجى قراءة هذه الشروط بعناية قبل استخدام الموقع.</p>
                </div>
            </div>

            <div className="privacy-container">

                {/* Introduction Card */}
                <div className="privacy-card intro-card">
                    <div className="card-icon-wrapper">
                        <FaHandshake />
                    </div>
                    <h2>اتفاقية الاستخدام</h2>
                    <p>
                        بوصولك واستخدامك لموقع <strong>MyShop</strong>، فإنك توافق على الالتزام بجميع البنود والشروط المذكورة هنا. تهدف هذه الشروط لضمان حقوق الجميع وتنظيم عملية البيع والشراء بشكل قانوني وآمن.
                    </p>
                </div>

                {/* Section 1: Usage */}
                <div className="privacy-section">
                    <div className="section-header">
                        <h3>شروط الاستخدام</h3>
                    </div>
                    <p>يجب عليك الالتزام بالمعايير التالية عند استخدام الموقع:</p>
                    <ul className="privacy-list">
                        <li>يجب أن يكون عمرك 18 عاماً أو أكثر، أو تملك موافقة ولي الأمر.</li>
                        <li>يمنع استخدام الموقع لأي أغراض غير قانونية أو غير مصرح بها.</li>
                        <li>المحافظة على سرية معلومات حسابك وكلمة المرور مسؤوليتك الشخصية.</li>
                    </ul>
                </div>

                {/* Section 2: Orders & Payments */}
                <div className="privacy-section highlight-bg">
                    <div className="section-header">
                        <FaCheckCircle className="section-icon" />
                        <h3>الطلبات والدفع</h3>
                    </div>
                    <p>
                        نحتفظ بالحق في رفض أو إلغاء أي طلب لأي سبب، بما في ذلك عدم توفر المنتج أو أخطاء في التسعير. يجب سداد كامل المبلغ المستحق عند إتمام الطلب عبر وسائل الدفع المعتمدة لدينا (فيزا، ماستركارد، باي بال، الدفع عند الاستلام).
                    </p>
                </div>

                {/* Section 3: Prohibited Actions */}
                <div className="privacy-section">
                    <div className="section-header">
                        <FaBan className="section-icon" />
                        <h3>المحظورات</h3>
                    </div>
                    <p>
                        يمنع منعاً باتاً:
                    </p>
                    <ul className="privacy-list">
                        <li>نسخ أو توزيع محتوى الموقع (صور، نصوص) دون إذن مسبق.</li>
                        <li>محاولة اختراق الموقع أو التسبب بضرر لبرمجياته.</li>
                        <li>استخدام الموقع لإرسال رسائل مزعجة (سبام) أو فيروسات.</li>
                    </ul>
                </div>

                {/* Legal */}
                <div className="privacy-section">
                    <div className="section-header">
                        <FaGavel className="section-icon" />
                        <h3>القانون الواجب التطبيق</h3>
                    </div>
                    <p>
                        تخضع هذه الشروط والأحكام وتفسر وفقاً لقوانين المملكة العربية السعودية (أو دولتك). أي نزاع ينشأ فيما يتعلق بهذه الشروط يخضع للاختصاص القضائي للمحاكم المختصة.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default TermsAndConditions;
