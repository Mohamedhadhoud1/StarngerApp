import { FlatList, Text, TouchableOpacity, View } from "react-native";

const DUMMY_SIT = [
  { id: "1", name: "Al-Azhar Park", type: "Park" },
  { id: "2", name: "Cairo Opera House", type: "Cultural" },
];

export default function SitScreen() {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="bg-white p-4 rounded-lg mb-3 shadow">
      <Text className="text-lg font-bold text-gray-700">{item.name}</Text>
      <Text className="text-gray-500 mt-1">{item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4 pt-10">
      <FlatList
        data={DUMMY_SIT}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}