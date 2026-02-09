// src/pages/MenCategory.jsx
import React, { useContext } from "react";
import { ProductContext } from "../ProductContext";
import ProductCard from "../ProductCard";

const MenCategory = () => {
  const { products } = useContext(ProductContext);

  const menProducts = products.filter(
    (product) => product.category.toLowerCase() === "men"
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Men Collection</h2>
      {menProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {menProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenCategory;
