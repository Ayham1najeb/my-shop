// src/pages/SportsCategory.jsx
import React, { useContext } from "react";
import { ProductContext } from "../ProductContext";
import ProductCard from "../ProductCard";

const SportsCategory = () => {
  const { products } = useContext(ProductContext);

  const sportsProducts = products.filter(
    (product) => product.category.toLowerCase() === "sports"
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Sports Collection</h2>
      {sportsProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sportsProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SportsCategory;
