import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type LeaveData = {
  id: number;
  applicationId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  studentName: string;
  deanName: string;
  wardenName: string;
  chiefWardenName: string;
  appliedDate: string;
};

type Props = {
  leave: LeaveData;
};

const getStatusInfo = (status: string) => {
  if (status === "FULLY_APPROVED") return { label: "Approved", bg: "bg-green-600", cardBg: "bg-green-50", border: "border-green-200" };
  if (status.includes("REJECTED")) return { label: "Rejected", bg: "bg-red-600", cardBg: "bg-red-50", border: "border-red-200" };
  if (status.includes("PENDING")) {
    const at = status.replace("PENDING_AT_", "").replace("_", " ");
    return { label: "Pending", bg: "bg-orange-600", cardBg: "bg-orange-50", border: "border-orange-200" };
  }
  return { label: status, bg: "bg-gray-600", cardBg: "bg-gray-50", border: "border-gray-200" };
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()}-${months[d.getMonth()]}-${String(d.getFullYear()).slice(-2)}`;
};

const LeaveCard = ({ leave }: Props) => {
  const router = useRouter();
  const statusInfo = getStatusInfo(leave.status);

  return (
    <TouchableOpacity
      activeOpacity={0.4}
      onPress={() => router.push({ pathname: "/leave/details", params: { leaveId: leave.id } })}
      className={`rounded-2xl p-4 mb-4 border ${statusInfo.cardBg} ${statusInfo.border}`}
    >
      {/* Top row */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-gray-900">{leave.applicationId}</Text>

        <View className={`px-4 py-1 rounded-full ${statusInfo.bg}`}>
          <Text className="text-white text-sm font-medium">
            {statusInfo.label}
          </Text>
        </View>
      </View>

      {/* Date */}
      <View className="flex-row items-center mb-2">
        <Text className="text-gray-600 text-sm">
          📅 {formatDate(leave.startDate)} to {formatDate(leave.endDate)}
        </Text>
      </View>

      {/* Leave type */}
      {/* <View className="flex-row items-center mb-2">
        <Text className="text-indigo-600 font-bold text-xs">{leave.leaveType}</Text>
      </View> */}

      {/* Authority */}
      <Text className="text-gray-700 font-medium">
        Rep. Authority: {leave.deanName !== "N/A" ? leave.deanName : "—"}
      </Text>
    </TouchableOpacity>
  );
};

export default LeaveCard;
