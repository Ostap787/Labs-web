import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const Card = ({ icon, title, screen }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(screen)}
      style={{
        backgroundColor: "#fff",
        padding: 20,
        marginBottom: 15,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        elevation: 4,
      }}
    >
      <Ionicons name={icon} size={28} color="#ff6b00" />
      <Text style={{ marginLeft: 15, fontSize: 16, fontWeight: "600" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f7f7f7" }}>
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 20 }}>
        🍽 Welcome
      </Text>

      <Card icon="restaurant-outline" title="Restaurants" screen="Restaurants" />
      <Card icon="cart-outline" title="Cart" screen="Cart" />
      <Card icon="receipt-outline" title="Orders" screen="Orders" />
    </View>
  );
}