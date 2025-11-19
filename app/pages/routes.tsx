// pages/routes.tsx
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type RouteItem = {
    id: string;
    from: string;
    to: string;
    description: string;
    upvotes: number;
    downvotes: number;
    user: string;
};

export default function RoutesScreen() {
    const params = useLocalSearchParams<{ from?: string; to?: string }>();
    const from = params.from ?? "";
    const to = params.to ?? "";

    const dummyRoutes: RouteItem[] = [
        { id: "1", from: "شارع الطيران", to: "سيتي ستارز", description: "أسهل طريق من صلاح سالم للسيتي ستارز", upvotes: 10, downvotes: 2, user: "UserA" },
        { id: "2", from: "شارع الطيران", to: "سيتي ستارز", description: "أسرع طريق مع أقل زحمة", upvotes: 15, downvotes: 1, user: "UserB" },
        { id: "3", from: "شارع الطيران", to: "سيتي ستارز", description: "طريق جميل مع منظر النيل", upvotes: 5, downvotes: 0, user: "UserC" },
        { id: "4", from: "شارع الجيش", to: "سيتي ستارز", description: "مسافة قصيرة جداً", upvotes: 7, downvotes: 0, user: "UserD" },
    ];

    const [routes, setRoutes] = useState<RouteItem[]>([]);

    useEffect(() => {
        const filtered = dummyRoutes
            .filter(r => r.from === from && r.to === to)
            .sort((a, b) => b.upvotes - a.upvotes);
        setRoutes(filtered);
    }, [from, to]);

    const handleUpvote = (id: string) => {
        setRoutes(prev =>
            prev
                .map(r => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
                .sort((a, b) => b.upvotes - a.upvotes)
        );
    };

    const handleDownvote = (id: string) => {
        setRoutes(prev =>
            prev
                .map(r => (r.id === id ? { ...r, downvotes: r.downvotes + 1 } : r))
                .sort((a, b) => b.upvotes - a.upvotes)
        );
    };

    const renderRouteCard = (route: RouteItem) => (
        <View key={route.id} className="bg-white rounded-xl p-4 my-2 shadow-md border border-gray-200">
            <Text className="text-gray-700 text-lg mb-1 text-right">
                {route.from} → {route.to}
            </Text>
            <Text className="text-gray-500 mb-2 text-right">{route.description}</Text>
            <Text className="text-sm text-gray-400 mb-2 text-right">Added by: {route.user}</Text>
            <View className="flex-row-reverse items-center justify-between">
                <View className="flex-row-reverse space-x-reverse space-x-4">
                    <TouchableOpacity onPress={() => handleUpvote(route.id)} className="bg-green-100 px-3 py-1 rounded-lg ml-2">
                        <Text className="text-green-700 font-bold">👍 {route.upvotes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDownvote(route.id)} className="bg-red-100 px-3 py-1 rounded-lg">
                        <Text className="text-red-700 font-bold">👎 {route.downvotes}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 p-4 bg-pink-50 pt-20">


            {routes.length === 0 ? (
                <>
                    <Text className="text-xl font-bold text-purple-600 mb-4 text-right">
                        هو قالك فين؟؟
                    </Text>
                    <Text className="text-gray-500 text-right mt-10">
                        مفيش طرق متاحة للمسار ده دلوقتي
                    </Text>
                </>
            ) : (
                <>
                    <Text className="text-xl font-bold text-purple-600 mb-4 text-right">
                        الطرق اللي بيتفق عليها ٩ من كل ١٠ اطباء اسنان
                    </Text>
                    <FlatList
                        data={routes}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => renderRouteCard(item)}
                    />
                </>
            )}
        </View>
    );
}