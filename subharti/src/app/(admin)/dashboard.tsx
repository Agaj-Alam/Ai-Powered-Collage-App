import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  Alert, ActivityIndicator, Image, Dimensions, Animated,
  StatusBar, Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createUserApi, fetchAllUsers, deleteUserApi } from "@/src/services/api";
import { useDispatch } from "react-redux";
import { logout } from "@/src/redux/auth/authSlice";
import { clearUser } from "@/src/redux/userSlice";
import { clearLeaves } from "@/src/redux/leaveSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

// ─── Premium Input Field ──────────────────────────────────────────
const InputField = ({ placeholder, value, onChangeText, icon, ...props }: any) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`flex-row items-center bg-white rounded-2xl mb-3 border-2 ${isFocused ? 'border-indigo-400' : 'border-gray-100'}`}
      style={{
        shadowColor: isFocused ? '#6366f1' : '#000',
        shadowOffset: { width: 0, height: isFocused ? 4 : 1 },
        shadowOpacity: isFocused ? 0.15 : 0.04,
        shadowRadius: isFocused ? 12 : 4,
        elevation: isFocused ? 6 : 1,
      }}
    >
      {icon && (
        <View className="pl-4">
          <Ionicons name={icon} size={20} color={isFocused ? '#6366f1' : '#9ca3af'} />
        </View>
      )}
      <TextInput
        className="flex-1 p-4 text-gray-800 text-base"
        placeholder={placeholder}
        placeholderTextColor="#b0b7c3"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        blurOnSubmit={false}
        returnKeyType="next"
        {...props}
      />
    </View>
  );
};

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

