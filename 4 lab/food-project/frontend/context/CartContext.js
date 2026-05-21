import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const storageKey = "cart";

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem(storageKey);
      if (data) setCartItems(JSON.parse(data));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems]);

const addToCart = (dish) => {
  setCartItems((prev) => {
    const existing = prev.find((i) => i._id === dish._id);

    const safeDish = {
      _id: dish._id,
      name: dish.name,
      price: dish.price,
      image: dish.image || "https://via.placeholder.com/300"
    };

    if (existing) {
      return prev.map((i) =>
        i._id === dish._id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    }

    return [...prev, { ...safeDish, quantity: 1 }];
  });
};

  const removeFromCart = (id, amount = 1) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i._id === id ? { ...i, quantity: i.quantity - amount } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const getTotal = () =>
    cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, getTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);