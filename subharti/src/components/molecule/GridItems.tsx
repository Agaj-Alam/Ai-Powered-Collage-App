import imagePath from "@/src/constraints/imagePath";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const NEWSLETTER_PDF_URL = "https://news.subharti.org/";
const WELCOME_BOOKLET_PDF_URL = "https://subharti.org/international-students/documents/prospectus/Prospectus%202024%20(1).pdf"; // 🔁 replace

const gridItems = [
  { title: "Leave", image: imagePath.leave, route: "/leave", pdfUrl: "" },
  { title: "Grievance", image: imagePath.grievance, route: "/grievance", pdfUrl: "" },
  { title: "Vehicle Pass", image: imagePath.vahicle_pass, route: "/vahicle_pass", pdfUrl: "" },
  { title: "Mess", image: imagePath.mess, route: "/mess", pdfUrl: "" },
  { title: "Important Numbers", image: imagePath.important_numbers, route: "/important_numbers", pdfUrl: "" },
  { title: "Events", image: imagePath.events, route: "/events", pdfUrl: "" },
  { title: "Welcome Booklet", image: imagePath.welcome_booklet, route: "", pdfUrl: WELCOME_BOOKLET_PDF_URL },
  { title: "Face Photo", image: imagePath.face_photo, route: "/face_photo", pdfUrl: "" },
  { title: "Gallery", image: imagePath.gallery, route: "/gallery", pdfUrl: "" },
  { title: "Newsletter", image: imagePath.newsletter, route: "", pdfUrl: NEWSLETTER_PDF_URL },
];

const GridCards = () => {
  const handlePress = (item: typeof gridItems[0]) => {
    if (item.pdfUrl) {
      WebBrowser.openBrowserAsync(item.pdfUrl);
    } else {
      router.push(item.route as any);
    }
  };

  return (
    <View className="flex-row flex-wrap pr-3 pl-2 mt-7 justify-between">
      {gridItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handlePress(item)}
          className="w-[48%] bg-indigo-100 rounded-2xl py-6 mb-2 ml-2 items-center"
        >
          <Image
            source={item.image}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <Text className="mt-3 text-gray-700 font-medium text-center">
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default GridCards;