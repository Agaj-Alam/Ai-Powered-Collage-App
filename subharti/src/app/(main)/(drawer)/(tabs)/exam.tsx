import React from "react";
import { Image, View } from "react-native";

const exam = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image
        source={require("@/src/assets/images/failedToReachServer.png")}
        className="w-80 h-70"
        resizeMode="contain"
      />
    </View>
  );
};

export default exam;
