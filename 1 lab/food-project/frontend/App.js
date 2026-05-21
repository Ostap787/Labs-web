// frontend/App.js
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CartProvider } from "./context/CartContext";

// Екрани
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

  return (
    <CartProvider currentUser={currentUser}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Home">
            {props => <HomeScreen {...props} currentUser={currentUser} />}
          </Stack.Screen>
          <Stack.Screen name="Restaurants" component={RestaurantsScreen} />
          <Stack.Screen name="RestaurantMenu" component={RestaurantMenuScreen} />
          <Stack.Screen name="Cart">
            {props => <CartScreen {...props} currentUser={currentUser} />}
          </Stack.Screen>
          <Stack.Screen name="Orders" component={OrdersScreen} />
          <Stack.Screen name="Login">
            {props => <LoginScreen {...props} setCurrentUser={setCurrentUser} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="EditRestaurant" component={EditRestaurantScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}