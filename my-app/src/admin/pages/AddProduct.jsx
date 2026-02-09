import React, { useState, useEffect } from 'react';
import { FaUpload, FaPlus, FaTrash, FaSave, FaImage, FaLayerGroup, FaInfoCircle, FaTimes } from 'react-icons/fa';
import API_URL from '../../apiConfig';
import './Admin.css';

const AddProduct = () => {
    const [loading, setLoading] = useState(false);
    const [helpers, setHelpers] = useState({ categories: [], brands: [], colors: [], sizes: [] });

    // Product State
    // Product State
    const [product, setProduct] = useState({
        title: '',
        description: '',
        price: '',
        category_id: '',
        brand_id: '',
        images: [], // File objects
    });

    // Variants State
    const [variants, setVariants] = useState([
        { color_id: '', size_id: '', stock_quantity: 0, price_adjustment: 0 }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('auth_token');
            try {
                const res = await fetch(`${API_URL} /api/admin / products / form - data`, {
                    headers: { "Authorization": `Bearer ${token} ` }
                });
                const data = await res.json();
                setHelpers(data);
            } catch (err) {
                console.error("Failed to load helpers", err);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setProduct({ ...product, images: [...product.images, ...files] });
    };

    const handleRemoveImage = (index) => {
        const newImages = [...product.images];
        newImages.splice(index, 1);
        setProduct({ ...product, images: newImages });
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { color_id: '', size_id: '', stock_quantity: 0, price_adjustment: 0 }]);
    };

    const removeVariant = (index) => {
        const newVariants = [...variants];
        newVariants.splice(index, 1);
        setVariants(newVariants);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Debugging State
        console.log("Submitting Product State:", product);

        if (!product.title) {
            alert("يرجى إدخال اسم المنتج");
            setLoading(false);
            return;
        }

        const formData = new FormData();

        // Map single fields to dual backend fields
        formData.append('title_en', product.title);
        formData.append('title_ar', product.title);
        formData.append('description_en', product.description);
        formData.append('description_ar', product.description);

        Object.keys(product).forEach(key => {
            if (key !== 'images' && key !== 'title' && key !== 'description') {
                formData.append(key, product[key]);
            }
        });

        // Append Images
        product.images.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        // Append Variants
        formData.append('variants', JSON.stringify(variants));

        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${API_URL} /api/admin / products`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token} ` },
                body: formData
            });
            const data = await res.json();

            if (res.ok) {
                alert("تم إضافة المنتج بنجاح!");
                window.location.reload(); // Quick reset
            } else {
                alert("خطأ: " + JSON.stringify(data.errors || data.message));
            }
        } catch (err) {
            alert("فشل في الإرسال");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page-container">
            <div className="page-header-flex">
                <div style={{ flex: 1 }}>
                    <h1>إضافة منتج جديد</h1>
                    <p style={{ color: '#64748b', marginTop: '5px' }}>أدخل تفاصيل المنتج بدقة لضمان عرض احترافي</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-secondary" onClick={() => window.history.back()} style={{ background: 'white', border: '1px solid #e2e8f0', color: '#64748b', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>إلغاء</button>
                    <button onClick={handleSubmit} className="btn-primary" disabled={loading} style={{ width: 'auto' }}>
                        {loading ? 'جاري الحفظ...' : <><FaSave /> حفظ المنتج</>}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="admin-grid-layout">
                {/* === Right Column: Main Content === */}
                <div className="admin-main-col">
                    {/* Basic Info */}
                    <div className="card">
                        <div className="card-header">
                            <h3>معلومات المنتج</h3>
                        </div>
                        <div className="card-body">
                            <div className="input-group">
                                <label>اسم المنتج (عربي / إنجليزي)</label>
                                <input name="title" value={product.title || ''} placeholder="مثال: Premium Cotton T-Shirt" onChange={handleInputChange} required />
                            </div>

                            <div className="input-group">
                                <label>وصف المنتج</label>
                                <textarea name="description" value={product.description || ''} rows="6" placeholder="أدخل تفاصيل المنتج..." onChange={handleInputChange}></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="card">
                        <div className="card-header">
                            <h3><FaImage style={{ marginLeft: '8px', color: '#6366f1' }} /> الوسائط (صور المنتج)</h3>
                        </div>
                        <div className="card-body">
                            <div className="image-upload-area">
                                <div className="upload-icon-box">
                                    <FaUpload size={24} color="#6366f1" />
                                </div>
                                <p className="upload-text" style={{ fontWeight: 'bold', margin: '10px 0 5px' }}>اسحب الصور وأفلتها هنا</p>
                                <p className="upload-subtext">أو اضغط لاختيار ملفات (PNG, JPG, WebP)</p>
                                <input type="file" multiple onChange={handleImageUpload} accept="image/*" />
                            </div>

                            {product.images.length > 0 && (
                                <div className="preview-grid" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                                    {product.images.map((file, i) => (
                                        <div key={i} className="image-preview-card" style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                            <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                                            <button type="button" className="remove-img-overlay" onClick={() => handleRemoveImage(i)}>
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="card">
                        <div className="card-header">
                            <h3><FaLayerGroup style={{ marginLeft: '8px', color: '#ec4899' }} /> خيارات المنتج (الألوان والمقاسات)</h3>
                        </div>
                        <div className="card-body">
                            <div className="variants-list">
                                {variants.map((variant, index) => (
                                    <div key={index} className="variant-row-card" style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <div style={{ flex: 1, minWidth: '150px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>اللون</label>
                                            <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} onChange={(e) => handleVariantChange(index, 'color_id', e.target.value)} required>
                                                <option value="">اختر</option>
                                                {helpers.colors.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
                                            </select>
                                        </div>
                                        <div style={{ flex: 1, minWidth: '150px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>المقاس</label>
                                            <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} onChange={(e) => handleVariantChange(index, 'size_id', e.target.value)} required>
                                                <option value="">اختر</option>
                                                {helpers.sizes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div style={{ width: '100px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>الكمية</label>
                                            <input type="number" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="0" min="0" onChange={(e) => handleVariantChange(index, 'stock_quantity', e.target.value)} required />
                                        </div>
                                        <button type="button" onClick={() => removeVariant(index)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', marginTop: '18px' }}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addVariant} className="btn-secondary" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px dashed #6366f1', color: '#6366f1', background: '#eef2ff', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>
                                <FaPlus /> إضافة متغير جديد
                            </button>
                        </div>
                    </div>
                </div>

                {/* === Left Column: Sidebar === */}
                <div className="admin-sidebar-col">
                    {/* Organization */}
                    <div className="card">
                        <div className="card-header">
                            <h3>التنظيم</h3>
                        </div>
                        <div className="card-body">
                            <div className="input-group">
                                <label>التصنيف</label>
                                <select name="category_id" value={product.category_id} onChange={handleInputChange} required>
                                    <option value="">-- اختر التصنيف --</option>
                                    {helpers.categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name_ar}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>الماركة</label>
                                <select name="brand_id" value={product.brand_id} onChange={handleInputChange}>
                                    <option value="">-- بدون ماركة --</option>
                                    {helpers.brands.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="card">
                        <div className="card-header">
                            <h3>التسعير</h3>
                        </div>
                        <div className="card-body">
                            <div className="input-group">
                                <label>السعر الأساسي ($)</label>
                                <input name="price" value={product.price} type="number" step="0.01" placeholder="0.00" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }} onChange={handleInputChange} required />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
