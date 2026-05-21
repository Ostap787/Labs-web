import React, { useEffect, useState, useRef } from "react";
import { Alert, Text, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { api } from "./services/api";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import { CartProvider } from "./context/CartContext";
import { SelectedRestaurantProvider } from "./context/SelectedRestaurantContext";

import HomeScreen from "./screens/HomeScreen";
import RestaurantsScreen from "./screens/RestaurantsScreen";
import RestaurantMenuScreen from "./screens/RestaurantMenuScreen";
import CartScreen from "./screens/CartScreen";
import OrdersScreen from "./screens/OrdersScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import EditRestaurantScreen from "./screens/EditRestaurantScreen";

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const prev = useRef({});

  const notify = (title, msg) => {
    if (Platform.OS === "web") {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body: msg });
      }
    } else {
      Alert.alert(title, msg);
    }
  };

  useEffect(() => {
    (async () => {
      const u = await AsyncStorage.getItem("currentUser");
      if (u) setCurrentUser(JSON.parse(u));
    })();
  }, []);

  const registerPush = async () => {
    try {
      if (Platform.OS === "web") return;

      const jwt = await AsyncStorage.getItem("token");
      if (!jwt) return;

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;

      const projectId =
        Constants.easConfig?.projectId ||
        Constants.expoConfig?.extra?.eas?.projectId ||
        "dcb362d8-2f1d-4be4-ba84-8a7a64ac4fe5";

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      await api.post(
        "/users/fcm-token",
        { token: tokenData.data },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      console.log("✅ PUSH REGISTERED");
    } catch (e) {
      console.log("❌ PUSH ERROR:", e);
    }
  };

  useEffect(() => {
    if (currentUser) {
      const t = setTimeout(registerPush, 800);
      return () => clearTimeout(t);
    }
  }, [currentUser]);

  useEffect(() => {
    if (Platform.OS === "web") return;

    const sub = Notifications.addNotificationReceivedListener((n) => {
      notify(n.request.content.title, n.request.content.body);
    });

    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const check = async () => {
      const res = await api.get("/orders");

      res.data.forEach((o) => {
        const old = prev.current[o._id];

        if (old && old !== "completed" && o.status === "completed") {
          notify("🎉 Order ready", "Your order is completed!");
        }

        prev.current[o._id] = o.status;
      });
    };

    check();
    const id = setInterval(check, 4000);
    return () => clearInterval(id);
  }, [currentUser]);

  const logout = async (nav) => {
    await AsyncStorage.clear();
    setCurrentUser(null);
    nav.replace("Login");
  };

  const header = ({ navigation }) => ({
    headerTitle: () => (
      <Text style={{ fontSize: 18, fontWeight: "700" }}>
        🍔 Food Delivery
      </Text>
    ),

    headerLeft: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={{ marginLeft: 15 }}
      >
        <Ionicons name="home-outline" size={24} color="black" />
      </TouchableOpacity>
    ),

    headerRight: () => (
      <>
        <TouchableOpacity
          onPress={() => navigation.navigate("Cart")}
          style={{ marginRight: 15 }}
        >
          <Ionicons name="cart-outline" size={24} color="black" />
        </TouchableOpacity>

        {currentUser && (
          <TouchableOpacity
            onPress={() => logout(navigation)}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="log-out-outline" size={24} color="black" />
          </TouchableOpacity>
        )}
      </>
    ),
  });

  return (
    <CartProvider currentUser={currentUser}>
      <SelectedRestaurantProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={currentUser ? "Home" : "Login"}
            screenOptions={{
              headerShown: true,

              // 🔥 SMOOTH ANIMATION LIKE UBER / GLOVO
              gestureEnabled: true,
              cardStyleInterpolator:
                CardStyleInterpolators.forHorizontalIOS,
            }}
          >

            <Stack.Screen name="Home" options={header} component={HomeScreen} />
            <Stack.Screen name="Restaurants" options={header} component={RestaurantsScreen} />
            <Stack.Screen name="RestaurantMenu" options={header} component={RestaurantMenuScreen} />

            <Stack.Screen name="Cart" options={header}>
              {(p) => <CartScreen {...p} currentUser={currentUser} />}
            </Stack.Screen>

            <Stack.Screen name="Orders" options={header} component={OrdersScreen} />

            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(p) => <LoginScreen {...p} setCurrentUser={setCurrentUser} />}
            </Stack.Screen>

            <Stack.Screen name="Register" options={{ headerShown: false }}>
              {(p) => <RegisterScreen {...p} setCurrentUser={setCurrentUser} />}
            </Stack.Screen>

            <Stack.Screen name="EditRestaurant" options={header} component={EditRestaurantScreen} />

          </Stack.Navigator>
        </NavigationContainer>
      </SelectedRestaurantProvider>
    </CartProvider>
  );
}