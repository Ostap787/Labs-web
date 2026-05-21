import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { api } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation, setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/users/login", { email, password });

      const user = response.data.user;
      const token = response.data.token;

      await AsyncStorage.setItem("currentUser", JSON.stringify(user));
      await AsyncStorage.setItem("token", token);

      setCurrentUser(user);

      Alert.alert("Login success");
      navigation.replace("Home");

    } catch (err) {
      Alert.alert("Login failed", err.response?.data?.message || err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Register" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}