import ProfileDetails from "@/src/components/atoms/ProfileDetails";
import AddressDetailsTable from "@/src/components/molecule/AddressDetailsTable";
import CollegeDetailsTable from "@/src/components/molecule/CollegeDetailsTable";
import PersonalDetailsTable from "@/src/components/molecule/PersonalDetailsTable";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { key: "personal", label: "Personal Details" },
    { key: "address", label: "Address Details" },
    { key: "college", label: "College Details" },
  ];

  return (
    <View className="flex-1 bg-white">
      {/* 🔹 Top Profile */}
      <ProfileDetails />

      {/* 🔹 Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: 8,
        }}
        className="border-b border-gray-400 mt-6"
        style={{ maxHeight: 52, }} // ✅ use maxHeight instead of fixed h-14
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 mr-4 rounded-full ${
              // ✅ reduced py-2 → py-1.5
              activeTab === tab.key ? "bg-indigo-100" : "bg-white"
            }`}
          >
            <Text
              className={`text-lg font-bold ${
                // ✅ reduced text-lg → text-base
                activeTab === tab.key
                  ? "text-indigo-900 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* 🔹 Table Content */}
      <View className="flex-1">
        {activeTab === "personal" && <PersonalDetailsTable />}
        {activeTab === "address" && <AddressDetailsTable />}
        {activeTab === "college" && <CollegeDetailsTable />}
      </View>
    </View>
  );
};

export default Profile;
