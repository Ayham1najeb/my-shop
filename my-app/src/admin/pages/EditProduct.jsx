import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUpload, FaPlus, FaTrash, FaSave, FaImage, FaLayerGroup, FaTimes } from 'react-icons/fa';
import API_URL from '../../apiConfig';
import './Admin.css';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [helpers, setHelpers] = useState({ categories: [], brands: [], colors: [], sizes: [] });

    const [product, setProduct] = useState({
        title_ar: '',
        title_en: '',
        description_ar: '',
        description_en: '',
        price: '',
        category_id: '',
        brand_id: '',
        is_active: 1,
        is_featured: 0,
        images: [], // New file uploads
    });

    const [existingImages, setExistingImages] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);
    const [variants, setVariants] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('auth_token');
            try {
                // Fetch helpers
                const helpersRes = await fetch(`${API_URL}/api/admin/products/form-data`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const helpersData = await helpersRes.json();
                setHelpers(helpersData);

                // Fetch product data
                const productRes = await fetch(`${API_URL}/api/admin/products/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const productData = await productRes.json();

                if (productRes.ok) {
                    setProduct({
                        title_ar: productData.title_ar,
                        title_en: productData.title_en,
                        description_ar: productData.description_ar,
                        description_en: productData.description_en,
                        price: productData.price,
                        category_id: productData.category_id,
                        brand_id: productData.brand_id || '',
                        is_active: productData.is_active,
                        is_featured: productData.is_featured,
                        images: []
                    });
                    setExistingImages(productData.images || []);
                    setVariants(productData.variants.map(v => ({
                        color_id: v.color_id || '',
                        size_id: v.size_id || '',
                        stock_quantity: v.stock_quantity,
                        price_adjustment: v.price_adjustment,
                        sku: v.sku
                    })));
                } else {
                    alert('فشل في تحميل بيانات المنتج');
                    navigate('/admin/products');
                }
            } catch (err) {
                console.error("Failed to load data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct({ ...product, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setProduct({ ...product, images: [...product.images, ...files] });
    };

    const handleRemoveNewImage = (index) => {
        const newImages = [...product.images];
        newImages.splice(index, 1);
        setProduct({ ...product, images: newImages });
    };

    const handleRemoveExistingImage = (imageId) => {
        setExistingImages(existingImages.filter(img => img.id !== imageId));
        setDeletedImageIds([...deletedImageIds, imageId]);
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
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData();
        formData.append('_method', 'PUT'); // For Laravel to recognize as PUT/PATCH while sending FormData

        Object.keys(product).forEach(key => {
            if (key !== 'images') {
                formData.append(key, product[key]);
            }
        });

        product.images.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        formData.append('deleted_images', JSON.stringify(deletedImageIds));
        formData.append('variants', JSON.stringify(variants));

        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
                method: "POST", // Using POST with _method=PUT because FormData often fails with real PUT in Laravel/PHP
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert("تم تحديث المنتج بنجاح!");
                navigate('/admin/products');
            } else {
                const data = await res.json();
                alert("خطأ: " + JSON.stringify(data.errors || data.message));
            }
        } catch (err) {
            alert("فشل في التحديث");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="admin-loading">جاري تحميل بيانات المنتج...</div>;

    return (
        <div className="dashboard-home">
            <div className="dashboard-header-flex">
                <div className="header-title">
                    <h1>تعديل المنتج: {product.title_ar}</h1>
                    <p className="subtitle">قم بتحديث معلومات المنتج وخياراته</p>
                </div>
                <div className="header-actions">
                    <button className="btn-refresh" onClick={() => navigate('/admin/products')}>إلغاء</button>
                    <button onClick={handleSubmit} className="btn-primary-sm" disabled={saving}>
                        {saving ? 'جاري الحفظ...' : <><FaSave /> حفظ التغييرات</>}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="admin-grid-layout">
                <div className="admin-main-col">
                    <div className="card">
                        <div className="card-header"><h3>المعلومات الأساسية</h3></div>
                        <div className="card-body">
                            <div className="input-group">
                                <label>الاسم (بالعربي)</label>
                                <input name="title_ar" value={product.title_ar} onChange={handleInputChange} required />
                            </div>
                            <div className="input-group">
                                <label>الاسم (بالإنجليزي)</label>
                                <input name="title_en" value={product.title_en} onChange={handleInputChange} required />
                            </div>
                            <div className="input-group">
                                <label>الوصف (بالعربي)</label>
                                <textarea name="description_ar" value={product.description_ar} rows="4" onChange={handleInputChange}></textarea>
                            </div>
                            <div className="input-group">
                                <label>الوصف (بالإنجليزي)</label>
                                <textarea name="description_en" value={product.description_en} rows="4" onChange={handleInputChange}></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header"><h3><FaImage /> الصور</h3></div>
                        <div className="card-body">
                            <div className="existing-images-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                                {existingImages.map(img => (
                                    <div key={img.id} className="image-preview-card" style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                        <img
                                            src={img.image_path.startsWith('http') ? img.image_path : `${API_URL}/storage/${img.image_path}`}
                                            alt="product"
                                            style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                                        />
                                        <button type="button" className="remove-img-overlay" onClick={() => handleRemoveExistingImage(img.id)}>
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="image-upload-area">
                                <FaUpload size={24} color="#6366f1" />
                                <p>رفع صور جديدة</p>
                                <input type="file" multiple onChange={handleImageUpload} accept="image/*" />
                            </div>

                            <div className="preview-grid" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                                {product.images.map((file, i) => (
                                    <div key={i} className="image-preview-card" style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#e0e7ff' }}>
                                        <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                                        <button type="button" className="remove-img-overlay" onClick={() => handleRemoveNewImage(i)}>
                                            <FaTrash size={12} />
                                        </button>
                                        <div style={{ position: 'absolute', top: 0, left: 0, background: '#4338ca', color: 'white', fontSize: '8px', padding: '2px 5px' }}>جديد</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header"><h3><FaLayerGroup /> الخيارات (المقاييس والألوان)</h3></div>
                        <div className="card-body">
                            <div className="variants-list">
                                {variants.map((variant, index) => (
                                    <div key={index} className="variant-row-card" style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <div style={{ flex: 1, minWidth: '150px' }}>
                                            <label>اللون</label>
                                            <select value={variant.color_id} onChange={(e) => handleVariantChange(index, 'color_id', e.target.value)}>
                                                <option value="">اختر</option>
                                                {helpers.colors.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
                                            </select>
                                        </div>
                                        <div style={{ flex: 1, minWidth: '150px' }}>
                                            <label>المقاس</label>
                                            <select value={variant.size_id} onChange={(e) => handleVariantChange(index, 'size_id', e.target.value)}>
                                                <option value="">اختر</option>
                                                {helpers.sizes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div style={{ width: '100px' }}>
                                            <label>الكمية</label>
                                            <input type="number" value={variant.stock_quantity} onChange={(e) => handleVariantChange(index, 'stock_quantity', e.target.value)} />
                                        </div>
                                        <button type="button" onClick={() => removeVariant(index)} className="btn-icon delete"><FaTrash /></button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addVariant} className="btn-secondary" style={{ width: '100%', marginTop: '10px' }}>
                                <FaPlus /> إضافة متغير جديد
                            </button>
                        </div>
                    </div>
                </div>

                <aside className="admin-sidebar-col">
                    <div className="card">
                        <div className="card-header"><h3>الحالة والتصنيف</h3></div>
                        <div className="card-body">
                            <div className="input-group">
                                <label>التصنيف</label>
                                <select name="category_id" value={product.category_id} onChange={handleInputChange} required>
                                    <option value="">-- اختر --</option>
                                    {helpers.categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
                                </select>
                            </div>
                            <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                <input type="checkbox" name="is_active" checked={product.is_active === 1} onChange={handleInputChange} />
                                <label style={{ margin: 0 }}>منتج نشط (يظهر في المتجر)</label>
                            </div>
                            <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                <input type="checkbox" name="is_featured" checked={product.is_featured === 1} onChange={handleInputChange} />
                                <label style={{ margin: 0 }}>منتج مميز</label>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header"><h3>السعر</h3></div>
                        <div className="card-body">
                            <div className="input-group">
                                <label>السعر الأساسي ($)</label>
                                <input name="price" type="number" step="0.01" value={product.price} onChange={handleInputChange} required />
                            </div>
                        </div>
                    </div>
                </aside>
            </form>
        </div>
    );
};

export default EditProduct;
