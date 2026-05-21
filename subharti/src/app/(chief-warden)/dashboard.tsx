import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
  ActivityIndicator, TextInput, Modal, RefreshControl,
  Dimensions, Animated, StatusBar, Platform,
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

  const tabIndicator = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    const tabIndex = activeTab === "pending" ? 0 : activeTab === "warden" ? 1 : 2;
    Animated.spring(tabIndicator, {
      toValue: tabIndex,
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
      if (approve) await approveChiefWardenLeave(selectedLeave.id, remarks);
      else await rejectChiefWardenLeave(selectedLeave.id, remarks);
      Alert.alert("✅ Success", `Leave ${approve ? 'Fully Approved' : 'Rejected'} successfully!`);
      setModalVisible(false); setRemarks(""); loadAll();
    } catch (e) { Alert.alert("❌ Error", "Action failed. Please try again."); }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: async () => {
        await AsyncStorage.removeItem("token");
        dispatch(logout()); dispatch(clearUser()); dispatch(clearLeaves());
        router.replace("/(auth)/login");
      }}
    ]);
  };

  const getStatusBadge = (status: string) => {
    if (status === "FULLY_APPROVED") return { label: "Approved", bg: "bg-emerald-50", text: "text-emerald-700", icon: "checkmark-circle" as const, color: "#059669" };
    if (status.includes("REJECTED")) return { label: "Rejected", bg: "bg-red-50", text: "text-red-700", icon: "close-circle" as const, color: "#dc2626" };
    return { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", icon: "time" as const, color: "#d97706" };
  };

  const tabs = [
    { key: "pending", label: "Students", icon: "school" as const, count: leaves.length },
    { key: "warden", label: "Warden", icon: "shield" as const, count: wardenLeaves.length },
    { key: "history", label: "History", icon: "archive" as const, count: historyLeaves.length },
  ];
  const displayLeaves = activeTab === "pending" ? leaves : activeTab === "warden" ? wardenLeaves : historyLeaves;

  const tabWidth = (width - 52) / 3;
  const tabTranslateX = tabIndicator.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, tabWidth, tabWidth * 2],
  });

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadAll(); }} tintColor="#7e22ce" />}
      >
        {/* ─── GRADIENT HEADER ─── */}
        <LinearGradient
          colors={['#3b0764', '#581c87', '#7e22ce']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 pb-16"
          style={{ paddingTop: Platform.OS === 'ios' ? 60 : 48 }}
        >
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-purple-300 text-sm font-medium">Welcome back</Text>
              <Text className="text-white text-2xl font-bold mt-1">Chief Warden</Text>
              <Text className="text-purple-200 text-sm mt-1">{user?.name || "Chief Warden"}</Text>
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
            <StatCard icon="school-outline" label="Students" value={leaves.length} gradient={['#7c3aed', '#a78bfa']} />
            <StatCard icon="shield-outline" label="Warden" value={wardenLeaves.length} gradient={['#9333ea', '#c084fc']} />
            <StatCard icon="archive-outline" label="History" value={historyLeaves.length} gradient={['#6d28d9', '#8b5cf6']} />
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
                width: tabWidth - 4,
                height: '85%',
                top: '7.5%',
                left: 6,
                backgroundColor: '#7e22ce',
                transform: [{ translateX: tabTranslateX }],
                shadowColor: '#7e22ce',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            />
            {tabs.map((tab) => (
              <TouchableOpacity key={tab.key} onPress={() => switchTab(tab.key)} className="flex-1 py-3.5 rounded-xl items-center flex-row justify-center" activeOpacity={0.7}>
                <Ionicons name={tab.icon} size={14} color={activeTab === tab.key ? "white" : "#9ca3af"} />
                <Text className={`font-bold text-xs ml-1 ${activeTab === tab.key ? "text-white" : "text-gray-400"}`}>{tab.label} ({tab.count})</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ─── CONTENT ─── */}
        <Animated.View style={{ opacity: fadeAnim }} className="px-6 pb-10">
          {loading ? (
            <View className="items-center justify-center mt-16">
              <View className="bg-white p-8 rounded-3xl items-center"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}
              >
                <ActivityIndicator size="large" color="#7e22ce" />
                <Text className="text-gray-400 font-medium mt-4">Loading requests...</Text>
              </View>
            </View>
          ) : displayLeaves.length === 0 ? (
            <View className="items-center justify-center mt-16">
              <View className="bg-white p-8 rounded-3xl items-center"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}
              >
                <View className="bg-purple-50 w-16 h-16 rounded-full items-center justify-center mb-4">
                  <Ionicons name="document-text-outline" size={32} color="#7e22ce" />
                </View>
                <Text className="text-gray-800 font-bold text-lg">No Items</Text>
                <Text className="text-gray-400 text-sm mt-1 text-center">No {activeTab} records found.</Text>
              </View>
            </View>
          ) : (
            displayLeaves.map((lv) => {
              const badge = getStatusBadge(lv.status);
              return (
                <View key={lv.id} className="bg-white rounded-2xl mb-3 overflow-hidden"
                  style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
                >
                  <View className="flex-row">
                    <View style={{ width: 4, backgroundColor: badge.color, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }} />
                    <View className="flex-1 p-4">
                      <View className="flex-row justify-between items-start mb-2">
                        <Text className="font-bold text-gray-900 text-base flex-1 mr-3">{lv.studentName}</Text>
                        <View className={`${badge.bg} px-2.5 py-1 rounded-lg flex-row items-center`}>
                          <Ionicons name={badge.icon} size={12} color={badge.color} />
                          <Text className={`${badge.text} text-xs font-bold ml-1`}>{badge.label}</Text>
                        </View>
                      </View>
                      <Text className="text-gray-500 text-sm mb-1" numberOfLines={2}>{lv.reason}</Text>

                      {/* Remarks chain */}
                      {lv.deanRemarks && (
                        <View className="flex-row items-center mt-1">
                          <View className="bg-emerald-50 w-5 h-5 rounded items-center justify-center mr-2">
                            <Ionicons name="chatbubble" size={10} color="#059669" />
                          </View>
                          <Text className="text-emerald-600 text-xs flex-1" numberOfLines={1}>Dean: {lv.deanRemarks}</Text>
                        </View>
                      )}
                      {lv.wardenRemarks && (
                        <View className="flex-row items-center mt-1 mb-2">
                          <View className="bg-indigo-50 w-5 h-5 rounded items-center justify-center mr-2">
                            <Ionicons name="chatbubble" size={10} color="#4338ca" />
                          </View>
                          <Text className="text-indigo-600 text-xs flex-1" numberOfLines={1}>Warden: {lv.wardenRemarks}</Text>
                        </View>
                      )}

                      {(activeTab === "pending" || activeTab === "warden") && (
                        <TouchableOpacity onPress={() => { setSelectedLeave(lv); setModalVisible(true); }} activeOpacity={0.8} className="mt-2">
                          <LinearGradient
                            colors={['#7e22ce', '#a855f7']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="py-3 rounded-xl items-center flex-row justify-center"
                            style={{ shadowColor: '#7e22ce', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }}
                          >
                            <Ionicons name="shield-checkmark" size={16} color="white" />
                            <Text className="text-white font-bold ml-2">Final Review</Text>
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
            <View className="items-center pt-3 pb-2">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
            <View className="px-6 pb-8">
              <View className="flex-row items-center mb-6">
                <View className="bg-purple-50 w-10 h-10 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="shield-checkmark" size={20} color="#7e22ce" />
                </View>
                <Text className="text-xl font-bold text-gray-900">Final Remarks</Text>
              </View>
              <TextInput
                className="bg-gray-50 p-4 rounded-2xl mb-6 h-32 text-base text-gray-800"
                style={{ borderWidth: 2, borderColor: '#e5e7eb', textAlignVertical: 'top' }}
                multiline placeholder="Enter your final remarks..." placeholderTextColor="#9ca3af"
                value={remarks} onChangeText={setRemarks}
              />
              <View className="flex-row" style={{ gap: 12 }}>
                <TouchableOpacity onPress={() => handleAction(false)} className="flex-1" activeOpacity={0.8}>
                  <View className="bg-red-50 py-4 rounded-2xl items-center flex-row justify-center" style={{ borderWidth: 1.5, borderColor: '#fecaca' }}>
                    <Ionicons name="close-circle" size={18} color="#dc2626" />
                    <Text className="text-red-600 font-bold ml-2">Reject</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAction(true)} className="flex-1" activeOpacity={0.8}>
                  <LinearGradient colors={['#7e22ce', '#a855f7']} className="py-4 rounded-2xl items-center flex-row justify-center"
                    style={{ shadowColor: '#7e22ce', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
                  >
                    <Ionicons name="shield-checkmark" size={18} color="white" />
                    <Text className="text-white font-bold ml-2">Fully Approve</Text>
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

export default ChiefWardenDashboard;
