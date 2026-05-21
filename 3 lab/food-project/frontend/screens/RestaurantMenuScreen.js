import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, Button } from "react-native";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { useSelectedRestaurant } from "../context/SelectedRestaurantContext";

export default function RestaurantMenuScreen({ navigation }) {
  const { selectedRestaurant } = useSelectedRestaurant();
  const { addToCart } = useCart();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);

  const restaurantId = selectedRestaurant?._id;

  useLayoutEffect(() => {
    if (selectedRestaurant) {
      navigation.setOptions({
        title: `🍽 ${selectedRestaurant.name} Menu`,
      });
    }
  }, [navigation, selectedRestaurant]);

  const fetchMenu = async () => {
    if (!restaurantId) return;

    setLoading(true);
    try {
      const response = await api.get(`/restaurants/${restaurantId}/menu`);
      setMenu(response.data);
    } catch (error) {
      Alert.alert("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [restaurantId]);

  if (!selectedRestaurant) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No restaurant selected</Text>
      </View>
    );
  }

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      <FlatList
        data={menu}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}>
            <Text>{item.name} - ${item.price}</Text>

            <Button
              title="Add to Cart"
              onPress={() => {
                addToCart(item);
                Alert.alert(`${item.name} added to cart`);
              }}
            />
          </View>
        )}
      />

      <Button
        title="Edit Restaurant"
        onPress={() =>
          navigation.navigate("EditRestaurant", { restaurant: selectedRestaurant })
        }
      />

      <Button title="Go to Cart" onPress={() => navigation.navigate("Cart")} />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}