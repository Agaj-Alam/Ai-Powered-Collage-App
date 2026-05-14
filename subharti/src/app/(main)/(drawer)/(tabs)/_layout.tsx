import imagePath from "@/src/constraints/imagePath";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Tabs } from "expo-router/tabs";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

const _layout = () => {
  const navigation = useNavigation();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        title: "",

        headerStyle: {
          // backgroundColor: "#4338CA",
          backgroundColor: "#2f2fa2", 
        },

        headerTintColor: "#fff",
        headerTitleAlign: "center",

        headerTitle: () => (
          <Image
            source={imagePath.header_logo}
            className="w-40 h-16"
            resizeMode="contain"
          />
        ),

        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            className="ml-4"
          >
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <TouchableOpacity className="mr-4">
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        ),
      }}
    >



      
      <Tabs.Screen
        name="payment"
        options={{
          title: "Payment",
          tabBarIcon: () => (
            <Image
              source={imagePath.payment}
              className="w-8 h-9"
              resizeMode="stretch"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: () => (
            <Image
              source={imagePath.learn}
              className="w-11 h-11"
              resizeMode="stretch"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: () => (
            <View className="bg-indigo-700 w-16 h-16 rounded-full items-center justify-center -mt-8">
              <Ionicons name="home" size={28} color="white" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="exam"
        options={{
          title: "Exam",
          tabBarIcon: () => (
            <Image
              source={imagePath.exam}
              className="w-11 h-11"
              resizeMode="stretch"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => (
            <Image
              source={imagePath.profile}
              className="w-8 h-9"
              resizeMode="stretch"
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
