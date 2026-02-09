import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "./apiConfig";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('cached_products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Initialize wishlist from localStorage
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Initialize orders from localStorage
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const promotionIds = [1, 3, 7];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch with no-cache headers to ensure fresh data
        const response = await fetch(`${API_URL}/api/products`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        let data = await response.json();

        // Optional: Apply discount logic if needed, or move to backend
        data = data.map((p) =>
          promotionIds.includes(p.id)
            ? { ...p, discount: p.price * 0.2 }
            : { ...p, discount: 0 }
        );

        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Cart functions
  const addToCart = (product, shouldOpenDrawer = true) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((p) => p.id === product.id);
      if (existingProduct) {
        return prevCart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    if (shouldOpenDrawer) {
      setIsCartOpen(true);
    }
  };

  const decreaseQuantity = (product) => {
    setCart((prevCart) =>
      prevCart
        .map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  const removeFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((p) => p.id !== product.id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist functions
  // Load Wishlist on Mount (Hybrid: API or Local)
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetch(`${API_URL}/api/wishlist`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            // Filter out any null products in case of backend soft-deletes
            const formattedWishlist = data.data
              .map(item => item.product)
              .filter(product => product !== null && product !== undefined);

            setWishlist(formattedWishlist);
            localStorage.setItem('wishlist', JSON.stringify(formattedWishlist));
          }
        })
        .catch(err => console.log("Error fetching wishlist:", err));
    }
  }, []);

  const addToWishlist = (product) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return; // Guard clause, though toggle handles this now

    // Optimistic UI Update
    setWishlist((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });

    fetch(`${API_URL}/api/wishlist/toggle`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ product_id: product.id })
    }).catch(err => console.error("Sync error", err));
  };

  const removeFromWishlist = (productId) => {
    // Optimistic UI Update (Always allow local cleanup, even if guest)
    setWishlist((prev) => prev.filter((p) => p.id !== productId));

    const token = localStorage.getItem('auth_token');
    if (!token) return;

    fetch(`${API_URL}/api/wishlist/toggle`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ product_id: productId })
    }).catch(err => console.error("Sync error", err));
  };

  const toggleWishlist = (product) => {
    // If it's ALREADY in wishlist, allow removal regardless of auth (to clean up guest state)
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      // If adding, strictly require auth
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate('/login');
        return;
      }
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Order functions
  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      ...orderDetails
    };

    setOrders((prev) => [...prev, newOrder]);
    clearCart();
    return newOrder;
  };

  const getOrderById = (orderId) => {
    return orders.find((o) => o.id === orderId);
  };

  const clearSessionData = () => {
    setCart([]);
    setWishlist([]);
    setOrders([]);
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    localStorage.removeItem('orders');
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        selectedProduct,
        setSelectedProduct,
        // Cart
        cart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        // Wishlist
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        // Orders
        orders,
        placeOrder,
        getOrderById,
        // Session
        clearSessionData,
        // Search
        searchTerm,
        setSearchTerm,
        loading,
        error
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
