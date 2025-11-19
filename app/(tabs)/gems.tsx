import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { fetchNearbyPlacesOSM } from "../../services/osmServices";

export default function GemsScreen() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // مؤقتًا القاهرة
  const latitude = 30.0444;
  const longitude = 31.2357;

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchNearbyPlacesOSM({ lat: latitude, lng: longitude, radius: 1000, type: "cafe" });
        setPlaces(data);
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    const name = item.tags?.name || "Unnamed place";
    const desc = item.tags?.amenity || "";
    return (
      <TouchableOpacity className="bg-white p-4 mb-3 rounded-xl shadow-md" style={{ elevation: 3 }}>
        <Text className="text-lg font-bold text-gray-700">{name}</Text>
        <Text className="text-gray-500 mt-1">{desc}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF6F61" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <FlatList
        data={places}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}