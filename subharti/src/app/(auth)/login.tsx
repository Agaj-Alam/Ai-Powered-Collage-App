import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { loginUser } from "@/src/redux/auth/authSlice";
import imagePath from "@/src/constraints/imagePath";

const roles = [
  { id: "STUDENT", label: "Student", color: "#06b6d4" },
  { id: "FACULTY", label: "Faculty", color: "#4f46e5" },
  { id: "GUARDIAN", label: "Guardian", color: "#8b5cf6" },
  { id: "ALUMNI", label: "Alumni", color: "#ec4899" },
  { id: "ADMIN", label: "Admin", color: "#f59e0b" },
];

const Login = () => {
  const [enrollment, setEnrollment] = useState("");
  const [dob, setDob] = useState("");
  const [selectedRole, setSelectedRole] = useState("STUDENT");

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state: any) => state.auth);

  const handleLogin = async () => {
    if (!enrollment || !dob) {
      Alert.alert("Error", "Please enter both enrollment and DOB");
      return;
    }

    const resultAction: any = await (dispatch as any)(loginUser({ enrollment, dob, role: selectedRole } as any));

    if (loginUser.fulfilled.match(resultAction)) {
      const role = resultAction.payload.user.role;
      const designation = resultAction.payload.user.designation;

      if (role === "ADMIN") router.replace("/(admin)/dashboard");
      else if (role === "FACULTY" && designation === "DEAN") router.replace("/(dean)/dashboard");
      else if (role === "GUARDIAN" && designation === "WARDEN") router.replace("/(warden)/dashboard");
      else if (role === "GUARDIAN" && designation === "CHIEF_WARDEN") router.replace("/(chief-warden)/dashboard");
      else if (role === "ALUMNI") router.replace("/(alumni)/dashboard");
      else router.replace("/(main)/(drawer)/(tabs)");
    } else {
      Alert.alert("Login Failed", resultAction.payload || "Invalid credentials");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="h-64 justify-center items-center" style={{ backgroundColor: "#2f2fa2" }}>
          <Image
            source={imagePath.header_logo}
            className="w-48 h-20"
            resizeMode="contain"
          />
        </View>

        <View className="flex-1 -mt-10 bg-white rounded-t-[40px] px-8 pt-10 shadow-2xl">
          <Text className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</Text>
          <Text className="text-gray-500 mb-8">Please login to continue</Text>

          <View className="space-y-6">
            <View>
              <Text className="text-gray-600 mb-2 ml-1 font-medium">Enrollment Number</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800"
                placeholder="Enter enrollment number"
                value={enrollment}
                onChangeText={setEnrollment}
                autoCapitalize="none"
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-600 mb-2 ml-1 font-medium">Date of Birth</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800"
                placeholder="DDMMYYYY (e.g. 06042003)"
                value={dob}
                onChangeText={setDob}
              />
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="mt-10 rounded-2xl py-4 items-center shadow-lg"
              style={{ backgroundColor: roles.find(r => r.id === selectedRole)?.color || "#2f2fa2" }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-bold">Login</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-auto pb-8 pt-10">
            <Text className="text-center text-gray-400 mb-4 font-medium uppercase tracking-widest text-xs">Login As</Text>
            <View className="flex-row justify-between flex-wrap">
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  onPress={() => setSelectedRole(role.id)}
                  className={`items-center justify-center w-[18%] py-3 rounded-2xl border ${selectedRole === role.id ? "bg-gray-50 border-gray-300" : "border-transparent"
                    }`}
                >
                  <View
                    className="w-2 h-2 rounded-full mb-1"
                    style={{ backgroundColor: role.color }}
                  />
                  <Text
                    className={`text-[10px] font-bold ${selectedRole === role.id ? "text-gray-800" : "text-gray-400"
                      }`}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;