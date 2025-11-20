import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, Text, TouchableOpacity, View } from "react-native";

import { fetchRoutes, getUserVote, submitVote } from "../lib/routesService";

export default function RoutesScreen() {
    const params = useLocalSearchParams<{ from?: string; to?: string }>();
    const from = params.from ?? "";
    const to = params.to ?? "";

    const [routes, setRoutes] = useState<any[]>([]);
    const [userVotes, setUserVotes] = useState<Record<string, 1 | -1 | null>>({});
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState<string | null>(null);

    const fakeUserId = "34fde20e-5b16-4b15-af16-00d8b37735d3";

    // refs for animations
    const scaleAnim = useRef<Record<string, Animated.Value>>({}).current;

    const loadRoutes = async () => {
        try {
            setLoading(true);
            const result = await fetchRoutes(from, to);
            setRoutes(result);

            const voteMap: Record<string, 1 | -1 | null> = {};
            for (const r of result) {
                voteMap[r.id] = await getUserVote(r.id, fakeUserId);

                // initialize animation refs if not exist
                if (!scaleAnim[r.id]) scaleAnim[r.id] = new Animated.Value(1);
            }
            setUserVotes(voteMap);
        } catch (error) {
            console.log("Error loading routes:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (from && to) loadRoutes();
    }, [from, to]);

    const animateButton = (routeId: string) => {
        if (!scaleAnim[routeId]) scaleAnim[routeId] = new Animated.Value(1);
        Animated.sequence([
            Animated.timing(scaleAnim[routeId], { toValue: 1.2, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim[routeId], { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
    };

    const handleVote = async (routeId: string, vote: 1 | -1) => {
        if (voting) return;
        setVoting(routeId);

        const prevVote = userVotes[routeId] ?? null;

        // Optimistic UI update
        setRoutes((prev) =>
            prev.map((r) => {
                if (r.id !== routeId) return r;

                let upvotes = r.upvotes;
                let downvotes = r.downvotes;

                if (prevVote === 1) upvotes -= 1;
                if (prevVote === -1) downvotes -= 1;

                if (vote === 1) upvotes += 1;
                if (vote === -1) downvotes += 1;

                return { ...r, upvotes, downvotes };
            })
        );
        setUserVotes((prev) => ({ ...prev, [routeId]: vote }));

        animateButton(routeId);

        // Server call
        const res = await submitVote(routeId, fakeUserId, vote);
        if (res.error) {
            // rollback if failed
            setRoutes((prev) =>
                prev.map((r) => {
                    if (r.id !== routeId) return r;

                    let upvotes = r.upvotes;
                    let downvotes = r.downvotes;

                    if (vote === 1) upvotes -= 1;
                    if (vote === -1) downvotes -= 1;
                    if (prevVote === 1) upvotes += 1;
                    if (prevVote === -1) downvotes += 1;

                    return { ...r, upvotes, downvotes };
                })
            );
            setUserVotes((prev) => ({ ...prev, [routeId]: prevVote }));
            console.log("Vote failed:", res.error);
        }

        setVoting(null);
    };

    const renderRouteCard = (route: any) => {
        const userVote = userVotes[route.id];
        if (!scaleAnim[route.id]) scaleAnim[route.id] = new Animated.Value(1);

        return (
            <View
                key={route.id}
                className="bg-white rounded-xl p-4 my-2 shadow-md border border-gray-200"
            >
                <Text className="text-gray-700 text-lg mb-1 text-right">
                    {route.from} → {route.to}
                </Text>

                <Text className="text-gray-500 mb-2 text-right">
                    {route.description}
                </Text>

                <Text className="text-sm text-gray-400 mb-2 text-right">
                    مضاف بواسطة: {route.user_name}
                </Text>

                <View className="flex-row items-center justify-between">
                    <View className="flex-row-reverse space-x-4">

                        {/* UPVOTE BUTTON */}
                        <Animated.View style={{ transform: [{ scale: scaleAnim[route.id] }] }}>
                            <TouchableOpacity
                                disabled={voting === route.id}
                                onPress={() => handleVote(route.id, 1)}
                                className={`px-3 py-1 rounded-lg ml-2 ${userVote === 1 ? "bg-green-400" : "bg-green-100"
                                    }`}
                            >
                                <Text
                                    className={`font-bold ${userVote === 1 ? "text-green-900" : "text-green-700"
                                        }`}
                                >
                                    👍 {route.upvotes}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* DOWNVOTE BUTTON */}
                        <Animated.View style={{ transform: [{ scale: scaleAnim[route.id] }] }}>
                            <TouchableOpacity
                                disabled={voting === route.id}
                                onPress={() => handleVote(route.id, -1)}
                                className={`px-3 py-1 rounded-lg ${userVote === -1 ? "bg-red-400" : "bg-red-100"
                                    }`}
                            >
                                <Text
                                    className={`font-bold ${userVote === -1 ? "text-red-900" : "text-red-700"
                                        }`}
                                >
                                    👎 {route.downvotes}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>

                    </View>
                </View>
            </View>
        );
    };

    if (loading)
        return (
            <Text className="text-center mt-10 text-xl">
                جاري تحميل الطرق...
            </Text>
        );

    return (
        <View className="flex-1 p-4 bg-pink-50 pt-20">
            {routes.length === 0 ? (
                <>
                    <Text className="text-xl font-bold text-purple-600 mb-4 text-right">
                        هو قالّك فين؟؟
                    </Text>
                    <Text className="text-gray-500 text-right mt-10">
                        مفيش طرق متاحة للمسار ده دلوقتي
                    </Text>
                </>
            ) : (
                <>
                    <Text className="text-xl font-bold text-purple-600 mb-4 text-right">
                        الطرق اللي بيتفق عليها ٩ من كل ١٠ أطباء أسنان
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