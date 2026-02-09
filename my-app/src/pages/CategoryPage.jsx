import { useParams } from "react-router-dom";
import { products } from "../data/products";

export default function CategoryPage() {
  const { slug } = useParams();
  const filtered = products.filter(p => p.category === slug);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">تصنيف: {slug}</h2>
      {filtered.length === 0 ? (
        <p className="text-gray-600">لا توجد منتجات في هذا التصنيف حالياً.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map(prod => (
            <div
              key={prod.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition"
            >
              <h3 className="font-semibold">{prod.name}</h3>
              <p className="text-gray-600">{prod.price} $</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
