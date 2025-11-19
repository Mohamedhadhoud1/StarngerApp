import { Text, View } from "react-native";

export default function GoScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-700 mb-2">🚗 كيفية الوصول</Text>
      <Text className="text-base text-gray-500 text-center">
        اكتشف الطرق والمواصلات للوصول للأماكن المخفية بسهولة.
      </Text>
    </View>
  );
}