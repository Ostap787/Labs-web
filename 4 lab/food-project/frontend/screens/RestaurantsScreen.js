import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { api } from "../services/api";
import { useSelectedRestaurant } from "../context/SelectedRestaurantContext";
import { Ionicons } from "@expo/vector-icons";

export default function RestaurantsScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setSelectedRestaurant } = useSelectedRestaurant();

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await api.get("/restaurants");
      setRestaurants(res.data);
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = navigation.addListener("focus", fetchRestaurants);
    return unsub;
  }, [navigation]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <FlatList
        data={restaurants}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedRestaurant(item);
              navigation.navigate("RestaurantMenu");
            }}
            style={{
              backgroundColor: "#fff",
              padding: 15,
              marginBottom: 12,
              borderRadius: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              elevation: 2,
            }}
          >
            <View>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                {item.name}
              </Text>
              <Text style={{ color: "#666" }}>
                {item.cuisine}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={22} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}