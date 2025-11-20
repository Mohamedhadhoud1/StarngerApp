// pages/go.tsx
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import areasData from "../../assets/data/areas.json";

type Place = {
  id: string;
  name: string;
  type: "street" | "transport" | "area" | "city" | "landmark";
};

export default function GoScreen() {
  const router = useRouter();

  const [fromText, setFromText] = useState<string>("");
  const [toText, setToText] = useState<string>("");
  const [fromSuggestions, setFromSuggestions] = useState<Place[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Place[]>([]);
  const [fromSelected, setFromSelected] = useState(false);
  const [toSelected, setToSelected] = useState(false);

  const allPlaces: Place[] = Object.values(areasData)
    .flat()
    .map((p) => {
      if (["street", "transport", "area", "city", "landmark"].includes(p.type)) {
        return p as Place;
      }
      return null;
    })
    .filter((p): p is Place => p !== null);

  const normalizeArabic = (text: string) => {
    return text
      .replace(/[أإآا]/g, "ا")
      .replace(/[ة]/g, "ه")
      .replace(/[ى]/g, "ي")
      .replace(/[ؤ]/g, "و")
      .replace(/[ئ]/g, "ي")
      .replace(/[گ]/g, "ك")
      .replace(/[‎]/g, "")
      .toLowerCase();
  };

  const filterSuggestions = (text: string) => {
    const normalized = normalizeArabic(text);
    return allPlaces.filter((place) => normalizeArabic(place.name).includes(normalized));
  };

  useEffect(() => {
    if (fromText.length > 0 && !fromSelected) setFromSuggestions(filterSuggestions(fromText));
    else setFromSuggestions([]);
  }, [fromText, fromSelected]);

  useEffect(() => {
    if (toText.length > 0 && !toSelected) setToSuggestions(filterSuggestions(toText));
    else setToSuggestions([]);
  }, [toText, toSelected]);

  const handleSelectSuggestion = (
    name: string,
    setText: React.Dispatch<React.SetStateAction<string>>,
    setSuggestions: React.Dispatch<React.SetStateAction<Place[]>>,
    setSelected: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setText(name);
    setSuggestions([]);
    setSelected(true);
  };

  const handleInputChange = (
    text: string,
    setText: React.Dispatch<React.SetStateAction<string>>,
    setSelected: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setText(text);
    setSelected(false);
  };

  const renderAddNew = (text: string, setText: React.Dispatch<React.SetStateAction<string>>) => (
    <TouchableOpacity
      className="p-2 bg-green-200 my-1 rounded-lg"
      onPress={() => alert(`Add "${text}" to the database later`)}
    >
      <Text className="text-green-900 font-bold text-sm text-right">➕ Add "{text}"</Text>
    </TouchableOpacity>
  );

  const renderSuggestionItem = (
    item: Place,
    query: string,
    setText: React.Dispatch<React.SetStateAction<string>>,
    setSuggestions: React.Dispatch<React.SetStateAction<Place[]>>,
    setSelected: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const normalizedQuery = normalizeArabic(query);
    const normalizedName = normalizeArabic(item.name);

    let matchStart = normalizedName.indexOf(normalizedQuery);
    if (matchStart === -1) matchStart = 0;
    const matchEnd = matchStart + normalizedQuery.length;

    let currentIndex = 0;
    let beforeMatch = "";
    let match = "";
    let afterMatch = "";

    for (let i = 0; i < item.name.length; i++) {
      const char = normalizeArabic(item.name[i]);
      if (currentIndex < matchStart) beforeMatch += item.name[i];
      else if (currentIndex >= matchStart && currentIndex < matchEnd) match += item.name[i];
      else afterMatch += item.name[i];
      currentIndex++;
    }

    return (
      <TouchableOpacity
        className="p-2 border-b border-gray-200"
        onPress={() => handleSelectSuggestion(item.name, setText, setSuggestions, setSelected)}
      >
        <Text className="text-gray-700 text-right">
          {beforeMatch}
          <Text className="text-purple-600 font-bold">{match}</Text>
          {afterMatch}
        </Text>
      </TouchableOpacity>
    );
  };

  const soundRef = useRef<Audio.Sound | null>(null);
  const playTimonSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      } else {
        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/audio/علي فين العزم.mp3")
        );
        soundRef.current = sound;
        await sound.playAsync();
      }
    } catch (err) {
      console.log("Error playing sound:", err);
    }
  };

  const renderInput = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    suggestions: Place[],
    setSuggestions: React.Dispatch<React.SetStateAction<Place[]>>,
    selected: boolean,
    setSelected: React.Dispatch<React.SetStateAction<boolean>>,
    placeholder: string,
    isToInput?: boolean
  ) => (
    <View className="relative mt-2">
      <View className="flex-row items-center border border-pink-400 rounded-xl p-0 bg-pink-50">
        {value.length > 0 && (
          <TouchableOpacity
            className="px-3"
            onPress={() => {
              setValue("");
              setSelected(false);
            }}
          >
            <Text className="text-gray-400 text-lg">✕</Text>
          </TouchableOpacity>
        )}
        <TextInput
          value={value}
          onFocus={() => isToInput && playTimonSound()}
          onChangeText={(text) => handleInputChange(text, setValue, setSelected)}
          placeholder={placeholder}
          className="flex-1 p-3 text-gray-800 text-base text-right"
        />
      </View>

      {!selected && value.length > 0 && suggestions.length === 0 && renderAddNew(value, setValue)}

      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            renderSuggestionItem(item, value, setValue, setSuggestions, setSelected)
          }
        />
      )}
    </View>
  );

  return (
    <View className="flex-1 p-4 bg-white">
      {/* From input */}
      <View className="flex-row-reverse items-center space-x-2 mt-8">
        <Text className="text-2xl font-bold text-purple-600 text-right flex-1">انت فين؟</Text>
      </View>
      {renderInput(
        fromText,
        setFromText,
        fromSuggestions,
        setFromSuggestions,
        fromSelected,
        setFromSelected,
        "اكتب مكانك الحالي"
      )}

      {/* To input with image */}
      <View className="flex-row-reverse items-center mt-6">
        <Text className="text-2xl font-bold text-purple-600 text-right mr-2">
          علي فين العزم؟
        </Text>
        <Image
          source={require("../../assets/images/علي فين العزم.jpeg")}
          className="w-10 h-10 rounded-full"
        />
      </View>
      {renderInput(
        toText,
        setToText,
        toSuggestions,
        setToSuggestions,
        toSelected,
        setToSelected,
        "اكتب وجهتك",
        true
      )}

      {/* Navigate to routes page */}
      <TouchableOpacity
        className="bg-purple-500 p-4 rounded-xl mt-6 items-center shadow-lg"
        onPress={() => {
          if (!fromText || !toText) return alert("Please enter both From and To");
          router.push(`/pages/routes?from=${encodeURIComponent(fromText)}&to=${encodeURIComponent(toText)}`);
        }}
      >
        <Text className="text-white font-bold text-lg">شوف الطرق</Text>
      </TouchableOpacity>
    </View>
  );
}