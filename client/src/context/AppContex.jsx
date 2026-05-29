/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState([]);

  // A simple flag to trigger backend synchronization ONLY on user interactions
  const [isLocalChange, setIsLocalChange] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchSeller = async () => {
    try {
      const { data } = await axios.post('/api/seller/auth');
      setIsSeller(!!data.success);
    } catch (error) {
      setIsSeller(false);
      toast.error(error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/is-auth');
      if (data.success && data.user) {
        setUser(data.user);
        // This sets the state directly from the database without triggering a backend update
        setCartItems(data.user.cartItems || {});
        setIsLocalChange(false);
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch (error) {
      setUser(null);
      setCartItems({});
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/product/list');
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addtoCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);
    setIsLocalChange(true); // Allow this specific update to go to the DB
    toast.success("Added to cart");
  };

  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity <= 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
    setIsLocalChange(true); // Allow this specific update to go to the DB
    toast.success("Cart updated");
  };

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    setCartItems(cartData);
    setIsLocalChange(true); // Allow this specific update to go to the DB
    toast.success("Removed from cart");
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemsInfo = products.find((product) => product._id === items);
      if (itemsInfo && cartItems[items] > 0) {
        totalAmount += itemsInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  // 1. Initial data fetching on mount
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  // 2. Sync to database ONLY when user alters state via interaction buttons
  useEffect(() => {
    const updateCartInDB = async () => {
      try {
        const { data } = await axios.post('/api/cart/update', { cartItems });
        if (!data.success) {
          toast.error(data.message || "Failed to sync cart");
        }
      } catch (error) {
        toast.error(error.message || "Failed to sync cart");
      } finally {
        setIsLocalChange(false);
      }
    };

    if (user && isLocalChange) {
      updateCartInDB();
    }
  }, [cartItems, user, isLocalChange]);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addtoCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    setCartItems,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    structuredClone,
    axios,
    fetchProducts,
    authLoading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};