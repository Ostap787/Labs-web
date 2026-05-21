import React from "react";
import { View, Text, Button } from "react-native";

export default function DishItem({ dish, onAdd }) {
  return (
    <View style={{ padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}>
      <Text style={{ fontSize: 16 }}>{dish.name}</Text>
      <Text style={{ color: "#555" }}>{dish.description}</Text>
      <Text style={{ fontWeight: "bold" }}>${dish.price}</Text>
      <Button title="Add to Cart" onPress={() => onAdd(dish)} />
    </View>
  );
}