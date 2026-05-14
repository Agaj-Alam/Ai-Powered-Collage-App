import { Pressable, StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
type Props = {
  title: string;
};
const HeaderTitle = ({ title }: Props) => {
  return (
    <View className="" style={{ backgroundColor: "#312e81" }}>
      <View className="h-14 flex-row items-center px-4">
        <Pressable  onPress={()=>router.back()} className="w-10 justify-center">
        <Feather name="arrow-left" size={24} color="white" />
        </Pressable>

        <View className="flex-1 items-center">
        <Text className="text-white text-lg font-semibold">{title}</Text>

        </View>
      </View>
    </View>
  );
};

export default HeaderTitle;
