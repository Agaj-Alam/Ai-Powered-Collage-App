// import { View, Text } from 'react-native'
// import React from 'react'
// import { Stack } from 'expo-router'

// const index = () => {
//   return (
//     <>
//     <Stack.Screen
//         options={{
//           title: "Important Contacts",
//           headerTitleAlign: "center",
//           headerShown: true,
//         }}
//       />

//     </>
//   )
// }

// export default index

import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import ContactCard from "./_components/Contactcard";

const EMPLOYEES = [
  {
    name: "Mr. Ankur",
    specialization: "System Analyst (Information Technology)",
    ext: "2923",
    picture: require("@/src/assets/images/Employee.png"),
  },
  {
    name: "Mr. Vivek Tiwari",
    specialization: "C.T.O. (Information Technology)",
    ext: "2930",
    mobile: "8755903333",
    picture: require("@/src/assets/images/Employee.png"),
  },
  {
    name: "Mr. Arvind Singh",
    specialization: "Network Engineer (Information Technology)",
    ext: "2929",
    mobile: "6398208037",
    picture: require("@/src/assets/images/Employee.png"),
  },
  {
    name: "Mr. Rajesh Kumar",
    specialization: "Network Administrator (Information Technology)",
    ext: "2928",
    mobile: "9389591475",
    picture: require("@/src/assets/images/Employee.png"),
  },
  {
    name: "Mr. Roop Singh",
    specialization: "Software Developer (Information Technology)",
    ext: "2922",
    picture: require("@/src/assets/images/Employee.png"),
  },
  {
    name: "Mr. Harish Kumar",
    specialization: "Assistant Registrar (Principal)",
    ext: "2910",
    mobile: "9871234560",
    picture: require("@/src/assets/images/Employee.png"),
  },
];

const OFFICE = [
  {
    name: "Reception",
    specialization: "Main Office",
    ext: "2900",
    mobile: "9000000001",
    picture: require("@/src/assets/images/Employee.png"),
  },
  {
    name: "Security Desk",
    specialization: "Security Department",
    ext: "2901",
    picture: require("@/src/assets/images/Employee.png"),
  },
  {
    name: "HR Department",
    specialization: "Human Resources",
    ext: "2905",
    mobile: "9000000002",
    picture: require("@/src/assets/images/Employee.png"),
  },
];

export default function ImportantContactsScreen() {
  const [tab, setTab] = useState("employee");
  const [search, setSearch] = useState("");

  const data = (tab === "employee" ? EMPLOYEES : OFFICE).filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.specialization.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Important Contacts",
          headerTitleAlign: "center",
          headerShown: true,
        }}
      />

      <View className="flex-1 bg-gray-100">
        {/* Tabs */}
        <View className="flex-row bg-white border-b border-gray-200 px-4 py-2 gap-1">
          {["employee", "office"].map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl items-center ${tab === t ? "bg-indigo-800" : ""}`}
            >
              <Text
                className={`font-semibold capitalize ${tab === t ? "text-white" : "text-gray-600"}`}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Search */}
        <View className="px-4 py-3">
          <View className="flex-row items-center bg-gray-200 rounded-full px-4 py-2.5 gap-2">
            <Ionicons name="search-outline" size={16} color="#9ca3af" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search contact"
              placeholderTextColor="#9ca3af"
              className="flex-1 text-gray-800 text-sm"
            />
          </View>
        </View>

        {/* List */}
        <FlatList
          data={data}
          scrollEnabled
          keyExtractor={(_, i) => String(i)}
          className="mx-2 rounded-xl bg-white"
          renderItem={({ item }) => (
            <ContactCard
              name={item.name}
              specialization={item.specialization}
              ext={item.ext}
              mobile={item.mobile}
              picture={item.picture}
            />
          )}
          ListEmptyComponent={
            <Text className="text-center text-gray-400 py-10">
              No contacts found
            </Text>
          }
        />
      </View>
    </>
  );
}
