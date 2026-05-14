import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
  ActivityIndicator, TextInput, Modal, RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { fetchDeanPending, fetchDeanHistory, approveDeanLeave, rejectDeanLeave } from "@/src/services/api";
import { logout } from "@/src/redux/auth/authSlice";
import { clearUser } from "@/src/redux/userSlice";
import { clearLeaves } from "@/src/redux/leaveSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const DeanDashboard = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [historyLeaves, setHistoryLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);

  const loadLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const [pending, history] = await Promise.all([
        fetchDeanPending(),
        fetchDeanHistory(),
      ]);
      setLeaves(pending);
      setHistoryLeaves(history);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  const handleAction = async (approve: boolean) => {
    try {
      if (approve) await approveDeanLeave(selectedLeave.id, remarks);
      else await rejectDeanLeave(selectedLeave.id, remarks);
      
      Alert.alert("Success", `Leave ${approve ? 'Approved' : 'Rejected'}`);
      setModalVisible(false);
      setRemarks("");
      loadLeaves();
    } catch (error) {
      Alert.alert("Error", "Action failed");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    dispatch(logout());
    dispatch(clearUser());
    dispatch(clearLeaves());
    router.replace("/(auth)/login");
  };

  const getStatusBadge = (status: string) => {
    if (status === "FULLY_APPROVED") return { label: "Approved", bg: "bg-green-100", text: "text-green-700" };
    if (status.includes("REJECTED")) return { label: "Rejected", bg: "bg-red-100", text: "text-red-700" };
    if (status.includes("PENDING")) return { label: "Pending", bg: "bg-orange-100", text: "text-orange-700" };
    return { label: status, bg: "bg-gray-100", text: "text-gray-700" };
  };

  const displayLeaves = activeTab === "pending" ? leaves : historyLeaves;

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 p-5"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadLeaves} />}
    >
      {/* Header */}
      <View className="bg-[#2f2fa2] -mx-5 -mt-5 px-5 pt-14 pb-6 mb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-white text-xl font-bold">Dean Dashboard</Text>
          <Text className="text-indigo-200 mt-1">{user?.name || "Dean"}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} className="bg-white/20 p-2 rounded-full">
          <Ionicons name="log-out-outline" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tab toggle */}
      <View className="flex-row mb-6 bg-gray-200 rounded-2xl p-1">
        <TouchableOpacity 
          onPress={() => setActiveTab("pending")} 
          className={`flex-1 py-3 rounded-xl items-center ${activeTab === "pending" ? "bg-indigo-600" : ""}`}
        >
          <Text className={`font-bold ${activeTab === "pending" ? "text-white" : "text-gray-500"}`}>
            Pending ({leaves.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab("history")} 
          className={`flex-1 py-3 rounded-xl items-center ${activeTab === "history" ? "bg-indigo-600" : ""}`}
        >
          <Text className={`font-bold ${activeTab === "history" ? "text-white" : "text-gray-500"}`}>
            History ({historyLeaves.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" />
      ) : displayLeaves.length === 0 ? (
        <Text className="text-center text-gray-400 mt-10">
          {activeTab === "pending" ? "No pending requests" : "No history yet"}
        </Text>
      ) : (
        displayLeaves.map((leave) => {
          const badge = getStatusBadge(leave.status);
          return (
            <View key={leave.id} className="bg-white p-5 rounded-3xl mb-4 shadow-sm border border-gray-100">
              <View className="flex-row justify-between mb-3">
                <Text className="font-bold text-gray-800">{leave.studentName}</Text>
                <View className="flex-row items-center">
                  <View className={`px-3 py-1 rounded-full mr-2 ${badge.bg}`}>
                    <Text className={`font-bold text-xs ${badge.text}`}>{badge.label}</Text>
                  </View>
                  <Text className="text-indigo-600 font-bold text-xs">{leave.leaveType}</Text>
                </View>
              </View>
              <Text className="text-gray-500 text-sm mb-4">{leave.reason}</Text>
              {activeTab === "pending" && (
                <TouchableOpacity 
                  onPress={() => { setSelectedLeave(leave); setModalVisible(true); }}
                  className="bg-indigo-600 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">Review Request</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white p-8 rounded-t-[40px]">
            <Text className="text-xl font-bold mb-4">Add Remarks</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-2xl mb-6 h-32"
              multiline
              placeholder="Your remarks..."
              value={remarks}
              onChangeText={setRemarks}
            />
            <View className="flex-row space-x-3">
              <TouchableOpacity onPress={() => handleAction(false)} className="flex-1 bg-red-50 py-4 rounded-2xl items-center">
                <Text className="text-red-600 font-bold">Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAction(true)} className="flex-1 bg-indigo-600 py-4 rounded-2xl items-center">
                <Text className="text-white font-bold">Approve</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)} className="mt-4 items-center">
              <Text className="text-gray-400">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default DeanDashboard;
