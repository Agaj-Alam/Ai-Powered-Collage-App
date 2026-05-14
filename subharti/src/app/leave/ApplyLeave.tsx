import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  Alert, ActivityIndicator, Image, Platform, Modal, FlatList, KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { applyLeaveApi, fetchDeans, fetchWardens, fetchChiefWardens } from "@/src/services/api";
import { useDispatch } from "react-redux";
import { loadMyLeaves } from "@/src/redux/leaveSlice";

const formatDisplayDate = (date: Date) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate().toString().padStart(2, "0")}-${months[date.getMonth()]}-${date.getFullYear()}`;
};

const formatApiDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const daysBetween = (start: Date, end: Date) => {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1);
};

const ApplyLeave = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [leaveType, setLeaveType] = useState("BOTH");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState("");
  const [attachment, setAttachment] = useState<any>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [deans, setDeans] = useState<any[]>([]);
  const [wardens, setWardens] = useState<any[]>([]);
  const [chiefWardens, setChiefWardens] = useState<any[]>([]);

  const [selectedDean, setSelectedDean] = useState<any>(null);
  const [selectedWarden, setSelectedWarden] = useState<any>(null);
  const [selectedChiefWarden, setSelectedChiefWarden] = useState<any>(null);

  const [showDeanDropdown, setShowDeanDropdown] = useState(false);
  const [showWardenDropdown, setShowWardenDropdown] = useState(false);
  const [showChiefWardenDropdown, setShowChiefWardenDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const totalDays = daysBetween(startDate, endDate);

  useEffect(() => {
    loadAuthorities();
  }, []);

  const loadAuthorities = async () => {
    setAuthLoading(true);
    try {
      const [d, w, cw] = await Promise.all([fetchDeans(), fetchWardens(), fetchChiefWardens()]);
      setDeans(d);
      setWardens(w);
      setChiefWardens(cw);
      if (d.length === 1) setSelectedDean(d[0]);
      if (w.length === 1) setSelectedWarden(w[0]);
      if (cw.length === 1) setSelectedChiefWarden(cw[0]);
    } catch (error) {
      Alert.alert("Error", "Failed to load authorities");
    } finally {
      setAuthLoading(false);
    }
  };

  const onStartDateChange = (_: any, date?: Date) => {
    setShowStartPicker(Platform.OS === "ios");
    if (date) {
      setStartDate(date);
      if (date > endDate) setEndDate(date);
    }
  };

  const onEndDateChange = (_: any, date?: Date) => {
    setShowEndPicker(Platform.OS === "ios");
    if (date) {
      if (date < startDate) {
        Alert.alert("Invalid", "End date cannot be before start date");
        return;
      }
      setEndDate(date);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setAttachment(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert("Error", "Please enter a reason for leave");
      return;
    }
    if (leaveType !== "HOSTEL" && !selectedDean) {
      Alert.alert("Error", "Please select Dean/Principal authority");
      return;
    }
    if (!selectedWarden) {
      Alert.alert("Error", "Please select Warden approval");
      return;
    }
    if (!selectedChiefWarden) {
      Alert.alert("Error", "Please select Chief-Warden approval");
      return;
    }

    setLoading(true);
    try {
      const leaveData = {
        leaveType,
        startDate: formatApiDate(startDate),
        endDate: formatApiDate(endDate),
        reason: reason.trim(),
        deanId: leaveType === "HOSTEL" ? null : selectedDean.id,
        wardenId: selectedWarden.id,
        chiefWardenId: selectedChiefWarden.id,
      };

      await applyLeaveApi(leaveData, attachment);
      // Dispatch to refresh the leaves list immediately
      dispatch(loadMyLeaves() as any);
      Alert.alert("Success", "Leave application submitted!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to submit leave application");
    } finally {
      setLoading(false);
    }
  };

  // Dropdown modal component
  const DropdownSelector = ({ label, items, selected, visible, onToggle, onSelect }: any) => (
    <View className="mb-5">
      <Text className="text-gray-500 text-xs mb-1 ml-3">{label} *</Text>
      <TouchableOpacity
        onPress={onToggle}
        className="border border-gray-300 rounded-xl px-4 py-4 flex-row justify-between items-center bg-white"
      >
        <Text className={selected ? "text-gray-800 text-base" : "text-gray-400 text-base"}>
          {selected ? selected.name : "--Select--"}
        </Text>
        <Ionicons name={visible ? "chevron-up" : "chevron-down"} size={20} color="#6b7280" />
      </TouchableOpacity>

      {visible && (
        <View className="border border-gray-200 rounded-xl mt-1 bg-white shadow-sm overflow-hidden">
          {items.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                onSelect(item);
                onToggle();
              }}
              className={`px-4 py-3 border-b border-gray-100 ${selected?.id === item.id ? "bg-indigo-50" : ""
                }`}
            >
              <Text className={`text-base ${selected?.id === item.id ? "text-indigo-700 font-bold" : "text-gray-700"
                }`}>
                {item.name}
              </Text>
              {item.designation && (
                <Text className="text-gray-400 text-xs">{item.designation}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Apply Leave",
          headerTitleAlign: "center",
          headerShown: true,
          headerStyle: { backgroundColor: "#2f2fa2" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          className="flex-1 bg-gray-100"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        >
          {/* Leave Type Radio */}
          <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="font-bold text-base mb-5 mt-1 self-center ">Leave Type</Text>
            <View className="flex-row justify-around items-center">
              {["HOSTEL", "COLLEGE", "BOTH"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setLeaveType(type)}
                  className="flex-row items-center"
                >
                  <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${leaveType === type ? "border-green-600" : "border-gray-400"
                    }`}>
                    {leaveType === type && (
                      <View className="w-3 h-3 rounded-full bg-green-600" />
                    )}
                  </View>
                  <Text className={`ml-2 font-medium text-base ${leaveType === type ? "text-gray-900" : "text-gray-500"
                    }`}>
                    {type === "HOSTEL" ? "Hostel" : type === "COLLEGE" ? "College" : "Both"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Pickers */}
          <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm border border-gray-100">
            <View className="flex-row justify-between">
              <View className="flex-1 mr-2">
                <Text className="text-center font-bold text-gray-800 mb-2">Start Date</Text>
                <TouchableOpacity
                  onPress={() => setShowStartPicker(true)}
                  className="bg-gray-50 rounded-xl py-3 px-4 border border-gray-200 items-center"
                >
                  <Text className="text-gray-800 text-base">{formatDisplayDate(startDate)}</Text>
                </TouchableOpacity>
              </View>
              <Text className="self-center mt-6 text-gray-400 mx-1">-</Text>
              <View className="flex-1 ml-2">
                <Text className="text-center font-bold text-gray-800 mb-2">End Date</Text>
                <TouchableOpacity
                  onPress={() => setShowEndPicker(true)}
                  className="bg-gray-50 rounded-xl py-3 px-4 border border-gray-200 items-center"
                >
                  <Text className="text-gray-800 text-base">{formatDisplayDate(endDate)}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onStartDateChange}
              minimumDate={new Date()}
            />
          )}
          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onEndDateChange}
              minimumDate={startDate}
            />
          )}

          {/* Leave Summary Table */}
          <View className="bg-white mx-4 mt-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {/* Table Header */}
            <View className="flex-row bg-indigo-800 px-4 py-3">
              <Text className="flex-1 text-white font-semibold">Leave Date</Text>
              <Text className="flex-1 text-white font-semibold text-center">Leave Type</Text>
              <Text className="text-white font-semibold w-16 text-center">Total</Text>
            </View>
            {/* Table Row */}
            <View className="flex-row px-4 py-3 items-center border-b border-gray-100">
              <Text className="flex-1 text-gray-700">{formatDisplayDate(startDate)}</Text>
              <View className="flex-1 items-center">
                <View className="bg-indigo-100 px-3 py-1 rounded-full">
                  <Text className="text-indigo-700 font-bold text-sm">
                    {leaveType === "HOSTEL" ? "Hostel" : leaveType === "COLLEGE" ? "College" : "Both"}
                  </Text>
                </View>
              </View>
              <Text className="w-16 text-center text-gray-700 font-medium">{totalDays}.0</Text>
            </View>
          </View>

          {/* Total Days */}
          <View className="mx-4 mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="text-gray-500 text-xs mb-1 ml-3">Total days</Text>
            <View className="border border-gray-300 rounded-xl px-4 py-4 bg-white">
              <Text className="text-gray-800 text-lg font-medium">{totalDays}</Text>
            </View>
          </View>

          {/* Authority Selectors */}
          {authLoading ? (
            <View className="mx-4 mt-4 bg-white rounded-2xl p-8 items-center shadow-sm border border-gray-100">
              <ActivityIndicator size="small" color="#4f46e5" />
              <Text className="text-gray-400 mt-2">Loading authorities...</Text>
            </View>
          ) : (
            <View className="mx-4 mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              {leaveType !== "HOSTEL" && (
                <DropdownSelector
                  label="Dean/Principal authority"
                  items={deans}
                  selected={selectedDean}
                  visible={showDeanDropdown}
                  onToggle={() => {
                    setShowDeanDropdown(!showDeanDropdown);
                    setShowWardenDropdown(false);
                    setShowChiefWardenDropdown(false);
                  }}
                  onSelect={setSelectedDean}
                />
              )}
              <DropdownSelector
                label="Warden Approval"
                items={wardens}
                selected={selectedWarden}
                visible={showWardenDropdown}
                onToggle={() => {
                  setShowWardenDropdown(!showWardenDropdown);
                  setShowDeanDropdown(false);
                  setShowChiefWardenDropdown(false);
                }}
                onSelect={setSelectedWarden}
              />
              <DropdownSelector
                label="Chief-Warden Approval"
                items={chiefWardens}
                selected={selectedChiefWarden}
                visible={showChiefWardenDropdown}
                onToggle={() => {
                  setShowChiefWardenDropdown(!showChiefWardenDropdown);
                  setShowDeanDropdown(false);
                  setShowWardenDropdown(false);
                }}
                onSelect={setSelectedChiefWarden}
              />
            </View>
          )}

          {/* Reason */}
          <View className="mx-4 mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="text-gray-500 text-xs mb-1 ml-3">Leave Reason *</Text>
            <TextInput
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-xl p-4 text-gray-800 text-base bg-white"
              placeholder="Write a detailed reason"
              placeholderTextColor="#9ca3af"
              value={reason}
              onChangeText={setReason}
              textAlignVertical="top"
              style={{ minHeight: 300 }}
            />
          </View>

          {/* Attachment */}
          <View className="mx-4 mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <TouchableOpacity onPress={pickImage} className="flex-row items-center bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
              <Ionicons name="attach" size={24} color="#4f46e5" />
              <Text className="ml-2 text-indigo-600 font-bold">
                {attachment ? "File Attached ✓" : "Attach Document/Image"}
              </Text>
              {attachment && <Image source={{ uri: attachment.uri }} className="w-10 h-10 ml-auto rounded-lg" />}
            </TouchableOpacity>
          </View>

          {/* Submit */}
          <View className="mx-4 mt-6 mb-10">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className="bg-indigo-700 py-4 rounded-2xl items-center shadow-lg"
              style={{ elevation: 4 }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Submit Application</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default ApplyLeave;