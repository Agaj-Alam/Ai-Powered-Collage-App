import React from "react";
import { Dimensions, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PILL_WIDTH = SCREEN_WIDTH * 0.85;
const KNOB_SIZE = 80;
const MAX_X = PILL_WIDTH - KNOB_SIZE;

type Props = {
  leftText?: string;
  rightText?: string;
  centerContent?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  leftTextStyle?: string; //NativeWind classes
  rightTextStyle?: string;
  multiLine?: boolean; // //
};

export default function SOSSlider({
  leftText = "Alert",
  rightText = "Calling",

  centerContent,

  leftIcon,
  rightIcon,

  leftTextStyle = "text-red-600 font-semibold text-lg",
  rightTextStyle = "text-red-600 font-semibold text-lg",
  multiLine = false,
}: Props) {
  const CENTER = MAX_X / 2;

  // 🔵 Start from center
  const translateX = useSharedValue(CENTER);

  // 🔥 Action handler
  const triggerAction = (pos: number) => {
    // if (pos < MAX_X * 0.3) {
    //   console.log("🚨 ALERT TRIGGERED");
    // } else if (pos > MAX_X * 0.7) {
    //   console.log("📞 CALLING TRIGGERED");
    // } else {
    //   console.log("🆘 SOS TRIGGERED");
    // }
  };

  // 👉 Gesture
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      let newX = e.translationX + CENTER;

      if (newX < 0) newX = 0;
      if (newX > MAX_X) newX = MAX_X;

      translateX.value = newX;
    })
    .onEnd(() => {
      runOnJS(triggerAction)(translateX.value);

      // 🔁 Always return to center
      translateX.value = withSpring(CENTER, {
        damping: 15,
        stiffness: 150,
      });
    });

  // 🎨 Knob style
  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // 🎨 Directional Fill (FIXED)
  const fillStyle = useAnimatedStyle(() => {
    if (translateX.value < CENTER) {
      // 👉 LEFT SIDE
      return {
        left: translateX.value,
        width: CENTER - translateX.value + KNOB_SIZE / 2,
        backgroundColor: "#2f2fa2",
      };
    } else if (translateX.value > CENTER) {
      // 👉 RIGHT SIDE
      return {
        left: CENTER + KNOB_SIZE / 2,
        width: translateX.value - CENTER,
        backgroundColor: "#2f2fa2",
      };
    } else {
      return {
        width: 0,
      };
    }
  });

  return (
    <View className="items-center mt-8">
      {/* PILL */}
      <View
        style={{ width: PILL_WIDTH }}
        className="h-16 bg-white rounded-full border border-blue-700 justify-center "
      >
        {/* 🔵 DYNAMIC FILL */}
        <Animated.View
          style={fillStyle}
          className="absolute h-full rounded-full"
        />

        {/* TEXT */}
        <View className="absolute w-full flex-row justify-between px-6">
          {/* LEFT */}
          <View className="flex-row items-start gap-1 max-w-[45%]">
            <Text
              className={`${leftTextStyle} text-center ${multiLine ? "leading-4" : ""}`}
              numberOfLines={multiLine ? 2 : 1}
            >
              {multiLine ? leftText.replace(" ", "\n") : leftText}
            </Text>

            {leftIcon && leftIcon}
          </View>

          {/* RIGHT */}
          <View className="flex-row items-start gap-1 max-w-[45%]">
            <Text
              className={`${rightTextStyle} text-center ${multiLine ? "leading-4" : ""}`}
              numberOfLines={multiLine ? 2 : 1}
            >
              {multiLine ? rightText.replace(" ", "\n") : rightText}
            </Text>

            {rightIcon && rightIcon}
          </View>
        </View>

        {/* KNOB */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              knobStyle,
              {
                width: KNOB_SIZE,
                height: KNOB_SIZE,
                borderRadius: KNOB_SIZE / 2,
              },
            ]}
            className="absolute bg-white border-2 border-blue-700 items-center justify-center shadow-lg"
          >
            {centerContent ? (
              centerContent
            ) : (
              <Text className="text-red-600 font-bold text-lg">SOS</Text>
            )}
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}
