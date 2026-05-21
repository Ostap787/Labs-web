// frontend/App.js
import React, { useState, useEffect } from "react";
import { Button, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { CartProvider } from "./context/CartContext";
import { SelectedRestaurantProvider } from "./context/SelectedRestaurantContext";

// Screens
import HomeScreen from "./screens/HomeScreen";
import RestaurantsScreen from "./screens/RestaurantsScreen";
import RestaurantMenuScreen from "./screens/RestaurantMenuScreen";
import CartScreen from "./screens/CartScreen";
import OrdersScreen from "./screens/OrdersScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import EditRestaurantScreen from "./screens/EditRestaurantScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem("currentUser");
        if (storedUser) setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.log("Failed to load user");
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  if (loadingUser) return null;

  const headerWithUser = ({ navigation }) => ({
    headerRight: () => (
      currentUser ? (
        <Button
          title="Logout"
          onPress={async () => {
            await AsyncStorage.removeItem("currentUser");
            setCurrentUser(null);
            navigation.replace("Login");
          }}
        />
      ) : null
    ),
    headerTitle: () => (
      currentUser ? <Text>👋 {currentUser.name}</Text> : null
    )
  });

  return (
    <CartProvider currentUser={currentUser}>
      <SelectedRestaurantProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={currentUser ? "Home" : "Login"}>

            <Stack.Screen
              name="Home"
              options={({ navigation }) => ({
                title: "Home",
                ...headerWithUser({ navigation }),
              })}
            >
              {props => <HomeScreen {...props} currentUser={currentUser} />}
            </Stack.Screen>

            <Stack.Screen
              name="Restaurants"
              component={RestaurantsScreen}
              options={({ navigation }) => headerWithUser({ navigation })}
            />

            <Stack.Screen
              name="RestaurantMenu"
              component={RestaurantMenuScreen}
              options={({ navigation }) => headerWithUser({ navigation })}
            />

            <Stack.Screen
              name="Cart"
              options={({ navigation }) => headerWithUser({ navigation })}
            >
              {props => <CartScreen {...props} currentUser={currentUser} />}
            </Stack.Screen>

            <Stack.Screen
              name="Orders"
              component={OrdersScreen}
              options={({ navigation }) => headerWithUser({ navigation })}
            />

            <Stack.Screen
              name="Login"
              options={{ headerShown: false }}
            >
              {props => <LoginScreen {...props} setCurrentUser={setCurrentUser} />}
            </Stack.Screen>

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="EditRestaurant"
              component={EditRestaurantScreen}
              options={({ navigation }) => headerWithUser({ navigation })}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </SelectedRestaurantProvider>
    </CartProvider>
  );
}