import React from "react";
import { Dimensions, FlatList, Text, View } from "react-native";
const NoticeCarousel = () => {
  const { width } = Dimensions.get("window");
  const notices = [
    {
      id: "1",
      title: "Notice-National Days with Celebration...",
      desc: "All students, teachers, and staff will report for the Celebration (except those on emer...",
      date: "01/14/2026 00:00:00",
    },
    {
      id: "2",
      title: "Notice-National Days with Celebration...",
      desc: "All students, teachers, and staff will report...",
      date: "01/14/2026 00:00:00",
    },
    {
      id: "3",
      title: "Notice-National Days with Celebration...",
      desc: "All students, teachers, and staff will report...",
      date: "01/14/2026 00:00:00",
    },
  ];
  return (
    <View className="mt-2">
      <FlatList
        data={notices}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width * 0.8}
        decelerationRate="fast"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{ width: width * 0.8 }}
            className="bg-indigo-700 rounded-2xl p-4 mx-2"
          >
            <Text className="text-white font-bold text-lg">{item.title}</Text>

            <Text className="text-white mt-1 text-base ">{item.desc}</Text>

            <Text className="text-white mt-1 text-base">Date: {item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};
export default NoticeCarousel;
