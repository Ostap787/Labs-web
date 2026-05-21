import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { useSelectedRestaurant } from "../context/SelectedRestaurantContext";
import DishItem from "../components/DishItem";
import { Ionicons } from "@expo/vector-icons";

export default function RestaurantMenuScreen({ navigation }) {
  const { selectedRestaurant } = useSelectedRestaurant();
  const { addToCart } = useCart();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    if (!selectedRestaurant) return;

    api.get(`/restaurants/${selectedRestaurant._id}/menu`)
      .then(res => setMenu(res.data));
  }, [selectedRestaurant]);

  // 🔥 HEADER TITLE + BACK BUTTON
  useLayoutEffect(() => {
    navigation.setOptions({
      title: selectedRestaurant?.name || "Menu",

      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Restaurants")}
          style={{ marginLeft: 15 }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedRestaurant]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={menu}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <DishItem dish={item} onAdd={addToCart} />
        )}
      />
    </View>
  );
}