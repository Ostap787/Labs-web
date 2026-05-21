import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text, TouchableOpacity } from "react-native";
import { api } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen({ navigation, setCurrentUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (loading) return; 

    if (!name || !email || !password) {
      return Alert.alert("Fill all fields");
    }

    try {
      setLoading(true);

      const response = await api.post("/users/register", {
        name,
        email,
        password
      });

      console.log("REGISTER RESPONSE:", response.data);

      const user = response.data.user;
      const token = response.data.token;

      await AsyncStorage.setItem("currentUser", JSON.stringify(user));
      await AsyncStorage.setItem("token", token);

      setCurrentUser(user);

      Alert.alert("Success", "Registration successful!");

      setTimeout(() => {
        navigation.replace("Home");
      }, 100);

    } catch (err) {
      console.log("REGISTER ERROR:", err);

      Alert.alert(
        "Registration failed",
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

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
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />

      <Button
        title={loading ? "Registering..." : "Register"}
        onPress={handleRegister}
        disabled={loading}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={{ marginTop: 20, alignItems: "center" }}
      >
        <Text style={{ color: "blue" }}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}