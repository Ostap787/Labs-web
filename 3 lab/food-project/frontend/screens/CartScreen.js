import React from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";

export default function CartScreen({ currentUser }) {
  const { cartItems, addToCart, removeFromCart, clearCart, getTotal } = useCart();

  const placeOrder = async () => {
    try {
      if (!currentUser) return Alert.alert("Login required");
      if (cartItems.length === 0) return Alert.alert("Cart is empty");

      const items = cartItems.map(item => ({
        dish: item._id,
        quantity: item.quantity
      }));

      const response = await api.post("/orders", { items });

      Alert.alert(
        "✅ Order placed!",
        `Order ID: ${response.data._id}`
      );

      clearCart(); // 🔥 очищаємо корзину

    } catch (err) {
      Alert.alert(
        "Failed to place order",
        err.response?.data?.message || err.message
      );
    }
  };

  if (cartItems.length === 0)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Your cart is empty</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}>
            <Text>{item.name} x {item.quantity}</Text>
            <Text>${item.price * item.quantity}</Text>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Button title="-" onPress={() => removeFromCart(item._id, 1)} />
              <View style={{ width: 10 }} />
              <Button title="+" onPress={() => addToCart(item)} />
              <View style={{ width: 10 }} />
              <Button title="Remove All" onPress={() => removeFromCart(item._id, item.quantity)} />
            </View>
          </View>
        )}
      />
      <Text style={{ fontSize: 18, fontWeight: "bold", padding: 15 }}>
        Total: ${getTotal()}
      </Text>
      <Button title="Clear Cart" onPress={clearCart} />
      <View style={{ height: 10 }} />
      <Button title="Place Order" onPress={placeOrder} />
    </View>
  );
}