import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  Alert,
  Button
} from "react-native";
import { api } from "../services/api";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch {
      window.alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      window.alert("Order completed 🎉");
      fetchOrders();
    } catch {
      window.alert("Error confirming order");
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 3000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 15, borderBottomWidth: 1 }}>
            
            <Text>Status: {item.status}</Text>
            <Text>Total: ${item.total}</Text>

            {item.items.map(i => (
              <Text key={i._id}>
                {i.dish?.name} x {i.quantity}
              </Text>
            ))}

            {item.status === "completed" && (
              <Button
                title="Confirm Delivery"
                onPress={() => confirmOrder(item._id)}
              />
            )}

          </View>
        )}
      />
    </View>
  );
}