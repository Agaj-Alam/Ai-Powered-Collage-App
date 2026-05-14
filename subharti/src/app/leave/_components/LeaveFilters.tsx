import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";

const filters = ["All", "Pending", "Approved", "Rejected"];

type Props = {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
};

const LeaveFilters = ({ activeFilter, onFilterChange }: Props) => {
  return (
    <View className="px-4 pt-4 pb-2">
      <View className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {filters.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => onFilterChange(item)}
              className={`flex-1 px-5 py-2.5 rounded-3xl items-center ${
                activeFilter === item
                  ? "bg-indigo-800"
                  : "bg-gray-50"
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  activeFilter === item
                    ? "text-white"
                    : "text-gray-500"
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
export default LeaveFilters;
