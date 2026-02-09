import React, { useEffect, useState } from 'react';
import { FaUsers, FaBox, FaDollarSign, FaShoppingCart, FaChartPie, FaChartLine, FaArrowUp, FaArrowDown, FaHistory } from 'react-icons/fa';
import API_URL from '../../apiConfig';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell, Tooltip as ReTooltip
} from 'recharts';
import './Admin.css';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        total_users: 0,
        total_products: 0,
        total_orders: 0,
        total_revenue: 0,
        aov: 0,
        conversion_rate: 0,
        recent_users: [],
        top_selling_products: [],
        order_status: [],
        recent_activities: [],
        sales_data: [],
        sales_data: [],
        daily_visits: 0,
        monthly_visits: 0,
        // Comparison
        today_orders: 0,
        yesterday_orders: 0,
        visits_growth: 0,
        orders_growth: 0
    });

    // Mock Data for Demo/Empty State
    const mockSalesData = [
        { name: 'يناير', sales: 4000 },
        { name: 'فبراير', sales: 3000 },
        { name: 'مارس', sales: 2000 },
        { name: 'أبريل', sales: 2780 },
        { name: 'مايو', sales: 1890 },
        { name: 'يونيو', sales: 2390 },
        { name: 'يوليو', sales: 3490 },
    ];

    /* const mockTopProducts = [
        { name: 'تيشيرت قطني', sales: 400 },
        { name: 'حذاء ركض', sales: 300 },
        { name: 'ساعة ذكية', sales: 250 },
        { name: 'بنطال جينز', sales: 200 },
        { name: 'حقيبة ظهر', sales: 150 },
    ]; */

    /* const mockOrderStatus = [
        { name: 'تم التوصيل', value: 45, color: '#10b981' },
        { name: 'قيد التجهيز', value: 25, color: '#f59e0b' },
        { name: 'تم الشحن', value: 20, color: '#3b82f6' },
        { name: 'ملغي', value: 10, color: '#ef4444' },
    ]; */


    const [isLoading, setIsLoading] = useState(false);

    const fetchStats = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('auth_token');
        try {
            const res = await fetch(`${API_URL}/api/admin/stats?t=${new Date().getTime()}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setStats(prev => ({
                ...prev,
                total_users: data.total_users,
                total_products: data.total_products,
                total_orders: data.total_orders,
                total_revenue: data.total_revenue,
                aov: data.aov,
                conversion_rate: data.conversion_rate,
                recent_activities: data.recent_activities,
                top_selling_products: data.top_selling_products,
                order_status: data.order_status,
                sales_data: data.sales_data,
                daily_visits: data.daily_visits,
                monthly_visits: data.monthly_visits,
                today_orders: data.today_orders,
                yesterday_orders: data.yesterday_orders,
                visits_growth: data.visits_growth,
                orders_growth: data.orders_growth
            }));
        } catch (err) {
            console.error("Dashboard Fetch Error", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleRefresh = () => {
        fetchStats();
    };

    const handleDownloadReport = () => {
        // Prepare CSV Content
        const csvRows = [];

        // Header Date
        const reportDate = new Date().toLocaleDateString('ar-EG');
        csvRows.push([`"تقرير أداء المتجر - ${reportDate}"`]);
        csvRows.push([]); // Empty line

        // KPI Section
        csvRows.push(["المقياس", "القيمة"]);
        csvRows.push(["إجمالي الأرباح", stats.total_revenue]);
        csvRows.push(["إجمالي الطلبات", stats.total_orders]);
        csvRows.push(["إجمالي العملاء", stats.total_users]);
        csvRows.push(["متوسط قيمة الطلب", stats.aov]);
        csvRows.push(["زيارات اليوم", stats.daily_visits]);
        csvRows.push(["زيارات الشهر", stats.monthly_visits]);
        csvRows.push([]); // Empty line

        // Sales Data Section
        csvRows.push(["تاريخ المبيعات (آخر 7 أيام)", "المبلغ"]);
        stats.sales_data.forEach(item => {
            csvRows.push([item.name, item.sales]);
        });

        // Convert to CSV String with BOM for Arabic support
        const csvString = '\uFEFF' + csvRows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `dashboard_report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /* const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        window.location.href = "/";
    }; */

    return (
        <div className="dashboard-home">
            <div className="dashboard-header-flex">
                <div className="header-title">
                    <h1>مركز القيادة والتحليل</h1>
                    <p className="subtitle">نظرة شاملة على أداء متجرك اليوم</p>
                </div>
                <div className="header-actions">
                    <button className="btn-refresh" onClick={handleRefresh} disabled={isLoading}>
                        <FaHistory className={isLoading ? "spin" : ""} /> {isLoading ? "جاري التحديث..." : "تحديث البيانات"}
                    </button>
                    <button className="btn-primary-sm" onClick={handleDownloadReport}>تحميل التقرير</button>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Stat Cards */}
                <div className="stat-card blue">
                    <div className="icon"><FaUsers /></div>
                    <div className="info">
                        <h3>{stats.total_users}</h3>
                        <p>إجمالي العملاء</p>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="icon"><FaDollarSign /></div>
                    <div className="info">
                        <h3>${stats.total_revenue}</h3>
                        <p>صافي الأرباح</p>
                    </div>
                </div>
                {/* Orders Card with Daily Comparison */}
                <div className="stat-card purple">
                    <div className="icon"><FaShoppingCart /></div>
                    <div className="info">
                        <h3>{stats.today_orders}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <p style={{ margin: 0 }}>طلبات اليوم</p>
                            <span className={`trend ${stats.orders_growth >= 0 ? 'up' : 'down'}`} style={{ fontSize: '10px', padding: '1px 5px', position: 'static' }}>
                                {stats.orders_growth >= 0 ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(stats.orders_growth)}%
                            </span>
                        </div>
                    </div>
                </div>
                {/* Visits Card with Daily Comparison */}
                <div className="stat-card orange">
                    <div className="icon"><FaChartLine /></div>
                    <div className="info">
                        <h3>{stats.daily_visits}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <p style={{ margin: 0 }}>زيارات اليوم</p>
                            <span className={`trend ${stats.visits_growth >= 0 ? 'up' : 'down'}`} style={{ fontSize: '10px', padding: '1px 5px', position: 'static' }}>
                                {stats.visits_growth >= 0 ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(stats.visits_growth)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid second-row">
                <div className="stat-card kpi">
                    <div className="kpi-info">
                        <span className="label">زيارات الشهر الحالي</span>
                        <h3>{stats.monthly_visits}</h3>
                    </div>
                    <div className="kpi-chart">
                        {/* Placeholder for small sparkline */}
                    </div>
                </div>
                <div className="stat-card kpi">
                    <div className="kpi-info">
                        <span className="label">عدد المنتجات النشطة</span>
                        <h3>{stats.total_products}</h3>
                    </div>
                </div>
                <div className="stat-card kpi">
                    <div className="kpi-info">
                        <span className="label">وقت تجاوب الموقع</span>
                        <h3>1.2s</h3>
                    </div>
                </div>
                <div className="stat-card kpi">
                    <div className="kpi-info">
                        <span className="label">رضا العملاء</span>
                        <h3>4.8/5</h3>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-main-grid">
                <div className="chart-large-card">
                    <div className="card-header">
                        <h3>تحليل الأرباح الزمنية</h3>
                        <select className="chart-filter">
                            <option>آخر ٧ أيام</option>
                            <option>آخر ٣٠ يوم</option>
                        </select>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={stats.sales_data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                        padding: '12px'
                                    }}
                                    itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                                    formatter={(value) => [`$${value}`, 'المبيعات']}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                    activeDot={{ r: 8, strokeWidth: 0, fill: '#8b5cf6' }}
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-side-card">
                    <div className="card-header">
                        <h3>توزيع حالات الطلبات</h3>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={stats.order_status}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.order_status.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <ReTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pie-legend">
                            {stats.order_status.length > 0 ? stats.order_status.map((item, i) => (
                                <div key={i} className="legend-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <span className="dot" style={{ backgroundColor: item.color, width: '12px', height: '12px', borderRadius: '50%', display: 'inline-block', marginLeft: '8px' }}></span>
                                    <span className="name" style={{ fontSize: '14px', color: '#475569', flexGrow: 1 }}>{item.name}</span>
                                    <span className="val" style={{ fontWeight: 'bold', color: '#1e293b' }}>{item.value}%</span>
                                </div>
                            )) : <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>لا توجد بيانات</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="charts-main-grid bottom-charts">
                <div className="chart-medium-card">
                    <div className="card-header">
                        <h3>المنتجات الأكثر مبيعاً</h3>
                    </div>
                    <div className="chart-body">
                        <div className="top-products-list" style={{ padding: '0 20px' }}>
                            {stats.top_selling_products.length > 0 ? (
                                stats.top_selling_products.map((product, index) => {
                                    const maxSales = Math.max(...stats.top_selling_products.map(p => p.sales));
                                    const percentage = (product.sales / maxSales) * 100;

                                    return (
                                        <div key={index} style={{ marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                                <span style={{ fontWeight: '700', color: '#334155', fontSize: '14px', textAlign: 'right' }} dir="auto">
                                                    {product.name}
                                                </span>
                                                <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                                                    {product.sales} مبيعات
                                                </span>
                                            </div>
                                            <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden', direction: 'ltr' }}>
                                                <div style={{
                                                    width: `${percentage}%`,
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                                                    borderRadius: '5px',
                                                    transition: 'width 1s ease-in-out'
                                                }} />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                    <p>لا توجد مبيعات حتى الآن 📉</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="recent-activity-card">
                    <div className="card-header">
                        <h3>آخر النشاطات</h3>
                        <button className="view-all">مشاهدة الكل</button>
                    </div>
                    <div className="activity-list">
                        {stats.recent_activities.map(act => (
                            <div key={act.id} className="activity-item">
                                <div className={`activity-icon ${act.status}`}>
                                    {act.type === 'order' ? <FaShoppingCart size={14} /> : <FaUsers size={14} />}
                                </div>
                                <div className="activity-details">
                                    <p className="main-text">
                                        <strong>{act.user}</strong> {act.type === 'order' ? 'قام بشراء' : 'قام بـ'} {act.item}
                                    </p>
                                    <span className="time">{act.time}</span>
                                </div>
                                <div className="activity-meta-mobile">
                                    <div className="activity-amount">{act.amount}</div>
                                    <div className={`activity-status-badge ${act.status}`}>
                                        {act.status === 'completed' ? 'ناجح' : act.status === 'shipped' ? 'مشحون' : act.status === 'pending' ? 'معلق' : 'جديد'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
