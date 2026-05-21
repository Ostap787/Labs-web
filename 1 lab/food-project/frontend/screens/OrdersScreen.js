import React, { useEffect, useState } from "react";
import { View, FlatList, Text, ActivityIndicator, Alert } from "react-native";
import { api } from "../services/api";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      Alert.alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // автооновлення кожні 5 сек
    return () => clearInterval(interval);
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}>
            <Text>Restaurant: {item.restaurant.name}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Total: ${item.total}</Text>
          </View>
        )}
      />
    </View>
  );
}