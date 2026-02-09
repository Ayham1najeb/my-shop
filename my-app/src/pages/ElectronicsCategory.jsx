// ElectronicsCategory.jsx
import React, { useContext } from "react";
import { ProductContext } from "../ProductContext";
import ProductCard from "../ProductCard";

const ElectronicsCategory = () => {
  const { products } = useContext(ProductContext);
  const electronicsProducts = products.filter(
    (product) => product.category === "electronics"
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Electronics Collection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {electronicsProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ElectronicsCategory;
