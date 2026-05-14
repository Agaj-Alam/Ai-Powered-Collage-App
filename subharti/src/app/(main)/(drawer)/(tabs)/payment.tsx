import { View, Image } from "react-native";
import React from "react";

const Payment = () => {
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

export default Payment;