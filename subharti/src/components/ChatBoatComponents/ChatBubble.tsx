import imagePath from "@/src/constraints/imagePath";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import ChatModal from "./ChatModal";

const ChatBubble = () => {
  const [visible, setVisible] = useState(false);

  const { width, height } = Dimensions.get("window");

  const BUBBLE_SIZE = 64; // w-16 h-16
  const PADDING = 20;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const context = useSharedValue({ x: 0, y: 0 });

  const pan = Gesture.Pan()
    .onStart(() => {
      context.value = {
        x: translateX.value,
        y: translateY.value,
      };
    })
    .onUpdate((event) => {
      let newX = context.value.x + event.translationX;
      let newY = context.value.y + event.translationY;

      // Horizontal clamp
      const minX = PADDING;
      const maxX = width - BUBBLE_SIZE - PADDING;

      // Vertical clamp
      const minY = PADDING;
      const maxY = height - BUBBLE_SIZE - PADDING;

      if (newX < minX) newX = minX;
      if (newX > maxX) newX = maxX;

      if (newY < minY) newY = minY;
      if (newY > maxY) newY = maxY;

      translateX.value = newX;
      translateY.value = newY;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  useEffect(() => {
    const initialX = width - BUBBLE_SIZE - PADDING;
    const initialY = height - BUBBLE_SIZE - 650;

    translateX.value = initialX;
    translateY.value = initialY;
  }, []);

  return (
    <>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={animatedStyle}
          className="absolute  w-16 h-16  rounded-full items-center justify-center shadow-lg z-50"
        >
          <TouchableOpacity onPress={() => setVisible(true)}>
            {/* <FontAwesome5 name="robot" size={24} color="black" /> */}
            <LinearGradient
              colors={["#6366F1", "#8B5CF6", "#EC4899"]}
              className="w-16 h-16 rounded-full p-[2px] items-center justify-center overflow-hidden"
            >
              <View className="w-full h-full bg-white rounded-full overflow-hidden">
                <Image
                  source={imagePath.chatbot_image}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              {/* Online indicator */}
              <View className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </LinearGradient>

           <Text className="text-pink-500 text-xs whitespace-nowrap font-bold si">  Ai Assist
</Text>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>

      <ChatModal visible={visible} onClose={() => setVisible(false)} />
    </>
  );
};

export default ChatBubble;
