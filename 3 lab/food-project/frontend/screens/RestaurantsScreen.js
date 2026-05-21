import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Button, Alert } from "react-native";
import { api } from "../services/api";
import { useSelectedRestaurant } from "../context/SelectedRestaurantContext";
import RestaurantItem from "../components/RestaurantItem";

export default function RestaurantsScreen({ navigation, currentUser }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setSelectedRestaurant } = useSelectedRestaurant();

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
    setSelectedRestaurant(restaurant);
    navigation.navigate("RestaurantMenu");
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
            onDelete={currentUser?.role === "admin" ? deleteRestaurant : null}
            onEdit={currentUser?.role === "admin" ? editRestaurant : null}
          />
        )}
      />

      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}