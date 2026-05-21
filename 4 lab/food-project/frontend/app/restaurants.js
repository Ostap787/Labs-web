import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
import { api } from "../services/api";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/restaurants")
      .then(res => setRestaurants(res.data))
      .catch(error => {
        window.alert("No connection to server");
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}