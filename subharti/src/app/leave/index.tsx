import { Stack } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import ApplyButton from "./_components/ApplyButton";
import LeaveCard from "./_components/LeaveCard";
import LeaveFilters from "./_components/LeaveFilters";
import { loadMyLeaves } from "@/src/redux/leaveSlice";

const filterLeaves = (leaves: any[], filter: string) => {
  if (filter === "All") return leaves;
  if (filter === "Pending") return leaves.filter((l: any) => l.status.includes("PENDING"));
  if (filter === "Approved") return leaves.filter((l: any) => l.status === "FULLY_APPROVED");
  if (filter === "Rejected") return leaves.filter((l: any) => l.status.includes("REJECTED"));
  return leaves;
};

const index = () => {
  const dispatch = useDispatch();
  const { leaves, loading, error } = useSelector((state: any) => state.leave);
  const [activeFilter, setActiveFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  // Refresh leaves every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      dispatch(loadMyLeaves() as any);
    }, [dispatch])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(loadMyLeaves() as any);
    setRefreshing(false);
  }, [dispatch]);

  const filteredLeaves = filterLeaves(leaves, activeFilter);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Leave Application",
          headerTitleAlign: "center",
          headerShown: true,
          headerStyle: { backgroundColor: "#2f2fa2" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <View className="flex-1 bg-gray-100">
        <LeaveFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {loading && !refreshing ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text className="text-gray-500 mt-4">Loading leaves...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center px-6">
            <Text className="text-red-500 text-center">{error}</Text>
          </View>
        ) : filteredLeaves.length === 0 ? (
          <View className="flex-1 justify-center items-center px-6">
            <Text className="text-gray-400 text-lg text-center">
              {activeFilter === "All" 
                ? "No leave applications yet.\nTap + to apply for leave."
                : `No ${activeFilter.toLowerCase()} leaves found.`
              }
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={true}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4f46e5"]} />
            }
            contentContainerStyle={{
              padding: 16,
              paddingTop: 12,
              paddingBottom: 120,
            }}
          >
            {filteredLeaves.map((leave: any) => (
              <LeaveCard key={leave.id} leave={leave} />
            ))}
          </ScrollView>
        )}

        <ApplyButton />
      </View>
    </>
  );
};

export default index;
