import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  Alert, ActivityIndicator, Image,
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

const InputField = ({ placeholder, value, onChangeText, ...props }: any) => (
  <TextInput
    className="bg-white p-4 rounded-2xl border border-gray-200 mb-3"
    placeholder={placeholder}
    placeholderTextColor="#9ca3af"
    value={value}
    onChangeText={onChangeText}
    blurOnSubmit={false}
    returnKeyType="next"
    {...props}
  />
);

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
  
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => { if (activeTab === "users") loadUsers(); }, [activeTab]);

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
    // Basic validation
    if (!enrollment || !dob || !name || !image) {
      Alert.alert("Error", "All fields including profile image are required");
      return;
    }

    // Role specific validation
    if ((role === "FACULTY" || role === "GUARDIAN") && designation === "NONE") {
      Alert.alert("Error", "Please select a designation");
      return;
    }

    if (role === "STUDENT") {
      if (!studentId || !course || !collegeName || !specialization || !admissionSession || !fatherName || !motherName || !gender || !mobileNo || !email) {
        Alert.alert("Error", "All student details are required");
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
      Alert.alert("Success", "User created");
      setEnrollment(""); setDob(""); setName(""); setImage(null);
      setStudentId(""); setCourse(""); setCollegeName(""); setSpecialization(""); setAdmissionSession("");
      setFatherName(""); setMotherName(""); setGender(""); setMobileNo(""); setEmail("");
    } catch (e) { Alert.alert("Error", "Failed to create user"); }
    finally { setLoading(false); }
  };

  const handleDeleteUser = async (id: number, uname: string) => {
    Alert.alert("Delete", `Delete ${uname}?`, [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try { await deleteUserApi(id); loadUsers(); } catch (e) { Alert.alert("Error", "Delete failed"); }
      }}
    ]);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    dispatch(logout()); dispatch(clearUser()); dispatch(clearLeaves());
    router.replace("/(auth)/login");
  };


  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
        {/* Header */}
        <View className="bg-[#2f2fa2] px-5 pt-14 pb-6 flex-row justify-between items-center">
          <Text className="text-white text-xl font-bold">Admin Panel</Text>
          <TouchableOpacity onPress={handleLogout} className="bg-white/20 p-2 rounded-full">
            <Ionicons name="log-out-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row mx-5 mt-4 mb-4 bg-gray-200 rounded-2xl p-1">
          <TouchableOpacity onPress={() => setActiveTab("create")} className={`flex-1 py-3 rounded-xl items-center ${activeTab === "create" ? "bg-indigo-600" : ""}`}>
            <Text className={`font-bold ${activeTab === "create" ? "text-white" : "text-gray-500"}`}>Create User</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("users")} className={`flex-1 py-3 rounded-xl items-center ${activeTab === "users" ? "bg-indigo-600" : ""}`}>
            <Text className={`font-bold ${activeTab === "users" ? "text-white" : "text-gray-500"}`}>All Users</Text>
          </TouchableOpacity>
        </View>

        {activeTab === "create" ? (
          <View className="px-5 pb-10">
            <View className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <Text className="text-xl font-bold mb-6">Create New User</Text>
              
              <TouchableOpacity onPress={pickImage} className="items-center mb-8">
                <View className="w-24 h-24 bg-gray-200 rounded-full justify-center items-center overflow-hidden border-2 border-indigo-100">
                  {image ? <Image source={{ uri: image.uri }} className="w-full h-full" /> : <Text className="text-gray-400">Photo</Text>}
                </View>
                <Text className="text-indigo-600 font-bold mt-2">Upload Profile Image *</Text>
              </TouchableOpacity>

              <InputField placeholder="Enrollment Number *" value={enrollment} onChangeText={setEnrollment} />
              <InputField placeholder="DOB (DDMMYYYY) *" value={dob} onChangeText={setDob} />
              <InputField placeholder="Full Name *" value={name} onChangeText={setName} />
              
              {/* Role selector */}
              <Text className="text-gray-500 font-bold text-xs mb-2 ml-1">ROLE *</Text>
              <View className="flex-row space-x-2 mb-4">
                {["STUDENT", "FACULTY", "GUARDIAN", "ALUMNI"].map(r => (
                  <TouchableOpacity key={r} onPress={() => { setRole(r); if (r === "STUDENT") setDesignation("NONE"); }} className={`flex-1 py-3 rounded-xl border ${role === r ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-200'}`}>
                    <Text className={`text-center font-bold text-xs ${role === r ? 'text-white' : 'text-gray-400'}`}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Designation for Faculty/Guardian */}
              {(role === "FACULTY" || role === "GUARDIAN") && (
                <>
                  <Text className="text-gray-500 font-bold text-xs mb-2 ml-1">DESIGNATION *</Text>
                  <View className="flex-row space-x-2 mb-4">
                    {(role === "FACULTY" ? ["NONE", "DEAN", "PROFESSOR"] : ["NONE", "WARDEN", "CHIEF_WARDEN"]).map(d => (
                      <TouchableOpacity key={d} onPress={() => setDesignation(d)} className={`flex-1 py-3 rounded-xl border ${designation === d ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-200'}`}>
                        <Text className={`text-center font-bold text-xs ${designation === d ? 'text-white' : 'text-gray-400'}`}>{d.replace("_", " ")}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {/* Student extra fields */}
              {role === "STUDENT" && (
                <>
                  <Text className="text-gray-500 font-bold text-xs mb-2 ml-1 mt-2">STUDENT DETAILS *</Text>
                  <InputField placeholder="Student ID *" value={studentId} onChangeText={setStudentId} />
                  <InputField placeholder="Course (e.g. B.TECH) *" value={course} onChangeText={setCourse} />
                  <InputField placeholder="College Name *" value={collegeName} onChangeText={setCollegeName} />
                  <InputField placeholder="Specialization *" value={specialization} onChangeText={setSpecialization} />
                  <InputField placeholder="Admission Session (e.g. 2022-2026) *" value={admissionSession} onChangeText={setAdmissionSession} />
                  <InputField placeholder="Father Name *" value={fatherName} onChangeText={setFatherName} />
                  <InputField placeholder="Mother Name *" value={motherName} onChangeText={setMotherName} />
                  <InputField placeholder="Gender *" value={gender} onChangeText={setGender} />
                  <InputField placeholder="Mobile No *" value={mobileNo} onChangeText={setMobileNo} keyboardType="phone-pad" />
                  <InputField placeholder="Email *" value={email} onChangeText={setEmail} keyboardType="email-address" />
                </>
              )}

              <TouchableOpacity onPress={handleCreateUser} disabled={loading} className="bg-indigo-600 py-4 rounded-2xl items-center shadow-lg shadow-indigo-100 mt-4">
                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Create User</Text>}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="px-5 pb-10">
            {usersLoading ? <ActivityIndicator size="large" color="#4f46e5" className="mt-10" /> : users.map(u => (
              <View key={u.id} className="bg-gray-50 p-4 rounded-2xl mb-3 border border-gray-100 flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="font-bold text-gray-800">{u.name}</Text>
                  <Text className="text-gray-500 text-sm">{u.enrollment}</Text>
                  <View className="flex-row mt-1">
                    <View className="bg-indigo-100 px-2 py-0.5 rounded-full mr-2"><Text className="text-indigo-700 text-xs font-bold">{u.role}</Text></View>
                    {u.designation && u.designation !== "NONE" && (
                      <View className="bg-purple-100 px-2 py-0.5 rounded-full"><Text className="text-purple-700 text-xs font-bold">{u.designation}</Text></View>
                    )}
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleDeleteUser(u.id, u.name)} className="p-2">
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default AdminDashboard;
