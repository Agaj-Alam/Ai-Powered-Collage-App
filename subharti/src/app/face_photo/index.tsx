import ProfileDetails from "@/src/components/atoms/ProfileDetails";
import imagePath from "@/src/constraints/imagePath";
import { Stack } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

const index = () => {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Face Photo",
          headerTitleAlign: "center",
          headerShown: true,
        }}
      />

      <View className="flex-1 bg-gray-100">
        {/* Profile Card */}
        <View className="bg-white mt-4 mx-4 rounded-2xl pb-3">
          <ProfileDetails />
        </View>

        {/* Face Photo Card with Verified Overlay */}
        <View
          className="self-center mt-4 rounded-2xl overflow-hidden"
          style={{ width: 280, height: 380 }}
        >
          <Image
            source={imagePath.logo1}
            style={{ width: 280, height: 380 }}
            resizeMode="cover"
          />

          {/* Verified badge */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#4ade80", fontSize: 16 }}>✔</Text>
            <Text
              style={{
                color: "#4ade80",
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              Verified
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default index;
