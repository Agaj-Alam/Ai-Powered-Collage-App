import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { fetchLeaveById, getUploadUrl } from "@/src/services/api";
import imagePath from "@/src/constraints/imagePath";

const statusSteps = [
  { key: "dean", label: "Dean" },
  { key: "warden", label: "Warden" },
  { key: "chiefWarden", label: "Chief-Warden" },
];

const getStepStatus = (leaveStatus: string, step: string) => {
  const statusMap: Record<string, Record<string, string>> = {
    dean: {
      PENDING_AT_DEAN: "PENDING",
      APPROVED_BY_DEAN: "COMPLETED",
      REJECTED_BY_DEAN: "REJECTED",
      PENDING_AT_WARDEN: "COMPLETED",
      APPROVED_BY_WARDEN: "COMPLETED",
      REJECTED_BY_WARDEN: "COMPLETED",
      PENDING_AT_CHIEF_WARDEN: "COMPLETED",
      APPROVED_BY_CHIEF_WARDEN: "COMPLETED",
      REJECTED_BY_CHIEF_WARDEN: "COMPLETED",
      FULLY_APPROVED: "COMPLETED",
    },
    warden: {
      PENDING_AT_DEAN: "WAITING",
      APPROVED_BY_DEAN: "WAITING",
      REJECTED_BY_DEAN: "SKIPPED",
      PENDING_AT_WARDEN: "PENDING",
      APPROVED_BY_WARDEN: "COMPLETED",
      REJECTED_BY_WARDEN: "REJECTED",
      PENDING_AT_CHIEF_WARDEN: "COMPLETED",
      APPROVED_BY_CHIEF_WARDEN: "COMPLETED",
      REJECTED_BY_CHIEF_WARDEN: "COMPLETED",
      FULLY_APPROVED: "COMPLETED",
    },
    chiefWarden: {
      PENDING_AT_DEAN: "WAITING",
      APPROVED_BY_DEAN: "WAITING",
      REJECTED_BY_DEAN: "SKIPPED",
      PENDING_AT_WARDEN: "WAITING",
      APPROVED_BY_WARDEN: "WAITING",
      REJECTED_BY_WARDEN: "SKIPPED",
      PENDING_AT_CHIEF_WARDEN: "PENDING",
      APPROVED_BY_CHIEF_WARDEN: "COMPLETED",
      REJECTED_BY_CHIEF_WARDEN: "REJECTED",
      FULLY_APPROVED: "COMPLETED",
    },
  };
  return statusMap[step]?.[leaveStatus] || "WAITING";
};

const getStepColor = (status: string) => {
  if (status === "COMPLETED") return "bg-green-600";
  if (status === "PENDING") return "bg-orange-500";
  if (status === "REJECTED") return "bg-red-600";
  if (status === "SKIPPED") return "bg-gray-400";
  return "bg-gray-300";
};

const getStepLabel = (status: string) => {
  if (status === "COMPLETED") return "COMPLETED";
  if (status === "PENDING") return "PENDING";
  if (status === "REJECTED") return "REJECTED";
  if (status === "SKIPPED") return "N/A";
  return "Pending";
};

const getStepLabelColor = (status: string) => {
  if (status === "COMPLETED") return "text-white";
  if (status === "PENDING") return "text-white";
  if (status === "REJECTED") return "text-white";
  if (status === "SKIPPED") return "text-white";
  return "text-gray-400";
};

const getRemarkStatus = (leaveStatus: string, authority: string) => {
  const step = getStepStatus(leaveStatus, authority);
  if (step === "COMPLETED") return "Approved";
  if (step === "REJECTED") return "Rejected";
  if (step === "PENDING") return "Request";
  return "";
};

const getRemarkColor = (leaveStatus: string, authority: string) => {
  const step = getStepStatus(leaveStatus, authority);
  if (step === "COMPLETED") return "text-gray-900";
  if (step === "REJECTED") return "text-red-600";
  if (step === "PENDING") return "text-gray-900";
  return "text-gray-400";
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate().toString().padStart(2, "0")}-${months[d.getMonth()]}-${String(d.getFullYear()).slice(-2)}`;
};

const formatFullDate = (dateStr: string) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate().toString().padStart(2, "0")}-${months[d.getMonth()]}-${d.getFullYear()}`;
};

