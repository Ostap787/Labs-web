import React from "react";
import { View, Button, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation, setCurrentUser, currentUser }) {
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
        title="Logout"
        onPress={async () => {
          await AsyncStorage.removeItem("currentUser");
          setCurrentUser(null);
          navigation.replace("Login");
        }}
      />
    </View>
  );
}