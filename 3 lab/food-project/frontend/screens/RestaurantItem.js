import React from "react";
import { View, Text, Button } from "react-native";

export default function RestaurantItem({ restaurant, onDelete, onViewMenu, onEdit }) {
  return (
    <View style={{ padding: 20, borderBottomWidth: 1, borderColor: "#ccc" }}>
      <Text style={{ fontSize: 18 }}>{restaurant.name}</Text>

      <Text style={{ color: "#555" }}>
        {restaurant.cuisine} | Rating: {restaurant.rating}
      </Text>

      <View style={{ marginTop: 10 }}>
        <Button title="View Menu" onPress={() => onViewMenu(restaurant)} />
      </View>

      {onEdit && (
        <View style={{ marginTop: 5 }}>
          <Button title="Edit" onPress={() => onEdit(restaurant)} />
        </View>
      )}

      {onDelete && (
        <View style={{ marginTop: 5 }}>
          <Button
            title="Delete"
            color="red"
            onPress={() => onDelete(restaurant._id)}
          />
        </View>
      )}
    </View>
  );
}