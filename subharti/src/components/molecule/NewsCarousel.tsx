import imagePath from "@/src/constraints/imagePath";
import { View, Text, FlatList, Image, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const data = [
  {
    id: "1",
    image: imagePath.news1,
    date: "2025-07-02T14:24:27",
  },
  {
    id: "2",
    image: imagePath.news2,
    date: "2025-08-10T10:00:00",
  },
  {
    id: "3",
    image: imagePath.news3,
    date: "2025-09-15T09:30:00",
  },
];

export default function NewsCarousel() {
  return (
    <View className="mt-4">
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width * 0.8}
        decelerationRate="fast"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{ width: width * 0.8 }}
            className="mx-2 rounded-xl overflow-hidden"
          >
            {/* IMAGE */}
            <Image
              source={item.image}
              className="w-full h-48"
              resizeMode="cover"
            />

            {/* 🔥 OVERLAY */}
            <View className="absolute bottom-0 w-full bg-black/40 px-3 py-2">
              <Text className="text-white text-sm">
                Date: {item.date}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}