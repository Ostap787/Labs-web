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
    if (!name || !email || !password) {
      Alert.alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/users/register", { name, email, password });

      const user = response.data?.user;
      if (user) {
        // Зберігаємо користувача в AsyncStorage
        await AsyncStorage.setItem("currentUser", JSON.stringify(user));
        setCurrentUser(user);

        // Очистка полів форми (оновлення сторінки)
        setName("");
        setEmail("");
        setPassword("");

        Alert.alert("Registration success", `Welcome, ${user.name}!`);
        // Перехід на Home і заміна поточної сторінки
        navigation.replace("Home");
        return;
      }

      Alert.alert("Registration failed", "No user returned from server");

    } catch (err) {
      // Обробка специфічного 400, коли користувач вже створений
      if (err.response?.status === 400 && err.response?.data?.user) {
        const user = err.response.data.user;
        await AsyncStorage.setItem("currentUser", JSON.stringify(user));
        setCurrentUser(user);
        setName(""); setEmail(""); setPassword("");
        Alert.alert("Registration success", `Welcome, ${user.name}!`);
        navigation.replace("Home");
        return;
      }

      Alert.alert(
        "Registration failed",
        err.response?.data?.message || err.message
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

      <Button title={loading ? "Registering..." : "Register"} onPress={handleRegister} disabled={loading} />

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