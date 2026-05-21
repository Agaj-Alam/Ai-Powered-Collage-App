import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
  ActivityIndicator, TextInput, Modal, RefreshControl,
  Dimensions, Animated, StatusBar, Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { fetchDeanPending, fetchDeanHistory, approveDeanLeave, rejectDeanLeave } from "@/src/services/api";
import { logout } from "@/src/redux/auth/authSlice";
import { clearUser } from "@/src/redux/userSlice";
import { clearLeaves } from "@/src/redux/leaveSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

// ─── Stat Card ────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, gradient }: any) => (
  <LinearGradient
    colors={gradient}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    className="flex-1 rounded-2xl p-4 mx-1"
    style={{
      shadowColor: gradient[0],
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    }}
  >
    <View className="bg-white/20 w-10 h-10 rounded-xl items-center justify-center mb-3">
      <Ionicons name={icon} size={20} color="white" />
    </View>
    <Text className="text-white/80 text-xs font-semibold">{label}</Text>
    <Text className="text-white text-2xl font-bold mt-1">{value}</Text>
  </LinearGradient>
);

// ═══════════════════════════════════════════════════════════════════
const DeanDashboard = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [historyLeaves, setHistoryLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  const tabIndicator = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    Animated.spring(tabIndicator, {
      toValue: activeTab === "pending" ? 0 : 1,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
  }, [activeTab]);

  const switchTab = (tab: string) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setActiveTab(tab);
  };

  const handleAction = async (approve: boolean) => {
    try {
      if (approve) await approveDeanLeave(selectedLeave.id, remarks);
      else await rejectDeanLeave(selectedLeave.id, remarks);
      Alert.alert("✅ Success", `Leave ${approve ? 'Approved' : 'Rejected'} successfully!`);
      setModalVisible(false);
      setRemarks("");
      loadLeaves();
    } catch (error) {
      Alert.alert("❌ Error", "Action failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: async () => {
        await AsyncStorage.removeItem("token");
        dispatch(logout());
        dispatch(clearUser());
        dispatch(clearLeaves());
        router.replace("/(auth)/login");
      }}
    ]);
  };

  const getStatusBadge = (status: string) => {
    if (status === "FULLY_APPROVED") return { label: "Approved", bg: "bg-emerald-50", text: "text-emerald-700", icon: "checkmark-circle" as const, color: "#059669" };
    if (status.includes("REJECTED")) return { label: "Rejected", bg: "bg-red-50", text: "text-red-700", icon: "close-circle" as const, color: "#dc2626" };
    if (status.includes("PENDING")) return { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", icon: "time" as const, color: "#d97706" };
    return { label: status, bg: "bg-gray-50", text: "text-gray-700", icon: "help-circle" as const, color: "#6b7280" };
  };

  const displayLeaves = activeTab === "pending" ? leaves : historyLeaves;

  // Stats
  const approvedCount = historyLeaves.filter(l => l.status === "FULLY_APPROVED").length;
  const rejectedCount = historyLeaves.filter(l => l.status?.includes("REJECTED")).length;

  const tabTranslateX = tabIndicator.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (width - 52) / 2],
  });

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadLeaves(); }} tintColor="#059669" />}
      >
        {/* ─── GRADIENT HEADER ─── */}
        <LinearGradient
          colors={['#064e3b', '#065f46', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 pb-16"
          style={{ paddingTop: Platform.OS === 'ios' ? 60 : 48 }}
        >
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-emerald-300 text-sm font-medium">Welcome back</Text>
              <Text className="text-white text-2xl font-bold mt-1">Dean Dashboard</Text>
              <Text className="text-emerald-200 text-sm mt-1">{user?.name || "Dean"}</Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-white/10 p-3 rounded-2xl"
              style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' }}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* Stat Cards */}
          <View className="flex-row -mb-20">
            <StatCard icon="time-outline" label="Pending" value={leaves.length} gradient={['#f59e0b', '#fbbf24']} />
            <StatCard icon="checkmark-circle" label="Approved" value={approvedCount} gradient={['#059669', '#34d399']} />
            <StatCard icon="close-circle" label="Rejected" value={rejectedCount} gradient={['#dc2626', '#f87171']} />
          </View>
        </LinearGradient>

        <View className="h-14" />

        {/* ─── TAB SWITCHER ─── */}
        <View className="mx-6 mt-4 mb-6">
          <View className="flex-row bg-white rounded-2xl p-1.5"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}
          >
            <Animated.View
              className="absolute rounded-xl"
              style={{
                width: '49%',
                height: '85%',
                top: '7.5%',
                left: 6,
                backgroundColor: '#059669',
                transform: [{ translateX: tabTranslateX }],
                shadowColor: '#059669',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            />
            <TouchableOpacity onPress={() => switchTab("pending")} className="flex-1 py-3.5 rounded-xl items-center flex-row justify-center" activeOpacity={0.7}>
              <Ionicons name="time" size={16} color={activeTab === "pending" ? "white" : "#9ca3af"} />
              <Text className={`font-bold ml-2 ${activeTab === "pending" ? "text-white" : "text-gray-400"}`}>Pending ({leaves.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => switchTab("history")} className="flex-1 py-3.5 rounded-xl items-center flex-row justify-center" activeOpacity={0.7}>
              <Ionicons name="archive" size={16} color={activeTab === "history" ? "white" : "#9ca3af"} />
              <Text className={`font-bold ml-2 ${activeTab === "history" ? "text-white" : "text-gray-400"}`}>History ({historyLeaves.length})</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── CONTENT ─── */}
        <Animated.View style={{ opacity: fadeAnim }} className="px-6 pb-10">
          {loading ? (
            <View className="items-center justify-center mt-16">
              <View className="bg-white p-8 rounded-3xl items-center"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}
              >
                <ActivityIndicator size="large" color="#059669" />
                <Text className="text-gray-400 font-medium mt-4">Loading requests...</Text>
              </View>
            </View>
          ) : displayLeaves.length === 0 ? (
            <View className="items-center justify-center mt-16">
              <View className="bg-white p-8 rounded-3xl items-center"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}
              >
                <View className="bg-emerald-50 w-16 h-16 rounded-full items-center justify-center mb-4">
                  <Ionicons name="document-text-outline" size={32} color="#059669" />
                </View>
                <Text className="text-gray-800 font-bold text-lg">No Requests</Text>
                <Text className="text-gray-400 text-sm mt-1 text-center">
                  {activeTab === "pending" ? "No pending leave requests\nto review right now." : "No history records found."}
                </Text>
              </View>
            </View>
          ) : (
            displayLeaves.map((leave) => {
              const badge = getStatusBadge(leave.status);
              return (
                <View key={leave.id} className="bg-white rounded-2xl mb-3 overflow-hidden"
                  style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
                >
                  {/* Left accent */}
                  <View className="flex-row">
                    <View style={{ width: 4, backgroundColor: badge.color, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }} />
                    <View className="flex-1 p-4">
                      {/* Top row */}
                      <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1 mr-3">
                          <Text className="font-bold text-gray-900 text-base">{leave.studentName}</Text>
                        </View>
                        <View className="flex-row items-center">
                          <View className={`${badge.bg} px-2.5 py-1 rounded-lg flex-row items-center mr-2`}>
                            <Ionicons name={badge.icon} size={12} color={badge.color} />
                            <Text className={`${badge.text} text-xs font-bold ml-1`}>{badge.label}</Text>
                          </View>
                          <View className="bg-emerald-50 px-2.5 py-1 rounded-lg">
                            <Text className="text-emerald-700 text-xs font-bold">{leave.leaveType}</Text>
                          </View>
                        </View>
                      </View>

                      {/* Reason */}
                      <Text className="text-gray-500 text-sm mb-3" numberOfLines={3}>{leave.reason}</Text>

                      {/* Review Button */}
                      {activeTab === "pending" && (
                        <TouchableOpacity
                          onPress={() => { setSelectedLeave(leave); setModalVisible(true); }}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={['#059669', '#10b981']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="py-3 rounded-xl items-center flex-row justify-center"
                            style={{ shadowColor: '#059669', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }}
                          >
                            <Ionicons name="eye" size={16} color="white" />
                            <Text className="text-white font-bold ml-2">Review Request</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </Animated.View>
      </ScrollView>

      {/* ─── REVIEW MODAL ─── */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-[32px]"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 10 }}
          >
            {/* Handle bar */}
            <View className="items-center pt-3 pb-2">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>

            <View className="px-6 pb-8">
              <View className="flex-row items-center mb-6">
                <View className="bg-emerald-50 w-10 h-10 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="chatbubble-ellipses" size={20} color="#059669" />
                </View>
                <Text className="text-xl font-bold text-gray-900">Add Remarks</Text>
              </View>

              <TextInput
                className="bg-gray-50 p-4 rounded-2xl mb-6 h-32 text-base text-gray-800"
                style={{ borderWidth: 2, borderColor: '#e5e7eb', textAlignVertical: 'top' }}
                multiline
                placeholder="Enter your remarks here..."
                placeholderTextColor="#9ca3af"
                value={remarks}
                onChangeText={setRemarks}
              />

              <View className="flex-row" style={{ gap: 12 }}>
                <TouchableOpacity onPress={() => handleAction(false)} className="flex-1" activeOpacity={0.8}>
                  <View className="bg-red-50 py-4 rounded-2xl items-center flex-row justify-center"
                    style={{ borderWidth: 1.5, borderColor: '#fecaca' }}
                  >
                    <Ionicons name="close-circle" size={18} color="#dc2626" />
                    <Text className="text-red-600 font-bold ml-2">Reject</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAction(true)} className="flex-1" activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#059669', '#10b981']}
                    className="py-4 rounded-2xl items-center flex-row justify-center"
                    style={{ shadowColor: '#059669', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
                  >
                    <Ionicons name="checkmark-circle" size={18} color="white" />
                    <Text className="text-white font-bold ml-2">Approve</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => setModalVisible(false)} className="mt-4 items-center py-2" activeOpacity={0.7}>
                <Text className="text-gray-400 font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeanDashboard;
