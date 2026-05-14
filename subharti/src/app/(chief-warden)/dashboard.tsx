import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
  ActivityIndicator, TextInput, Modal, RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import {
  fetchChiefWardenPending, fetchChiefWardenHistory,
  fetchPendingWardenLeaves,
  approveChiefWardenLeave, rejectChiefWardenLeave,
} from "@/src/services/api";
import { logout } from "@/src/redux/auth/authSlice";
import { clearUser } from "@/src/redux/userSlice";
import { clearLeaves } from "@/src/redux/leaveSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const ChiefWardenDashboard = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [historyLeaves, setHistoryLeaves] = useState<any[]>([]);
  const [wardenLeaves, setWardenLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, h, w] = await Promise.all([
        fetchChiefWardenPending(), fetchChiefWardenHistory(), fetchPendingWardenLeaves()
      ]);
      setLeaves(p); setHistoryLeaves(h); setWardenLeaves(w);
    } catch (e) { console.log(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleAction = async (approve: boolean) => {
    try {
      if (approve) await approveChiefWardenLeave(selectedLeave.id, remarks);
      else await rejectChiefWardenLeave(selectedLeave.id, remarks);
      Alert.alert("Success", `Leave ${approve ? 'Fully Approved' : 'Rejected'}`);
      setModalVisible(false); setRemarks(""); loadAll();
    } catch (e) { Alert.alert("Error", "Action failed"); }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    dispatch(logout()); dispatch(clearUser()); dispatch(clearLeaves());
    router.replace("/(auth)/login");
  };

  const badge = (s: string) => {
    if (s === "FULLY_APPROVED") return { l: "Approved", b: "bg-green-100", t: "text-green-700" };
    if (s.includes("REJECTED")) return { l: "Rejected", b: "bg-red-100", t: "text-red-700" };
    return { l: "Pending", b: "bg-orange-100", t: "text-orange-700" };
  };

  const tabs = [
    { key: "pending", label: "Students", count: leaves.length },
    { key: "warden", label: "Warden", count: wardenLeaves.length },
    { key: "history", label: "History", count: historyLeaves.length },
  ];
  const displayLeaves = activeTab === "pending" ? leaves : activeTab === "warden" ? wardenLeaves : historyLeaves;

  return (
    <ScrollView className="flex-1 bg-gray-50 p-5" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadAll} />}>
      <View className="bg-[#2f2fa2] -mx-5 -mt-5 px-5 pt-14 pb-6 mb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-white text-xl font-bold">Chief Warden</Text>
          <Text className="text-indigo-200 mt-1">{user?.name || "Chief Warden"}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} className="bg-white/20 p-2 rounded-full">
          <Ionicons name="log-out-outline" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-row mb-6 bg-gray-200 rounded-2xl p-1">
        {tabs.map(t => (
          <TouchableOpacity key={t.key} onPress={() => setActiveTab(t.key)} className={`flex-1 py-3 rounded-xl items-center ${activeTab === t.key ? "bg-indigo-600" : ""}`}>
            <Text className={`font-bold text-xs ${activeTab === t.key ? "text-white" : "text-gray-500"}`}>{t.label} ({t.count})</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? <ActivityIndicator size="large" color="#4f46e5" /> : displayLeaves.length === 0 ? (
        <Text className="text-center text-gray-400 mt-10">No {activeTab} items</Text>
      ) : displayLeaves.map(lv => {
        const b = badge(lv.status);
        return (
          <View key={lv.id} className="bg-white p-5 rounded-3xl mb-4 shadow-sm border border-gray-100">
            <View className="flex-row justify-between mb-3">
              <Text className="font-bold text-gray-800">{lv.studentName}</Text>
              <View className={`px-3 py-1 rounded-full ${b.b}`}><Text className={`font-bold text-xs ${b.t}`}>{b.l}</Text></View>
            </View>
            <Text className="text-gray-500 text-sm mb-1">{lv.reason}</Text>
            {lv.deanRemarks && <Text className="text-indigo-500 text-xs">Dean: {lv.deanRemarks}</Text>}
            {lv.wardenRemarks && <Text className="text-indigo-500 text-xs mb-4">Warden: {lv.wardenRemarks}</Text>}
            {(activeTab === "pending" || activeTab === "warden") && (
              <TouchableOpacity onPress={() => { setSelectedLeave(lv); setModalVisible(true); }} className="bg-indigo-600 py-3 rounded-xl items-center">
                <Text className="text-white font-bold">Final Review</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50"><View className="bg-white p-8 rounded-t-[40px]">
          <Text className="text-xl font-bold mb-4">Final Remarks</Text>
          <TextInput className="bg-gray-100 p-4 rounded-2xl mb-6 h-32" multiline placeholder="Remarks..." value={remarks} onChangeText={setRemarks} />
          <View className="flex-row space-x-3">
            <TouchableOpacity onPress={() => handleAction(false)} className="flex-1 bg-red-50 py-4 rounded-2xl items-center"><Text className="text-red-600 font-bold">Reject</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => handleAction(true)} className="flex-1 bg-indigo-600 py-4 rounded-2xl items-center"><Text className="text-white font-bold">Fully Approve</Text></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(false)} className="mt-4 items-center"><Text className="text-gray-400">Cancel</Text></TouchableOpacity>
        </View></View>
      </Modal>
    </ScrollView>
  );
};

export default ChiefWardenDashboard;
