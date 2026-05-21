import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

export const CartProvider = ({ children, currentUser }) => {
  const [cartItems, setCartItems] = useState([]);

  const storageKey = `cart_${currentUser?._id || "guest"}`;

  useEffect(() => {
    (async () => {
      const storedCart = await AsyncStorage.getItem(storageKey);
      if (storedCart) setCartItems(JSON.parse(storedCart));
      else setCartItems([]);
    })();
  }, [currentUser]);

  useEffect(() => {
    AsyncStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey]);

  const addToCart = (dish) => {
    const existing = cartItems.find(item => item._id === dish._id);
    if (existing) {
      setCartItems(cartItems.map(item =>
        item._id === dish._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...dish, quantity: 1 }]);
    }
  };

  const removeFromCart = (dishId, amount = 1) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item._id === dishId ? { ...item, quantity: item.quantity - amount } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);