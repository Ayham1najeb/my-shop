import React, { useState, useEffect } from 'react';
import './AdminOrders.css';
import { FaEye, FaBoxOpen } from 'react-icons/fa';
import API_URL from '../../apiConfig';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_URL}/api/admin/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setOrders(data.data || []); // Access 'data' property for paginated response
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!selectedOrder) return;
        setUpdatingStatus(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_URL}/api/admin/orders/${selectedOrder.id}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                const updatedOrder = await response.json();

                // Update list
                setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));

                // Update modal view
                setSelectedOrder(updatedOrder);

                alert('تم تحديث حالة الطلب بنجاح');
            } else {
                alert('حدث خطأ أثناء التحديث');
            }
        } catch (error) {
            console.error('Update status error:', error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) return <div className="admin-loading">جاري تحميل الطلبات...</div>;

    return (
        <div className="admin-orders-page" dir="rtl">
            <div className="page-header">
                <h2>إدارة الطلبات</h2>
            </div>

            <div className="admin-table-wrapper">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>رقم الطلب</th>
                            <th>العميل</th>
                            <th>التاريخ</th>
                            <th>المبلغ الإجمالي</th>
                            <th>الحالة</th>
                            <th>طريقة الدفع</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>لا توجد طلبات حتى الآن</td>
                            </tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order.id}>
                                    <td className="order-id">#{order.order_number}</td>
                                    <td>{order.shipping_address_json?.first_name} {order.shipping_address_json?.last_name}</td>
                                    <td>{new Date(order.created_at).toLocaleDateString('ar-EG')}</td>
                                    <td>${Number(order.total).toFixed(2)}</td>
                                    <td>
                                        <span className={`status-badge ${order.status}`}>
                                            {order.status === 'pending' && 'قيد الانتظار'}
                                            {order.status === 'processing' && 'جاري التجهيز'}
                                            {order.status === 'shipped' && 'تم الشحن'}
                                            {order.status === 'delivered' && 'تم التوصيل'}
                                            {order.status === 'cancelled' && 'ملغي'}
                                        </span>
                                    </td>
                                    <td>{order.payment_method === 'cod' ? 'عند الاستلام' : 'بطاقة ائتمان'}</td>
                                    <td>
                                        <button className="view-btn" onClick={() => handleViewOrder(order)}>
                                            <FaEye /> تفاصيل
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {isModalOpen && selectedOrder && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>تفاصيل الطلب #{selectedOrder.order_number}</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>

                        <div className="modal-body">
                            <div className="order-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <h4>معلومات العميل</h4>
                                    <p><strong>الاسم:</strong> {selectedOrder.shipping_address_json?.first_name} {selectedOrder.shipping_address_json?.last_name}</p>
                                    <p><strong>الهاتف:</strong> {selectedOrder.shipping_address_json?.phone}</p>
                                    <p><strong>العنوان:</strong> {selectedOrder.shipping_address_json?.city}، {selectedOrder.shipping_address_json?.street_address}</p>
                                </div>
                                <div>
                                    <h4>ملخص الطلب</h4>
                                    <p><strong>تاريخ الطلب:</strong> {new Date(selectedOrder.created_at).toLocaleString('ar-EG')}</p>
                                    <p><strong>الإجمالي:</strong> ${Number(selectedOrder.total).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="order-items-list">
                                <h4 style={{ padding: '10px', background: '#f8fafc', margin: 0 }}>المنتجات ({selectedOrder.items?.length})</h4>
                                {selectedOrder.items && selectedOrder.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{item.product_name}</div>
                                            <div style={{ fontSize: '13px', color: '#64748b' }}>
                                                {item.color && `اللون: ${item.color}`} {item.size && ` - القياس: ${item.size}`}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'left' }}>
                                            <div>x{item.quantity}</div>
                                            <div style={{ fontWeight: 'bold' }}>${Number(item.total).toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="update-status-section">
                                <label>تحديث الحالة:</label>
                                <select
                                    className="status-select"
                                    value={selectedOrder.status}
                                    onChange={(e) => handleUpdateStatus(e.target.value)}
                                    disabled={updatingStatus}
                                >
                                    <option value="pending">قيد الانتظار (Pending)</option>
                                    <option value="processing">جاري التجهيز (Processing)</option>
                                    <option value="shipped">تم الشحن (Shipped)</option>
                                    <option value="delivered">تم التوصيل (Delivered)</option>
                                    <option value="cancelled">ملغي (Cancelled)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
