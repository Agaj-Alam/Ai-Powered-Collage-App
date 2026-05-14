import React from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ContactCardProps {
  name: string;
  specialization: string;
  picture?: number | { uri: string };
  ext?: string;
  mobile?: string;
}

const ContactCard = ({ name, specialization, picture, ext, mobile }: ContactCardProps) => {
  return (
    <View className="flex-row items-center px-5 py-4 bg-white border-b border-gray-100">

      {/* Avatar — increased from w-12 h-12 to w-16 h-16 */}
      {picture ? (
        <Image
          source={typeof picture === "number" ? picture : { uri: (picture as { uri: string }).uri }}
          className="w-16 h-16 rounded-full mr-4"
          resizeMode="cover"
        />
      ) : (
        <View className="w-16 h-16 rounded-full bg-indigo-700 items-center justify-center mr-4">
          <Text className="text-white font-bold text-xl">
            {name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()}
          </Text>
        </View>
      )}

      {/* Info */}
      <View className="flex-1">
        <Text className="text-gray-900 font-bold text-base">{name}</Text>
        <Text className="text-gray-500 text-xs uppercase tracking-wide mt-1" numberOfLines={2}>
          {specialization}
        </Text>

        {(ext || mobile) && (
          <View className="flex-row gap-3 mt-1.5">
            {ext && <Text className="text-indigo-700 text-sm font-semibold">Ext: {ext}</Text>}
            {mobile && <Text className="text-indigo-700 text-sm font-semibold">Mo: {mobile}</Text>}
          </View>
        )}
      </View>

      {/* Call Icon */}
      {mobile && (
        <Pressable
          onPress={() => Linking.openURL(`tel:${mobile}`)}
          className="w-11 h-11 rounded-full items-center justify-center active:bg-indigo-100 ml-2"
        >
          <Ionicons name="call-outline" size={22} color="#374151" />
        </Pressable>
      )}

    </View>
  );
};

export default ContactCard;