// ─── Role Chip ────────────────────────────────────────────────────
const RoleChip = ({ label, active, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className="mr-2 mb-2"
    activeOpacity={0.7}
  >
    <LinearGradient
      colors={active ? ['#6366f1', '#8b5cf6'] : ['#f3f4f6', '#f3f4f6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="px-5 py-3 rounded-xl"
      style={{
        shadowColor: active ? '#6366f1' : 'transparent',
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

// ─── Section Title ────────────────────────────────────────────────
const SectionTitle = ({ icon, title }: any) => (
  <View className="flex-row items-center mb-4 mt-2">
    <View className="bg-indigo-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
      <Ionicons name={icon} size={16} color="#6366f1" />
    </View>
    <Text className="text-gray-800 font-bold text-base">{title}</Text>
  </View>
);

// ═══════════════════════════════════════════════════════════════════
// ─── ADMIN DASHBOARD ──────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("create");
  // Create user fields
  const [enrollment, setEnrollment] = useState("");
  const [dob, setDob] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [designation, setDesignation] = useState("NONE");
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  // Extra student fields
  const [studentId, setStudentId] = useState("");
  const [course, setCourse] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [admissionSession, setAdmissionSession] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  // User list
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Animation refs
  const tabIndicator = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => { if (activeTab === "users") loadUsers(); }, [activeTab]);

  useEffect(() => {
    Animated.spring(tabIndicator, {
      toValue: activeTab === "create" ? 0 : 1,
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

  const loadUsers = async () => {
    setUsersLoading(true);
    try { setUsers(await fetchAllUsers()); }
    catch (e) { console.log(e); }
    finally { setUsersLoading(false); }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const handleCreateUser = async () => {
    if (!enrollment || !dob || !name || !image) {
      Alert.alert("Missing Information", "Please fill all required fields and upload a profile image.");
      return;
    }
    if ((role === "FACULTY" || role === "GUARDIAN") && designation === "NONE") {
      Alert.alert("Missing Information", "Please select a designation for this role.");
      return;
    }
    if (role === "STUDENT") {
      if (!studentId || !course || !collegeName || !specialization || !admissionSession || !fatherName || !motherName || !gender || !mobileNo || !email) {
        Alert.alert("Missing Information", "All student details are required.");
        return;
      }
    }
    setLoading(true);
    try {
      const userData: any = { enrollment, dob, name, role, designation };
      if (role === "STUDENT") {
        Object.assign(userData, { studentId, course, collegeName, specialization, admissionSession, fatherName, motherName, gender, mobileNo, email });
      }
      await createUserApi(userData, image);
      Alert.alert("✅ Success", "User has been created successfully!");
      setEnrollment(""); setDob(""); setName(""); setImage(null);
      setStudentId(""); setCourse(""); setCollegeName(""); setSpecialization(""); setAdmissionSession("");
      setFatherName(""); setMotherName(""); setGender(""); setMobileNo(""); setEmail("");
    } catch (e) { Alert.alert("❌ Error", "Failed to create user. Please try again."); }
    finally { setLoading(false); }
  };

  const handleDeleteUser = async (id: number, uname: string) => {
    Alert.alert("Delete User", `Are you sure you want to delete "${uname}"? This action cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try { await deleteUserApi(id); loadUsers(); } catch (e) { Alert.alert("Error", "Failed to delete user."); }
      }}
    ]);
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

  // Stat calculations
  const totalUsers = users.length;
  const studentCount = users.filter(u => u.role === "STUDENT").length;
  const facultyCount = users.filter(u => u.role === "FACULTY").length;

  // Tab indicator translation
  const tabTranslateX = tabIndicator.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (width - 52) / 2],
  });

  // Get role-specific color config
  const getRoleBadge = (r: string) => {
    switch (r) {
      case "STUDENT": return { bg: "bg-blue-50", text: "text-blue-700", icon: "school-outline" as const };
      case "FACULTY": return { bg: "bg-emerald-50", text: "text-emerald-700", icon: "briefcase-outline" as const };
      case "GUARDIAN": return { bg: "bg-amber-50", text: "text-amber-700", icon: "people-outline" as const };
      case "ALUMNI": return { bg: "bg-purple-50", text: "text-purple-700", icon: "ribbon-outline" as const };
      default: return { bg: "bg-gray-50", text: "text-gray-700", icon: "person-outline" as const };
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled" nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>

        {/* ─── PREMIUM GRADIENT HEADER ─── */}
        <LinearGradient
          colors={['#1e1b4b', '#312e81', '#4338ca']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 pb-16"
          style={{ paddingTop: Platform.OS === 'ios' ? 60 : 48 }}
        >
          {/* Top Bar */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-indigo-300 text-sm font-medium">Welcome back</Text>
              <Text className="text-white text-2xl font-bold mt-1">Admin Panel</Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-white/10 p-3 rounded-2xl"
              style={{
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.15)',
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View className="flex-row -mb-20">
            <StatCard
              icon="people"
              label="Total Users"
              value={totalUsers}
              gradient={['#6366f1', '#818cf8']}
            />
            <StatCard
              icon="school"
              label="Students"
              value={studentCount}
              gradient={['#3b82f6', '#60a5fa']}
            />
            <StatCard
              icon="briefcase"
              label="Faculty"
              value={facultyCount}
              gradient={['#8b5cf6', '#a78bfa']}
            />
          </View>
        </LinearGradient>

        {/* Spacer for overlapping stat cards */}
        <View className="h-14" />

        {/* ─── TAB SWITCHER ─── */}
        <View className="mx-6 mt-4 mb-6">
          <View className="flex-row bg-white rounded-2xl p-1.5"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Animated.View
              className="absolute bg-indigo-600 rounded-xl"
              style={{
                width: '49%',
                height: '85%',
                top: '7.5%',
                left: 6,
                transform: [{ translateX: tabTranslateX }],
                shadowColor: '#6366f1',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            />
            <TouchableOpacity onPress={() => switchTab("create")} className="flex-1 py-3.5 rounded-xl items-center flex-row justify-center" activeOpacity={0.7}>
              <Ionicons name="person-add" size={16} color={activeTab === "create" ? "white" : "#9ca3af"} />
              <Text className={`font-bold ml-2 ${activeTab === "create" ? "text-white" : "text-gray-400"}`}>Create User</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => switchTab("users")} className="flex-1 py-3.5 rounded-xl items-center flex-row justify-center" activeOpacity={0.7}>
              <Ionicons name="people" size={16} color={activeTab === "users" ? "white" : "#9ca3af"} />
              <Text className={`font-bold ml-2 ${activeTab === "users" ? "text-white" : "text-gray-400"}`}>All Users</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── TAB CONTENT ─── */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {activeTab === "create" ? (
            <View className="px-6 pb-10">

              {/* Profile Image Picker */}
              <View className="bg-white p-6 rounded-3xl mb-5"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  elevation: 3,
                }}
              >
                <SectionTitle icon="camera-outline" title="Profile Photo" />
                <TouchableOpacity onPress={pickImage} className="items-center" activeOpacity={0.7}>
                  <View className="w-28 h-28 rounded-full justify-center items-center overflow-hidden"
                    style={{
                      borderWidth: 3,
                      borderColor: image ? '#6366f1' : '#e5e7eb',
                      shadowColor: '#6366f1',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: image ? 0.2 : 0,
                      shadowRadius: 12,
                      elevation: image ? 6 : 0,
                    }}
                  >
                    {image ? (
                      <Image source={{ uri: image.uri }} className="w-full h-full" />
                    ) : (
                      <LinearGradient
                        colors={['#eef2ff', '#e0e7ff']}
                        className="w-full h-full items-center justify-center"
                      >
                        <Ionicons name="camera" size={32} color="#6366f1" />
                      </LinearGradient>
                    )}
                  </View>
                  <Text className="text-indigo-600 font-bold mt-3 text-sm">
                    {image ? "Change Photo" : "Upload Photo *"}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-1">Tap to select from gallery</Text>
                </TouchableOpacity>
              </View>

              {/* Basic Info Card */}
              <View className="bg-white p-6 rounded-3xl mb-5"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  elevation: 3,
                }}
              >
                <SectionTitle icon="person-outline" title="Basic Information" />
                <InputField icon="id-card-outline" placeholder="Enrollment Number *" value={enrollment} onChangeText={setEnrollment} />
                <InputField icon="calendar-outline" placeholder="DOB (DDMMYYYY) *" value={dob} onChangeText={setDob} />
                <InputField icon="text-outline" placeholder="Full Name *" value={name} onChangeText={setName} />
              </View>

              {/* Role Selection Card */}
              <View className="bg-white p-6 rounded-3xl mb-5"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  elevation: 3,
                }}
              >
                <SectionTitle icon="shield-outline" title="Role & Designation" />
                <Text className="text-gray-400 text-xs font-semibold mb-3 ml-1 tracking-wider">SELECT ROLE *</Text>
                <View className="flex-row flex-wrap">
                  {["STUDENT", "FACULTY", "GUARDIAN", "ALUMNI"].map(r => (
                    <RoleChip
                      key={r}
                      label={r}
                      active={role === r}
                      onPress={() => { setRole(r); if (r === "STUDENT") setDesignation("NONE"); }}
                    />
                  ))}
                </View>

                {/* Designation for Faculty/Guardian */}
                {(role === "FACULTY" || role === "GUARDIAN") && (
                  <View className="mt-4">
                    <Text className="text-gray-400 text-xs font-semibold mb-3 ml-1 tracking-wider">SELECT DESIGNATION *</Text>
                    <View className="flex-row flex-wrap">
                      {(role === "FACULTY" ? ["NONE", "DEAN", "PROFESSOR"] : ["NONE", "WARDEN", "CHIEF_WARDEN"]).map(d => (
                        <RoleChip
                          key={d}
                          label={d.replace("_", " ")}
                          active={designation === d}
                          onPress={() => setDesignation(d)}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>

              {/* Student Details Card */}
              {role === "STUDENT" && (
                <View className="bg-white p-6 rounded-3xl mb-5"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                    elevation: 3,
                  }}
                >
                  <SectionTitle icon="school-outline" title="Student Details" />
                  <InputField icon="finger-print-outline" placeholder="Student ID *" value={studentId} onChangeText={setStudentId} />
                  <InputField icon="book-outline" placeholder="Course (e.g. B.TECH) *" value={course} onChangeText={setCourse} />
                  <InputField icon="business-outline" placeholder="College Name *" value={collegeName} onChangeText={setCollegeName} />
                  <InputField icon="flask-outline" placeholder="Specialization *" value={specialization} onChangeText={setSpecialization} />
                  <InputField icon="time-outline" placeholder="Admission Session (e.g. 2022-2026) *" value={admissionSession} onChangeText={setAdmissionSession} />

                  <View className="h-px bg-gray-100 my-4" />
                  <SectionTitle icon="people-outline" title="Family & Contact" />
                  <InputField icon="man-outline" placeholder="Father Name *" value={fatherName} onChangeText={setFatherName} />
                  <InputField icon="woman-outline" placeholder="Mother Name *" value={motherName} onChangeText={setMotherName} />
                  <InputField icon="transgender-outline" placeholder="Gender *" value={gender} onChangeText={setGender} />
                  <InputField icon="call-outline" placeholder="Mobile No *" value={mobileNo} onChangeText={setMobileNo} keyboardType="phone-pad" />
                  <InputField icon="mail-outline" placeholder="Email *" value={email} onChangeText={setEmail} keyboardType="email-address" />
                </View>
              )}

              {/* Create Button */}
              <TouchableOpacity onPress={handleCreateUser} disabled={loading} activeOpacity={0.8}>
                <LinearGradient
                  colors={loading ? ['#9ca3af', '#9ca3af'] : ['#4f46e5', '#6366f1', '#7c3aed']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-5 rounded-2xl items-center flex-row justify-center"
                  style={{
                    shadowColor: '#4f46e5',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.35,
                    shadowRadius: 16,
                    elevation: 8,
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={22} color="white" />
                      <Text className="text-white font-bold text-lg ml-2">Create User</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="px-6 pb-10">
              {/* Refresh Button */}
              <TouchableOpacity onPress={loadUsers} className="flex-row items-center justify-end mb-4" activeOpacity={0.7}>
                <View className="bg-white flex-row items-center px-4 py-2.5 rounded-xl"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Ionicons name="refresh" size={16} color="#6366f1" />
                  <Text className="text-indigo-600 font-bold text-sm ml-2">Refresh</Text>
                </View>
              </TouchableOpacity>

              {usersLoading ? (
                <View className="items-center justify-center mt-16">
                  <View className="bg-white p-8 rounded-3xl items-center"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 10,
                      elevation: 3,
                    }}
                  >
                    <ActivityIndicator size="large" color="#6366f1" />
                    <Text className="text-gray-400 font-medium mt-4">Loading users...</Text>
                  </View>
                </View>
              ) : users.length === 0 ? (
                <View className="items-center justify-center mt-16">
                  <View className="bg-white p-8 rounded-3xl items-center"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 10,
                      elevation: 3,
                    }}
                  >
                    <View className="bg-indigo-50 w-16 h-16 rounded-full items-center justify-center mb-4">
                      <Ionicons name="people-outline" size={32} color="#6366f1" />
                    </View>
                    <Text className="text-gray-800 font-bold text-lg">No Users Found</Text>
                    <Text className="text-gray-400 text-sm mt-1 text-center">Create your first user using the{'\n'}Create User tab.</Text>
                  </View>
                </View>
              ) : (
                users.map((u, index) => {
                  const badge = getRoleBadge(u.role);
                  return (
                    <View key={u.id} className="bg-white rounded-2xl mb-3 overflow-hidden"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        elevation: 2,
                      }}
                    >
                      <View className="p-4 flex-row items-center">
                        {/* Avatar */}
                        <View className="w-12 h-12 rounded-2xl overflow-hidden mr-4"
                          style={{
                            shadowColor: '#6366f1',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.15,
                            shadowRadius: 6,
                            elevation: 3,
                          }}
                        >
                          {u.profileImage ? (
                            <Image source={{ uri: u.profileImage }} className="w-full h-full" />
                          ) : (
                            <LinearGradient
                              colors={['#6366f1', '#8b5cf6']}
                              className="w-full h-full items-center justify-center"
                            >
                              <Text className="text-white font-bold text-lg">
                                {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                              </Text>
                            </LinearGradient>
                          )}
                        </View>

                        {/* Info */}
                        <View className="flex-1">
                          <Text className="font-bold text-gray-900 text-base" numberOfLines={1}>{u.name}</Text>
                          <Text className="text-gray-400 text-sm mt-0.5">{u.enrollment}</Text>
                          <View className="flex-row mt-2">
                            <View className={`${badge.bg} px-2.5 py-1 rounded-lg mr-2 flex-row items-center`}>
                              <Ionicons name={badge.icon} size={12} color={badge.text === 'text-blue-700' ? '#1d4ed8' : badge.text === 'text-emerald-700' ? '#047857' : badge.text === 'text-amber-700' ? '#b45309' : '#7e22ce'} />
                              <Text className={`${badge.text} text-xs font-bold ml-1`}>{u.role}</Text>
                            </View>
                            {u.designation && u.designation !== "NONE" && (
                              <View className="bg-indigo-50 px-2.5 py-1 rounded-lg flex-row items-center">
                                <Ionicons name="star" size={10} color="#6366f1" />
                                <Text className="text-indigo-700 text-xs font-bold ml-1">{u.designation}</Text>
                              </View>
                            )}
                          </View>
                        </View>

                        {/* Delete */}
                        <TouchableOpacity
                          onPress={() => handleDeleteUser(u.id, u.name)}
                          className="bg-red-50 p-3 rounded-xl"
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default AdminDashboard;
