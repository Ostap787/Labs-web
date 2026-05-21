import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text, TouchableOpacity } from "react-native";
import { api } from "../services/api";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("/users/register", { name, email, password });
      Alert.alert("Registration success");
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Registration failed");
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

      <Button title="Register" onPress={handleRegister} />

      {/* КНОПКА ДЛЯ ЗАРЕЄСТРОВАНИХ */}
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