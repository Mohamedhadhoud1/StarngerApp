import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center  bg-gray-50 p-4">
      <Text className="text-3xl font-bold text-gray-700">Strange App 🧭</Text>
      <Text className="text-base text-gray-500 mt-2">اكتشف الأماكن المخفية حولك</Text>
    </View>
  );
}