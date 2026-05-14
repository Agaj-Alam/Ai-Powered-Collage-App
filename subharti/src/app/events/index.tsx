import { Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const index = () => {
  const openEvents = () => {
    WebBrowser.openBrowserAsync("https://news.subharti.org/category/events/");
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: "E-Events",
          headerTitleAlign: "center",
          headerShown: true,
        }}
      />

      <View className="p-4">
        <View className="flex-row items-center justify-between bg-gray-100 p-4 rounded-2xl">
          {/* Left Content */}
          <View className="flex-1 pr-2 flex-row">
            <Text className="text-indigo-700 font-bold text-base mt-1">#1</Text>
            <Text className="text-base font-semibold mt-1 ml-2">
              Notice-National Days with Celebrations-2026
            </Text>
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={openEvents}
            className="bg-indigo-800 px-5 py-2 rounded-xl"
          >
            <Text className="text-white font-semibold text-lg">Open</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default index;
