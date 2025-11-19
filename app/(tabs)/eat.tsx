import { FlatList, Text, TouchableOpacity, View } from "react-native";

const DUMMY_EAT = [
  { id: "1", name: "El-Wahy Restaurant", type: "restaurant" },
  { id: "2", name: "Cafe Riche", type: "cafe" },
];

export default function EatScreen() {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="bg-white p-4 rounded-lg mb-3 shadow">
      <Text className="text-lg font-bold text-gray-700">{item.name}</Text>
      <Text className="text-gray-500 mt-1">{item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <FlatList
        data={DUMMY_EAT}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}