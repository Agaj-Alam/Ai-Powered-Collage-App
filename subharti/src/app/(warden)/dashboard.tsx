import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
  ActivityIndicator, TextInput, Modal, RefreshControl,
  Dimensions, Animated, StatusBar, Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import {
  fetchWardenPending, fetchWardenHistory, fetchWardenOwnLeaves,
  approveWardenLeave, rejectWardenLeave,
  applyWardenLeaveApi, fetchChiefWardens,
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

// ─── Type Chip ────────────────────────────────────────────────────
const TypeChip = ({ label, active, onPress }: any) => (
  <TouchableOpacity onPress={onPress} className="mr-2 mb-2" activeOpacity={0.7}>
    <LinearGradient
      colors={active ? ['#4338ca', '#6366f1'] : ['#f3f4f6', '#f3f4f6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="px-5 py-3 rounded-xl"
      style={{
        shadowColor: active ? '#4338ca' : 'transparent',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: active ? 0.3 : 0,
        shadowRadius: 8,
        elevation: active ? 4 : 0,
      }}
    >
      <Text className={`text-center font-bold text-xs ${active ? 'text-white' : 'text-gray-500'}`}>
        {label}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);

// ═══════════════════════════════════════════════════════════════════
const WardenDashboard = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [historyLeaves, setHistoryLeaves] = useState<any[]>([]);
  const [myLeaves, setMyLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [leaveType, setLeaveType] = useState("HOSTEL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [chiefWardens, setChiefWardens] = useState<any[]>([]);
  const [selectedCW, setSelectedCW] = useState<any>(null);
  const [applyLoading, setApplyLoading] = useState(false);

  const tabIndicator = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, h, o, c] = await Promise.all([fetchWardenPending(), fetchWardenHistory(), fetchWardenOwnLeaves(), fetchChiefWardens()]);
      setLeaves(p); setHistoryLeaves(h); setMyLeaves(o); setChiefWardens(c);
    } catch (e) { console.log(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  useEffect(() => {
    const tabIndex = activeTab === "pending" ? 0 : activeTab === "history" ? 1 : 2;
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
      if (approve) await approveWardenLeave(selectedLeave.id, remarks);
      else await rejectWardenLeave(selectedLeave.id, remarks);
      Alert.alert("✅ Success", `Leave ${approve ? 'Approved' : 'Rejected'} successfully!`);
      setModalVisible(false); setRemarks(""); loadAll();
    } catch (e) { Alert.alert("❌ Error", "Action failed. Please try again."); }
  };

  const handleApplyLeave = async () => {
    if (!reason || !startDate || !endDate || !selectedCW) { Alert.alert("Missing Info", "Please fill all fields"); return; }
    setApplyLoading(true);
    try {
      await applyWardenLeaveApi({ leaveType, startDate, endDate, reason, chiefWardenId: selectedCW.id }, null);
      Alert.alert("✅ Success", "Leave submitted successfully!"); setApplyModalVisible(false); setReason(""); setStartDate(""); setEndDate(""); loadAll();
    } catch (e) { Alert.alert("❌ Error", "Failed to submit leave."); }
    finally { setApplyLoading(false); }
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
    { key: "pending", label: "Pending", icon: "time" as const, count: leaves.length },
    { key: "history", label: "History", icon: "archive" as const, count: historyLeaves.length },
    { key: "myleave", label: "My Leave", icon: "person" as const, count: myLeaves.length },
  ];
  const displayLeaves = activeTab === "pending" ? leaves : activeTab === "history" ? historyLeaves : myLeaves;

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadAll(); }} tintColor="#4338ca" />}
      >
        {/* ─── GRADIENT HEADER ─── */}
        <LinearGradient
          colors={['#1e1b4b', '#312e81', '#4338ca']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 pb-16"
          style={{ paddingTop: Platform.OS === 'ios' ? 60 : 48 }}
        >
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-indigo-300 text-sm font-medium">Welcome back</Text>
              <Text className="text-white text-2xl font-bold mt-1">Warden Dashboard</Text>
              <Text className="text-indigo-200 text-sm mt-1">{user?.name || "Warden"}</Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => setApplyModalVisible(true)}
                className="bg-white/10 p-3 rounded-2xl mr-3"
                style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' }}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                className="bg-white/10 p-3 rounded-2xl"
                style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' }}
                activeOpacity={0.7}
              >
                <Ionicons name="log-out-outline" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stat Cards */}
          <View className="flex-row -mb-20">
            <StatCard icon="time-outline" label="Pending" value={leaves.length} gradient={['#f59e0b', '#fbbf24']} />
            <StatCard icon="archive-outline" label="History" value={historyLeaves.length} gradient={['#4338ca', '#818cf8']} />
            <StatCard icon="person-outline" label="My Leaves" value={myLeaves.length} gradient={['#7c3aed', '#a78bfa']} />
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
                backgroundColor: '#4338ca',
                transform: [{ translateX: tabTranslateX }],
                shadowColor: '#4338ca',
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
                <ActivityIndicator size="large" color="#4338ca" />
                <Text className="text-gray-400 font-medium mt-4">Loading requests...</Text>
              </View>
            </View>
          ) : displayLeaves.length === 0 ? (
            <View className="items-center justify-center mt-16">
              <View className="bg-white p-8 rounded-3xl items-center"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}
              >
                <View className="bg-indigo-50 w-16 h-16 rounded-full items-center justify-center mb-4">
                  <Ionicons name="document-text-outline" size={32} color="#4338ca" />
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
                      {lv.deanRemarks && (
                        <View className="flex-row items-center mt-1 mb-2">
                          <Ionicons name="chatbubble-outline" size={12} color="#6366f1" />
                          <Text className="text-indigo-500 text-xs ml-1 flex-1">Dean: {lv.deanRemarks}</Text>
                        </View>
                      )}
                      {activeTab === "pending" && (
                        <TouchableOpacity onPress={() => { setSelectedLeave(lv); setModalVisible(true); }} activeOpacity={0.8} className="mt-2">
                          <LinearGradient
                            colors={['#4338ca', '#6366f1']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="py-3 rounded-xl items-center flex-row justify-center"
                            style={{ shadowColor: '#4338ca', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }}
                          >
                            <Ionicons name="eye" size={16} color="white" />
                            <Text className="text-white font-bold ml-2">Review</Text>
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
                <View className="bg-indigo-50 w-10 h-10 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="chatbubble-ellipses" size={20} color="#4338ca" />
                </View>
                <Text className="text-xl font-bold text-gray-900">Warden Remarks</Text>
              </View>
              <TextInput
                className="bg-gray-50 p-4 rounded-2xl mb-6 h-32 text-base text-gray-800"
                style={{ borderWidth: 2, borderColor: '#e5e7eb', textAlignVertical: 'top' }}
                multiline placeholder="Enter your remarks..." placeholderTextColor="#9ca3af"
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
                  <LinearGradient colors={['#4338ca', '#6366f1']} className="py-4 rounded-2xl items-center flex-row justify-center"
                    style={{ shadowColor: '#4338ca', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
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

      {/* ─── APPLY LEAVE MODAL ─── */}
      <Modal visible={applyModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-[32px]"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 10 }}
          >
            <View className="items-center pt-3 pb-2">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
            <ScrollView className="px-6 pb-8" style={{ maxHeight: '80%' }} showsVerticalScrollIndicator={false}>
              <View className="flex-row items-center mb-6">
                <View className="bg-indigo-50 w-10 h-10 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="calendar" size={20} color="#4338ca" />
                </View>
                <Text className="text-xl font-bold text-gray-900">Apply for Leave</Text>
              </View>

              {/* Leave Type */}
              <Text className="text-gray-400 text-xs font-semibold mb-3 ml-1 tracking-wider">LEAVE TYPE</Text>
              <View className="flex-row flex-wrap mb-4">
                {["HOSTEL", "COLLEGE", "BOTH"].map(t => (
                  <TypeChip key={t} label={t} active={leaveType === t} onPress={() => setLeaveType(t)} />
                ))}
              </View>

              {/* Date inputs */}
              <View className="flex-row items-center bg-white rounded-2xl mb-3 border-2 border-gray-100 p-4">
                <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
                <TextInput className="flex-1 ml-3 text-base text-gray-800" placeholder="Start (YYYY-MM-DD)" placeholderTextColor="#b0b7c3" value={startDate} onChangeText={setStartDate} />
              </View>
              <View className="flex-row items-center bg-white rounded-2xl mb-3 border-2 border-gray-100 p-4">
                <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
                <TextInput className="flex-1 ml-3 text-base text-gray-800" placeholder="End (YYYY-MM-DD)" placeholderTextColor="#b0b7c3" value={endDate} onChangeText={setEndDate} />
              </View>

              {/* Reason */}
              <TextInput
                className="bg-white p-4 rounded-2xl mb-4 h-24 text-base text-gray-800"
                style={{ borderWidth: 2, borderColor: '#e5e7eb', textAlignVertical: 'top' }}
                multiline placeholder="Reason for leave..." placeholderTextColor="#b0b7c3"
                value={reason} onChangeText={setReason}
              />

              {/* Chief Warden Selection */}
              <Text className="text-gray-400 text-xs font-semibold mb-3 ml-1 tracking-wider">SELECT CHIEF WARDEN</Text>
              <View className="bg-gray-50 rounded-2xl border border-gray-100 p-1.5 mb-6">
                {chiefWardens.map(c => (
                  <TouchableOpacity key={c.id} onPress={() => setSelectedCW(c)} activeOpacity={0.7}
                    className={`p-3.5 rounded-xl flex-row items-center ${selectedCW?.id === c.id ? 'bg-indigo-50' : ''}`}
                  >
                    <View className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${selectedCW?.id === c.id ? 'bg-indigo-100' : 'bg-gray-200'}`}>
                      <Ionicons name="person" size={16} color={selectedCW?.id === c.id ? '#4338ca' : '#9ca3af'} />
                    </View>
                    <Text className={`flex-1 font-medium ${selectedCW?.id === c.id ? 'text-indigo-700 font-bold' : 'text-gray-600'}`}>{c.name}</Text>
                    {selectedCW?.id === c.id && <Ionicons name="checkmark-circle" size={20} color="#4338ca" />}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Submit */}
              <TouchableOpacity onPress={handleApplyLeave} disabled={applyLoading} activeOpacity={0.8}>
                <LinearGradient
                  colors={applyLoading ? ['#9ca3af', '#9ca3af'] : ['#4338ca', '#6366f1']}
                  className="py-4 rounded-2xl items-center flex-row justify-center"
                  style={{ shadowColor: '#4338ca', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }}
                >
                  {applyLoading ? <ActivityIndicator color="white" /> : (
                    <>
                      <Ionicons name="send" size={18} color="white" />
                      <Text className="text-white font-bold text-lg ml-2">Submit Leave</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setApplyModalVisible(false)} className="mt-4 items-center py-2 mb-6" activeOpacity={0.7}>
                <Text className="text-gray-400 font-medium">Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WardenDashboard;
