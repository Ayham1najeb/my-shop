import React from 'react';
import { FaSearch, FaFilter, FaMoneyBillWave, FaTags, FaStar, FaTshirt, FaPalette, FaLayerGroup, FaTimes } from 'react-icons/fa';
import { useLanguage } from '../LanguageContext';
import './ProductSidebar.css';

const ProductSidebar = ({ filters, setFilters, fixedCategory, dynamicBrands, dynamicColors, onClose }) => {
    const { t } = useLanguage();

    // Categories using translation keys
    const categories = [
        { id: 'men', label: t('dept_men') },
        { id: 'women', label: t('dept_women') },
        { id: 'kids', label: t('dept_kids') },
        { id: 'sports', label: t('dept_sports') },
        { id: 'accessories', label: t('dept_accessories') },
        { id: 'electronics', label: t('dept_electronics') },
        { id: 'jewelery', label: t('dept_jewelery') },
    ];

    // Filter categories if fixedCategory is provided
    const displayedCategories = fixedCategory
        ? categories.filter(cat => cat.id === fixedCategory)
        : categories;

    // Brands
    const defaultBrands = [
        { id: 'nike', label: 'Nike' },
        { id: 'adidas', label: 'Adidas' },
        { id: 'puma', label: 'Puma' },
        { id: 'zara', label: 'Zara' },
        { id: 'h_m', label: 'H&M' },
        { id: 'apple', label: 'Apple' },
        { id: 'samsung', label: 'Samsung' },
        { id: 'lc_waikiki', label: 'LC Waikiki' },
    ];

    const displayBrands = dynamicBrands && dynamicBrands.length > 0 ? dynamicBrands : defaultBrands;

    // Colors
    const defaultColors = [
        { id: 'black', label: t('filter_color_black') || 'Black', code: '#000000' },
        { id: 'white', label: t('filter_color_white') || 'White', code: '#ffffff', border: true },
        { id: 'red', label: t('filter_color_red') || 'Red', code: '#ef4444' },
        { id: 'blue', label: t('filter_color_blue') || 'Blue', code: '#3b82f6' },
        { id: 'green', label: t('filter_color_green') || 'Green', code: '#22c55e' },
        { id: 'yellow', label: t('filter_color_yellow') || 'Yellow', code: '#eab308' },
        { id: 'purple', label: t('filter_color_purple') || 'Purple', code: '#a855f7' },
        { id: 'gray', label: t('filter_color_gray') || 'Gray', code: '#6b7280' },
        { id: 'pink', label: 'Pink', code: '#ec4899' },
        { id: 'orange', label: 'Orange', code: '#f97316' },
        { id: 'brown', label: 'Brown', code: '#78350f' },
        { id: 'beige', label: 'Beige', code: '#d4c4a8', border: true },
        { id: 'navy', label: 'Navy', code: '#1e3a5f' },
        { id: 'turquoise', label: 'Turquoise', code: '#14b8a6' },
        { id: 'gold', label: 'Gold', code: '#d4af37' },
        { id: 'olive', label: 'Olive', code: '#556b2f' },
    ];

    // Map dynamic colors labels if needed (e.g. if they come as English strings)
    // For now we assume dynamic colors have correct labels or we use what's provided
    const displayColors = dynamicColors && dynamicColors.length > 0 ? dynamicColors : defaultColors;

    // Materials/Fabrics
    const materials = [
        { id: 'cotton', labelEn: 'Cotton', labelAr: 'قطن' },
        { id: 'polyester', labelEn: 'Polyester', labelAr: 'بوليستر' },
        { id: 'linen', labelEn: 'Linen', labelAr: 'كتان' },
        { id: 'wool', labelEn: 'Wool', labelAr: 'صوف' },
        { id: 'leather', labelEn: 'Leather', labelAr: 'جلد' },
        { id: 'denim', labelEn: 'Denim', labelAr: 'جينز' },
        { id: 'silk', labelEn: 'Silk', labelAr: 'حرير' },
    ];


    const handleCheckboxChange = (type, value) => {
        // Prevent changing category if it's fixed
        if (type === 'categories' && fixedCategory) return;

        const currentValues = filters[type] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];

        setFilters({ ...filters, [type]: newValues });
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSearchChange = (e) => {
        setFilters({ ...filters, searchQuery: e.target.value });
    };

    return (
        <aside className="product-sidebar">
            {/* Mobile Close Button */}
            <div className="sidebar-mobile-header">
                <h3 className="sidebar-title" style={{ margin: 0 }}>{t('filters')}</h3>
                <button className="close-sidebar-btn" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>

            {/* Search Section */}
            <div className="sidebar-section search-section">
                <h3 className="sidebar-title">
                    <FaSearch className="sidebar-icon" /> {t('filter_quick_search')}
                </h3>
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder={t('filter_search_placeholder')}
                        value={filters.searchQuery}
                        onChange={handleSearchChange}
                    />
                    <FaSearch className="search-icon-absolute" />
                </div>
            </div>

            {/* Categories Section */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">
                    <FaTags className="sidebar-icon" /> {t('filter_categories')}
                </h3>
                <div className="scrollable-list">
                    {displayedCategories.map((cat) => (
                        <label key={cat.id} className="custom-checkbox" style={{ opacity: fixedCategory ? 1 : 1, cursor: fixedCategory ? 'default' : 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={fixedCategory ? true : filters.categories?.includes(cat.id)}
                                onChange={() => handleCheckboxChange('categories', cat.id)}
                                disabled={!!fixedCategory}
                            />
                            <span className="checkmark" style={{ backgroundColor: fixedCategory ? '#3BA3D9' : '', borderColor: fixedCategory ? '#3BA3D9' : '' }}></span>
                            <span className="label-text">{cat.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Brands Section */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">
                    <FaTshirt className="sidebar-icon" /> {t('filter_brand')}
                </h3>
                <div className="scrollable-list">
                    {displayBrands.map((brand) => (
                        <label key={brand.id} className="custom-checkbox">
                            <input
                                type="checkbox"
                                checked={filters.brands?.includes(brand.id)}
                                onChange={() => handleCheckboxChange('brands', brand.id)}
                            />
                            <span className="checkmark"></span>
                            <span className="label-text">{brand.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Colors Section */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">
                    <FaPalette className="sidebar-icon" /> {t('filter_color')}
                </h3>
                <div className="color-grid">
                    {displayColors.map((color) => (
                        <div
                            key={color.id}
                            className={`color-swatch ${filters.colors?.includes(color.id) ? 'active' : ''}`}
                            onClick={() => handleCheckboxChange('colors', color.id)}
                            title={t(`filter_color_${color.id}`) || color.label} // Try translation first
                            style={{ backgroundColor: color.code, border: color.border ? '1px solid #e2e8f0' : 'none' }}
                        >
                            {filters.colors?.includes(color.id) && <span className="color-check">✓</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Material/Fabric Section */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">
                    <FaLayerGroup className="sidebar-icon" /> {t('filter_material') || 'نوع القماش'}
                </h3>
                <div className="scrollable-list">
                    {materials.map((material) => (
                        <label key={material.id} className="custom-checkbox">
                            <input
                                type="checkbox"
                                checked={filters.materials?.includes(material.id)}
                                onChange={() => handleCheckboxChange('materials', material.id)}
                            />
                            <span className="checkmark"></span>
                            <span className="label-text">{t(`material_${material.id}`) || material.labelAr}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Section */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">
                    <FaMoneyBillWave className="sidebar-icon" /> {t('filter_price_range')}
                </h3>
                <div className="price-inputs">
                    <div className="price-group">
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handlePriceChange}
                            placeholder="Min"
                            min="0"
                        />
                    </div>
                    <span className="price-separator">-</span>
                    <div className="price-group">
                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handlePriceChange}
                            placeholder="Max"
                            min="0"
                        />
                    </div>
                </div>
                <div className="price-slider-visual">
                    <div className="slider-track"></div>
                    <div className="slider-range"></div>
                </div>
            </div>

            {/* Rating Section */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">
                    <FaStar className="sidebar-icon" /> {t('filter_rating')}
                </h3>
                <div className="rating-options">
                    {[4, 3, 2, 1].map((star) => (
                        <div
                            key={star}
                            className={`rating-row ${filters.minRating === star ? 'active' : ''}`}
                            onClick={() => setFilters({ ...filters, minRating: star === filters.minRating ? null : star })}
                        >
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < star ? "star-filled" : "star-empty"} />
                                ))}
                            </div>
                            <span className="rating-text">{t('or_more')}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="sidebar-footer">
                <button
                    className="reset-btn"
                    onClick={() => setFilters({
                        minPrice: '', maxPrice: '', categories: [], brands: [], colors: [], materials: [], minRating: null, searchQuery: ''
                    })}
                >
                    <FaFilter /> {t('reset_all')}
                </button>
            </div>
        </aside>
    );
};

export default ProductSidebar;
