// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "./global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        {/* Tabs navigator */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* Routes page outside tabs */}
        <Stack.Screen
          name="pages/routes"
          options={{
            headerShown: false,
            headerTitle: "الطرق المتاحة",
            headerStyle: { backgroundColor: "#f9f5ff" },
            headerTitleStyle: { color: "#6b21a8", fontWeight: "bold" },
          }}
        />
      </Stack>
    </>
  );
}