import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaImage } from 'react-icons/fa';
import API_URL from '../../apiConfig';
import './Admin.css';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const navigate = useNavigate();

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        try {
            const response = await fetch(`${API_URL}/api/admin/products?page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            const data = await response.json();
            if (response.ok) {
                setProducts(data.data);
                setCurrentPage(data.current_page);
                setLastPage(data.last_page);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

        const token = localStorage.getItem('auth_token');
        try {
            const response = await fetch(`${API_URL}/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (response.ok) {
                setProducts(products.filter(p => p.id !== id));
                alert('تم حذف المنتج بنجاح');
            } else {
                alert('فشل في حذف المنتج');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('حدث خطأ أثناء الحذف');
        }
    };

    const filteredProducts = products.filter(p =>
        p.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.title_en.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-products-page">
            <div className="dashboard-header-flex">
                <div className="header-title">
                    <h1>إدارة المنتجات</h1>
                    <p className="subtitle">عرض وتعديل وحذف المنتجات الحالية</p>
                </div>
                <div className="header-actions">
                    <Link to="/admin/products/create" className="btn-primary-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <FaPlus /> إضافة منتج جديد
                    </Link>
                </div>
            </div>

            <div className="admin-card table-card">
                <div className="table-actions">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="بحث عن منتج..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="admin-loading">جاري التحميل...</div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>الصورة</th>
                                    <th>اسم المنتج (عربي)</th>
                                    <th>السعر</th>
                                    <th>القسم</th>
                                    <th>الحالة</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="product-table-img">
                                                {(() => {
                                                    const imgPath = product.main_image?.image_path || product.images?.[0]?.image_path;
                                                    if (!imgPath) return <div className="img-placeholder"><FaImage /></div>;

                                                    const imgSrc = imgPath.startsWith('http')
                                                        ? imgPath
                                                        : `${API_URL}/storage/${imgPath}`;

                                                    return <img src={imgSrc} alt={product.title_ar} onError={(e) => e.target.src = 'https://via.placeholder.com/50'} />;
                                                })()}
                                            </div>
                                        </td>
                                        <td>{product.title_ar}</td>
                                        <td>${product.price}</td>
                                        <td>{product.category?.name_ar || 'بدون قسم'}</td>
                                        <td>
                                            <span className={`status-badge ${product.is_active ? 'active' : 'inactive'}`}>
                                                {product.is_active ? 'نشط' : 'غير نشط'}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <button
                                                className="btn-icon edit"
                                                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                                title="تعديل"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn-icon delete"
                                                onClick={() => handleDelete(product.id)}
                                                title="حذف"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="pagination">
                    <button
                        className="btn-pagination"
                        disabled={currentPage === 1}
                        onClick={() => fetchProducts(currentPage - 1)}
                    >
                        السابق
                    </button>
                    <span>صفحة {currentPage} من {lastPage}</span>
                    <button
                        className="btn-pagination"
                        disabled={currentPage === lastPage}
                        onClick={() => fetchProducts(currentPage + 1)}
                    >
                        التالي
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageProducts;
