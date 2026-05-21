// import { useState } from "react";

// export const useCart = () => {
//   const [cartItems, setCartItems] = useState([]);

//   const addToCart = (dish) => {
//     setCartItems((prev) => {
//       const existing = prev.find(item => item.dish._id === dish._id);
//       if (existing) {
//         return prev.map(item =>
//           item.dish._id === dish._id ? { ...item, quantity: item.quantity + 1 } : item
//         );
//       }
//       return [...prev, { dish, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (dishId) => {
//     setCartItems((prev) => prev.filter(item => item.dish._id !== dishId));
//   };

//   const clearCart = () => setCartItems([]);

//   const getTotal = () =>
//     cartItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);

//   return { cartItems, addToCart, removeFromCart, clearCart, getTotal };
// };