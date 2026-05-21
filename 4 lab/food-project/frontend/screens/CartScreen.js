import React from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";
import { Ionicons } from "@expo/vector-icons";

export default function CartScreen({ currentUser }) {
  const { cartItems, addToCart, removeFromCart, getTotal, clearCart } = useCart();

  const placeOrder = async () => {
    try {
      if (!currentUser) {
        return Alert.alert("Login required", "Please login first");
      }

      if (cartItems.length === 0) {
        return Alert.alert("Cart is empty");
      }

      const items = cartItems.map((i) => ({
        dish: i._id,
        quantity: i.quantity,
      }));

      const res = await api.post("/orders", { items });

      Alert.alert("✅ Order placed!", `Order ID: ${res.data._id}`);

      clearCart();
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to place order"
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>

      <FlatList
        data={cartItems}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              margin: 10,
              padding: 15,
              borderRadius: 12,
              elevation: 3,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {item.name}
            </Text>

            <Text style={{ marginVertical: 5 }}>
              {item.quantity} × ${item.price}
            </Text>

            {/* 🔥 QUANTITY CONTROLS */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>

              {/* MINUS */}
              <TouchableOpacity
                onPress={() => removeFromCart(item._id, 1)}
                style={{
                  backgroundColor: "#ff5252",
                  padding: 8,
                  borderRadius: 8,
                  marginRight: 10,
                }}
              >
                <Ionicons name="remove" size={18} color="white" />
              </TouchableOpacity>

              <Text style={{ fontSize: 16, marginHorizontal: 10 }}>
                {item.quantity}
              </Text>

              {/* PLUS */}
              <TouchableOpacity
                onPress={() => addToCart(item)}
                style={{
                  backgroundColor: "#4caf50",
                  padding: 8,
                  borderRadius: 8,
                  marginLeft: 10,
                }}
              >
                <Ionicons name="add" size={18} color="white" />
              </TouchableOpacity>

            </View>
          </View>
        )}
      />

      <Text style={{ fontSize: 18, fontWeight: "bold", padding: 15 }}>
        Total: ${getTotal()}
      </Text>

      {/* PLACE ORDER */}
      <TouchableOpacity
        onPress={placeOrder}
        style={{
          backgroundColor: "#00c853",
          padding: 15,
          marginHorizontal: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Place Order 🚀
        </Text>
      </TouchableOpacity>

      {/* CLEAR */}
      <TouchableOpacity
        onPress={clearCart}
        style={{
          backgroundColor: "#ff6b00",
          padding: 15,
          margin: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Clear Cart</Text>
      </TouchableOpacity>

    </View>
  );
}