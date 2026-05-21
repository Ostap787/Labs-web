import React from "react";
import { View, Button } from "react-native";

export default function HomeScreen({ navigation, currentUser }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>

      <Button
        title="Go to Restaurants"
        onPress={() => navigation.navigate("Restaurants")}
      />

      <View style={{ height: 20 }} />

      <Button
        title="Check Cart"
        onPress={() => navigation.navigate("Cart")}
      />

      <View style={{ height: 20 }} />

      <Button
        title="My Orders"
        onPress={() => navigation.navigate("Orders")}
      />

    </View>
  );
}