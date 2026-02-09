// src/pages/KidsCategory.jsx
import React, { useContext } from "react";
import { ProductContext } from "../ProductContext";
import ProductCard from "../ProductCard";

const KidsCategory = () => {
  const { products } = useContext(ProductContext);

  const kidsProducts = products.filter(
    (product) => product.category.toLowerCase() === "kids"
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Kids Collection</h2>
      {kidsProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {kidsProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default KidsCategory;
