import { View, Text, Image } from "react-native";
import React from "react";
import imagePath from "@/src/constraints/imagePath";
import { useSelector } from "react-redux";
import { getUploadUrl } from "@/src/services/api";

const ProfileDetails = () => {
  const user = useSelector((state: any) => state.user);
  const profileUrl = user?.profileImagePath ? getUploadUrl(user.profileImagePath) : null;

  return (
    <View className="flex-row mt-8 ml-8">
      <View>
        <Image
          source={profileUrl ? { uri: profileUrl } : imagePath.logo1}
          className="w-16 h-16 rounded-full p-4"
        />
      </View>
      <View className="ml-8">
        <Text className="font-bold text-indigo-900">{user?.name || "Student"}</Text>
        <Text className="text-gray-600">E.No: {user?.enroll || "—"}</Text>
        <Text className="text-gray-600">Course: {user?.course || "—"}</Text>
      </View>
    </View>
  );
};

export default ProfileDetails;
