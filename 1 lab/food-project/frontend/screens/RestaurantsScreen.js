import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Button, Alert } from "react-native";
import { api } from "../services/api";
import RestaurantItem from "../components/RestaurantItem";

export default function RestaurantsScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await api.get("/restaurants");
      setRestaurants(response.data);
    } catch (error) {
      Alert.alert("No connection to server");
    } finally {
      setLoading(false);
    }
  };

  const deleteRestaurant = async (id) => {
    try {
      await api.delete(`/restaurants/${id}`);
      Alert.alert("Deleted");
      fetchRestaurants();
    } catch {
      Alert.alert("Delete failed");
    }
  };

  const viewMenu = (restaurant) => {
    navigation.navigate("RestaurantMenu", { restaurantId: restaurant._id });
  };

  const editRestaurant = (restaurant) => {
    navigation.navigate("EditRestaurant", { restaurant });
  };

  const createRestaurant = () => {
    navigation.navigate("EditRestaurant");
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchRestaurants);
    return unsubscribe;
  }, [navigation]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      <Button title="Add Restaurant" onPress={createRestaurant} />

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <RestaurantItem
            restaurant={item}
            onViewMenu={viewMenu}
            onDelete={deleteRestaurant}
            onEdit={editRestaurant}
          />
        )}
      />

      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}