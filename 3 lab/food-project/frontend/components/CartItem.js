import React from "react";
import { View, Text, Button } from "react-native";

export default function CartItem({ item, onRemove }) {
  return (
    <View style={{ padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}>
      <Text>{item.dish.name} x {item.quantity}</Text>
      <Text>${item.dish.price * item.quantity}</Text>
      <Button title="Remove" onPress={() => onRemove(item.dish._id)} />
    </View>
  );
}