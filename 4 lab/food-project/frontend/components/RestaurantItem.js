import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function RestaurantItem({ restaurant, onViewMenu }) {
  return (
    <TouchableOpacity
      onPress={() => onViewMenu(restaurant)}
      style={{
        backgroundColor: "#fff",
        padding: 18,
        margin: 10,
        borderRadius: 15,
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        {restaurant.name}
      </Text>
      <Text style={{ color: "#666", marginTop: 4 }}>
        {restaurant.cuisine}
      </Text>
      <Text style={{ marginTop: 6, color: "#ff6b00" }}>
        ⭐ {restaurant.rating}
      </Text>
    </TouchableOpacity>
  );
}