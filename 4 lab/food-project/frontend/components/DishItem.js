import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function DishItem({ dish, onAdd }) {

  const imageUri =
    dish?.image?.includes("http")
      ? dish.image + "?w=600"
      : "https://picsum.photos/300/200";

  return (
    <View
      style={{
        backgroundColor: "#fff",
        margin: 10,
        borderRadius: 15,
        overflow: "hidden",
        elevation: 3,
      }}
    >
      <Image
        source={{ uri: imageUri }}
        style={{ width: "100%", height: 180 }}
        resizeMode="cover"
      />

      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {dish.name}
        </Text>

        <Text style={{ color: "#666", marginVertical: 5 }}>
          {dish.description}
        </Text>

        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          ${dish.price}
        </Text>

        <TouchableOpacity
          onPress={() => onAdd(dish)}
          style={{
            backgroundColor: "#ff6b6b",
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            Add to cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}