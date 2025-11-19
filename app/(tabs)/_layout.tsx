import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF6F61",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="go"
        options={{
          title: "Go",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="directions" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="eat"
        options={{
          title: "Eat",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="restaurant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sit"
        options={{
          title: "Sit",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event-seat" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gems"
        options={{
          title: "Gems",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="stars" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}