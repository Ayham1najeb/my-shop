// ProductByName.jsx
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "../ProductContext";
import ProductReviews from "../components/ProductReviews";

const ProductByName = () => {
  const { productName } = useParams(); // القيمة من الرابط: /products/name/:productName
  const { products } = useContext(ProductContext);

  // فلترة المنتج حسب الاسم (نجعل البحث غير حساس لحالة الحروف)
  const filteredProduct = products.filter(
    (product) => product.name.toLowerCase() === decodeURIComponent(productName).toLowerCase()
  );

  if (filteredProduct.length === 0) {
    return <p className="p-6 text-center text-gray-600">No product found with this name.</p>;
  }

  const product = filteredProduct[0];

  return (
    <div className="p-6 max-w-sm mx-auto border rounded shadow mt-6">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-64 object-cover mb-4 rounded"
      />
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p className="text-gray-700 text-lg mb-2">${product.price}</p>
      {product.description && <p className="text-gray-600">{product.description}</p>}

      {/* Product Reviews Section */}
      <ProductReviews productId={product.id} />
    </div>
  );
};

export default ProductByName;
