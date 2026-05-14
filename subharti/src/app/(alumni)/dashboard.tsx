import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { logout } from "@/src/redux/auth/authSlice";
import { clearUser } from "@/src/redux/userSlice";
import { clearLeaves } from "@/src/redux/leaveSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function AlumniDashboard() {
  const user = useSelector((s: any) => s.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    dispatch(logout());
    dispatch(clearUser());
    dispatch(clearLeaves());
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#2f2fa2] px-5 pt-14 pb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-white text-xl font-bold">Alumni Dashboard</Text>
          <Text className="text-indigo-200 mt-1">{user.name || "Alumni"}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} className="bg-white/20 p-2 rounded-full">
          <Ionicons name="log-out-outline" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="school-outline" size={80} color="#2f2fa2" />
        <Text className="text-2xl font-bold text-gray-800 mt-4">Welcome, {user.name || "Alumni"}</Text>
        <Text className="text-gray-500 text-center mt-2">
          View your academic records and certificates here.
        </Text>

        <View className="mt-8 w-full gap-y-4">
          <TouchableOpacity className="bg-white border border-gray-200 rounded-2xl p-5 flex-row items-center">
            <Ionicons name="document-text-outline" size={28} color="#2f2fa2" />
            <View className="ml-4">
              <Text className="text-lg font-bold text-gray-800">Academic Records</Text>
              <Text className="text-gray-500 text-sm">View your past results</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white border border-gray-200 rounded-2xl p-5 flex-row items-center">
            <Ionicons name="ribbon-outline" size={28} color="#2f2fa2" />
            <View className="ml-4">
              <Text className="text-lg font-bold text-gray-800">Certificates</Text>
              <Text className="text-gray-500 text-sm">Download your certificates</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