const daysBetween = (start: string, end: string) => {
  if (!start || !end) return 0;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1);
};

const details = () => {
  const { leaveId } = useLocalSearchParams();
  const user = useSelector((state: any) => state.user);
  const [leave, setLeave] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (leaveId) {
      loadLeave();
    }
  }, [leaveId]);

  const loadLeave = async () => {
    setLoading(true);
    try {
      const data = await fetchLeaveById(Number(leaveId));
      setLeave(data);
    } catch (error) {
      console.log("Error loading leave:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Leave Details",
            headerTitleAlign: "center",
            headerShown: true,
            headerStyle: { backgroundColor: "#2f2fa2" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
        <View className="flex-1 justify-center items-center bg-gray-100">
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text className="text-gray-500 mt-4">Loading leave details...</Text>
        </View>
      </>
    );
  }

  if (!leave) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Leave Details",
            headerTitleAlign: "center",
            headerShown: true,
            headerStyle: { backgroundColor: "#2f2fa2" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
        <View className="flex-1 justify-center items-center bg-gray-100">
          <Text className="text-gray-500 text-lg">Leave not found</Text>
        </View>
      </>
    );
  }

  const profileUrl = user?.profileImagePath ? getUploadUrl(user.profileImagePath) : null;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Leave Details",
          headerTitleAlign: "center",
          headerShown: true,
          headerStyle: { backgroundColor: "#2f2fa2" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <ScrollView className="flex-1 bg-gray-100" showsVerticalScrollIndicator={true}>
        {/* User info card */}
        <View className="bg-white rounded-2xl p-4 flex-row items-center mx-4 mt-4 shadow-sm border border-gray-100">
          <View className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-indigo-200">
            <Image
              source={profileUrl ? { uri: profileUrl } : imagePath.logo1}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <View className="flex-1">
            <Text className="text-indigo-800 font-bold text-base">{leave.studentName}</Text>
            <Text className="text-gray-600 text-base font-medium">
              {user?.college_name || "SUBHARTI INSTITUTE OF TECHNOLOGY AND ENGINEERING"}
            </Text>
            <Text className="text-gray-500 text-sm mt-0.5">
              {leave.applicationId}
            </Text>
          </View>
        </View>

        {/* Application progress */}
        <View className="bg-white rounded-2xl p-5 mx-4 mt-4 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold mb-4 text-gray-900">
            Application progress
          </Text>

          <View className="flex-row rounded-full overflow-hidden">
            {statusSteps.map((step, index) => {
              const stepStatus = getStepStatus(leave.status, step.key);
              const colorClass = getStepColor(stepStatus);
              const label = getStepLabel(stepStatus);

              return (
                <View
                  key={step.key}
                  className={`flex-1 ${colorClass} ${index > 0 ? "border-l-2 border-white" : ""}`}
                >
                  <Text className={`text-center font-bold text-xs py-2 ${getStepLabelColor(stepStatus)}`}>
                    {label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Date cards */}
          <View className="flex-row justify-between mt-5">
            <View className="bg-[#e2e7f7] rounded-2xl p-3 items-center justify-center" style={{ width: "38%" }}>
              <Text className="font-bold text-gray-900 text-sm">From date</Text>
              <Text className="mt-1 text-gray-700 text-base">{formatDate(leave.startDate)}</Text>
            </View>
            <View className="bg-[#e2e7f7] rounded-2xl p-3 items-center justify-center" style={{ width: "38%" }}>
              <Text className="font-bold text-gray-900 text-sm">To date</Text>
              <Text className="mt-1 text-gray-700 text-base">{formatDate(leave.endDate)}</Text>
            </View>
            <View className="bg-[#e2e7f7] rounded-2xl p-3 items-center justify-center" style={{ width: "18%" }}>
              <Text className="font-bold text-gray-900 text-sm">Days</Text>
              <Text className="mt-1 text-gray-700 text-base">{daysBetween(leave.startDate, leave.endDate)}</Text>
            </View>
          </View>
        </View>

        {/* Leave Details */}
        <View className="bg-white rounded-2xl p-5 mx-4 mt-4 shadow-sm border border-gray-100">
          <View className="mb-4">
            <Text className="font-bold text-gray-900">Applied on</Text>
            <Text className="text-gray-600 text-base mt-1">{formatFullDate(leave.appliedDate)}</Text>
          </View>

          <View className="mb-4">
            <Text className="font-bold text-gray-900">Leave type</Text>
            <Text className="text-gray-600 text-base mt-1">{leave.leaveType}</Text>
          </View>

          <View>
            <Text className="font-bold text-gray-900">Leave reason</Text>
            <Text className="text-gray-600 text-base mt-1">{leave.reason}</Text>
          </View>

          {/* Attachment preview */}
          {leave.attachmentUrl && (
            <View className="mt-4">
              <Text className="font-bold text-gray-900 mb-2">Attachment</Text>
              <Image
                source={{ uri: getUploadUrl(leave.attachmentUrl) } as any}
                className="w-full h-48 rounded-2xl"
                resizeMode="cover"
              />
            </View>
          )}
        </View>

        {/* Authority Table */}
        <View className="bg-white rounded-2xl overflow-hidden mx-4 mt-4 shadow-sm border border-gray-200">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ minWidth: 500 }}>
              {/* Header */}
              <View className="flex-row bg-[#2f2fa2] px-4 py-4">
                <View style={{ width: 130 }}>
                  <Text className="text-white font-bold text-base">Authority</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-base">Name</Text>
                </View>
                <View style={{ width: 100 }}>
                  <Text className="text-white font-bold text-base">Remark</Text>
                </View>
                <View style={{ width: 100 }}>
                  <Text className="text-white font-bold text-base text-right">Status</Text>
                </View>
              </View>

              {/* Row 1 - Dean */}
              <View className="flex-row px-4 py-4 border-b border-gray-100 items-center">
                <View style={{ width: 130 }}>
                  <Text className="text-gray-900 text-base font-medium">Dean/Principal</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 text-base">{leave.deanName}</Text>
                </View>
                <View style={{ width: 100 }}>
                  <Text className="text-gray-500 text-sm italic" numberOfLines={1}>{leave.deanRemarks || ""}</Text>
                </View>
                <View style={{ width: 100 }}>
                  <Text className={`text-right font-normal text-base ${getRemarkColor(leave.status, "dean")}`}>
                    {getRemarkStatus(leave.status, "dean")}
                  </Text>
                </View>
              </View>

              {/* Row 2 - Warden */}
              <View className="flex-row px-4 py-4 border-b border-gray-100 items-center">
                <View style={{ width: 130 }}>
                  <Text className="text-gray-900 text-base font-medium">Warden</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 text-base">{leave.wardenName}</Text>
                </View>
                <View style={{ width: 100 }}>
                  <Text className="text-gray-500 text-sm italic" numberOfLines={1}>{leave.wardenRemarks || ""}</Text>
                </View>
                <View style={{ width: 100 }}>
                  <Text className={`text-right font-normal text-base ${getRemarkColor(leave.status, "warden")}`}>
                    {getRemarkStatus(leave.status, "warden")}
                  </Text>
                </View>
              </View>

              {/* Row 3 - Chief-Warden */}
              <View className="flex-row px-4 py-4 items-center">
                <View style={{ width: 130 }}>
                  <Text className="text-gray-900 text-base font-medium">Chief-Warden</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 text-base">{leave.chiefWardenName}</Text>
                </View>
                <View style={{ width: 100 }}>
                  <Text className="text-gray-500 text-sm italic" numberOfLines={1}>{leave.chiefWardenRemarks || ""}</Text>
                </View>
                <View style={{ width: 100 }}>
                  <Text className={`text-right font-normal text-base ${getRemarkColor(leave.status, "chiefWarden")}`}>
                    {getRemarkStatus(leave.status, "chiefWarden")}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>



        {/* Bottom spacer */}
        <View className="h-8" />
      </ScrollView>
    </>
  );
};

export default details;
