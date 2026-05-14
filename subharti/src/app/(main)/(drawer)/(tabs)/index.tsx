import SOSSlider from "@/src/components/SOSSlicer";
import GridCards from "@/src/components/molecule/GridItems";
import NewsCarousel from "@/src/components/molecule/NewsCarousel";
import NoticeCarousel from "@/src/components/molecule/NoticeCarousel";
import imagePath from "@/src/constraints/imagePath";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const index = () => {
  const user = useSelector((state: any) => state.user);

  const handleAppointment = () => {
    WebBrowser.openAuthSessionAsync(
      "https://hospital.subharti.org/Patient/SignUp",
    );
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Notice Carousel */}
      <NoticeCarousel />

      {/* Greatings  */}
      <Text className="text-2xl font-semibold px-4 mt-10">
        Jai Hind, {user.name}
      </Text>

      <View className="mt-6 items-center">
        <SOSSlider
          leftText="Alert"
          rightText="Calling"
          leftIcon={<MaterialIcons name="add-alert" size={22} color="red" />}
          rightIcon={<MaterialIcons name="add-call" size={22} color="red" />}
        />
      </View>

      {/* Customize Dashboard*/}
      <View className="flex-row justify-between items-center px-4 mt-8">
        <Text className="text-2xl font-semibold">Customise Your Dasboard</Text>
        <Ionicons name="grid-outline" size={22} />
      </View>

      {/* Grid cards */}
      <GridCards />

      {/* Slider  */}
      <View className="mt-5 items-center">
        <SOSSlider
          leftText="Download report"
          rightText="Book a lab test"
          leftTextStyle="text-indigo-800  font-bold text-lg"
          rightTextStyle="text-indigo-800  font-bold text-lg"
          multiLine={true}
          centerContent={
            <Image
              source={imagePath.central_lab}
              style={{ width: 40, height: 40 }}
            />
          }
        />
      </View>

      {/* book Appointment/  */}
      {/* Book Appointment */}
      <TouchableOpacity
        onPress={handleAppointment}
        className="mt-10 self-center bg-indigo-500 rounded-3xl px-6 py-3"
      >
        <Text className="text-xl font-bold text-white">
          Book Doctor's Appointment
        </Text>
      </TouchableOpacity>

      {/* news label */}
      <View className="flex-row items-center justify-between mt-8 py-2 px-4">
        <View className="flex-row items-center ">
          <MaterialIcons
            name="newspaper"
            size={24}
            color="black"
            className="px-2"
          />
          <Text className="text-xl font-bold ">Subharti News</Text>
        </View>
        <View>
          <Text className="text-xl font-bold bg-indigo-500 rounded-3xl px-3 py-1 text-white">
            Read more
          </Text>
        </View>
      </View>

      {/* News Carousel  */}
      <NewsCarousel />
    </ScrollView>
  );
};

export default index;
