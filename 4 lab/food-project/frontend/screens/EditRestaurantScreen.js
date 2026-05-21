import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Alert, Text } from "react-native";
import { api } from "../services/api";

export default function EditRestaurantScreen({ route, navigation }) {
  const restaurant = route.params?.restaurant;

  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name);
      setCuisine(restaurant.cuisine);
      setRating(String(restaurant.rating));
    }
  }, []);

  const saveRestaurant = async () => {
    if (!name || !cuisine || !rating) {
      window.alert("All fields are required");
      return;
    }

    try {
      if (restaurant) {
        // UPDATE
        await api.put(`/restaurants/${restaurant._id}`, {
          name,
          cuisine,
          rating: Number(rating),
        });
        window.alert("Restaurant updated");
      } else {
        // CREATE
        await api.post("/restaurants", {
          name,
          cuisine,
          rating: Number(rating),
        });
        window.alert("Restaurant created");
      }

      navigation.goBack();
    } catch (error) {
      window.alert("Failed to save restaurant");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Name:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 15, padding: 10 }}
      />

      <Text>Cuisine:</Text>
      <TextInput
        value={cuisine}
        onChangeText={setCuisine}
        style={{ borderWidth: 1, marginBottom: 15, padding: 10 }}
      />

      <Text>Rating:</Text>
      <TextInput
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 15, padding: 10 }}
      />

      <Button
        title={restaurant ? "Update Restaurant" : "Create Restaurant"}
        onPress={saveRestaurant}
      />
    </View>
  );
}