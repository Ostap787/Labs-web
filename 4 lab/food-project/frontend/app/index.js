import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Link href="/restaurants">
        <Text style={{ fontSize: 20 }}>Go to Restaurants</Text>
      </Link>
    </View>
  );
}