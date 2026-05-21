import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, Button } from "react-native";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";

export default function RestaurantMenuScreen({ route, navigation }) {
  const { restaurantId } = route.params;
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/restaurants/${restaurantId}/menu`);
      setMenu(response.data);
    } catch (error) {
      console.log(error.message);
      Alert.alert("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, []);

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
      <Button title="Go to Cart" onPress={() => navigation.navigate("Cart")} />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}