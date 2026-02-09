// src/pages/AccessoriesCategory.jsx
import React, { useContext } from "react";
import { ProductContext } from "../ProductContext";
import ProductCard from "../ProductCard";

const AccessoriesCategory = () => {
  const { products } = useContext(ProductContext);

  // فلترة المنتجات حسب اسم القسم (مرنة، insensitive case)
  const accessoriesProducts = products.filter((product) =>
    product.category.toLowerCase().includes("accessories")
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Accessories Collection</h2>
      {accessoriesProducts.length === 0 ? (
        <p className="text-gray-600">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {accessoriesProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AccessoriesCategory;
