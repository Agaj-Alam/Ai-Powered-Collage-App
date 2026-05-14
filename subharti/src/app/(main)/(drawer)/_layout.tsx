// import imagePath from "@/src/constraints/imagePath";
// import { logout } from "@/src/redux/auth/authSlice";
// import {
//   DrawerContentComponentProps,
//   DrawerContentScrollView,
// } from "@react-navigation/drawer";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import { Drawer } from "expo-router/drawer";
// import React from "react";
// import { Image, Pressable, Text, View } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useDispatch, useSelector } from "react-redux";
// import DrawerRow from "../../../components/DrawerRow";

// function CustomDrawerContent(props: DrawerContentComponentProps) {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const dispatch = useDispatch<any>();
//   const user=useSelector((state:any)=>state.user);

//   const handleNest = () => {
//     dispatch(logout());
//     router.replace("/(auth)/login");
//   };

//   return (
//     <View className="flex-1 ">
//       {/* for Header */}
//       <View style={{ paddingTop: insets.top }} className="px-5  pb-6">
//         {/* Student ID */}
//         <Text className="text-white text-lg font-semibold mb-4">
//           Student ID: {user.student_id}
//         </Text>

//         {/* Profile Card */}
//         <View className="bg-slate-300 rounded-2xl flex-row items-center p-4 min-h-[90px]">
//           <Image
//             source={imagePath.logo1}
//             className="w-16 h-16 rounded-full border-2 border-white"
//           />

//           <View className="ml-4">
//             <Text className="text-orange-700 font-bold text-lg">{user.name}</Text>
//             <Text className="text-gray-700 text-sm mt-1">E.No: </Text>
//           </View>
//         </View>
//       </View>

//       {/* white menu */}
//       <View className="flex-1 bg-white">
//         <DrawerContentScrollView
//           {...props}
//           contentContainerStyle={{ paddingHorizontal: 0}}
//           showsVerticalScrollIndicator={false}
//         >
//           <DrawerRow
//             icon={imagePath.leave}
//             label="Leave"
//             onPress={() => router.push("/leave")}
//           />
//           <DrawerRow
//             icon={imagePath.grievance}
//             label="Grievance"
//             onPress={() => router.push("/grievance")}
//           />
//           <DrawerRow
//             icon={imagePath.vahicle_pass}
//             label="Vahicle Pass"
//             onPress={() => router.push("/vahicle_pass")}
//           />
//           <DrawerRow
//             icon={imagePath.mess}
//             label="Mess"
//             onPress={() => router.push("/mess")}
//           />
//           <DrawerRow
//             icon={imagePath.important_numbers}
//             label="Important Numbers"
//             onPress={() => router.push("/important_numbers")}
//           />
//           <DrawerRow
//             icon={imagePath.events}
//             label="Events"
//             onPress={() => router.push("/events")}
//           />
//           <DrawerRow
//             icon={imagePath.welcome_booklet}
//             label="Welcome Booklet"
//             onPress={() => router.push("/welcome_booklet")}
//           />
//           <DrawerRow
//             icon={imagePath.face_photo}
//             label="Face Photo"
//             onPress={() => router.push("/face_photo")}
//           />
//           <DrawerRow
//             icon={imagePath.gallery}
//             label="Gallery"
//             onPress={() => router.push("/gallery")}
//           />
//           <DrawerRow
//             icon={imagePath.newsletter}
//             label="Newsletter"
//             onPress={() => router.push("/newsletter")}
//           />
//           <DrawerRow
//             icon={imagePath.faculty_list}
//             label="Faculty List"
//             onPress={() => router.push("/faculty_list")}
//           />
//           <DrawerRow
//             icon={imagePath.student_login}
//             label="Student Login"
//             onPress={() => router.push("/student_login")}
//           />
//           <DrawerRow
//             icon={imagePath.sbi_verification}
//             label="Sbi Verification"
//             onPress={() => router.push("/sbi_verification")}
//           />
//         </DrawerContentScrollView>
//       </View>

//       {/* Footer */}
//       <LinearGradient
//         colors={["rgba(189, 203, 240, 1)", "rgba(230, 230, 230, 1)"]}
//         locations={[0, 0.84]} //  0% and 84%
//         start={{ x: 0, y: 0 }} // 90deg → left to right
//         end={{ x: 1, y: 0 }}
//         className="flex-row items-center justify-between px-5 h-[80px] border-t border-gray-200"
//       >
//         <View>
//           <Text className="text-slate-850 size-15 ">Developed by</Text>
//           <Text className="text-slate-950 size-15 font-bold">Agaj Alam</Text>
//           <Text className="text-slate-700 size-15">version 2.1.1</Text>
//         </View>

//         <Pressable onPress={handleNest}>
//           <Image className="w-10 h-5" source={imagePath.next} />
//         </Pressable>
//       </LinearGradient>
//     </View>
//   );
// }

// const DrawerNav = () => {
//   return (
//     <Drawer
//       drawerContent={CustomDrawerContent}
//       screenOptions={{
//         drawerStyle: {
//           backgroundColor: "#2f2fa2",
//         },

//         //Header Tiltle Color 
//         headerShown:false
//       }}
//     ></Drawer>
//   );
// };

// export default DrawerNav;



import imagePath from "@/src/constraints/imagePath";
import { logout } from "@/src/redux/auth/authSlice";
import { clearUser } from "@/src/redux/userSlice";
import { clearLeaves } from "@/src/redux/leaveSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUploadUrl } from "@/src/services/api";

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import DrawerRow from "../../../components/DrawerRow";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<any>();

  const user = useSelector((state: any) => state.user);
  const profileUrl = user?.profileImagePath ? getUploadUrl(user.profileImagePath) : null;

  const handleNest = async () => {
    await AsyncStorage.removeItem("token");
    dispatch(logout());
    dispatch(clearUser());
    dispatch(clearLeaves());
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1 ">
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="px-5 pb-6">

        {/* Student ID */}
        <Text className="text-white text-lg font-semibold mb-4">
          Student ID: {user?.student_id || "N/A"}
        </Text>

        {/* Profile Card */}
        <View className="bg-slate-300 rounded-2xl flex-row items-center p-4 min-h-[90px]">
          <Image
            source={profileUrl ? { uri: profileUrl } : imagePath.logo1}
            className="w-16 h-16 rounded-full border-2 border-white"
          />

          <View className="ml-4">
            <Text className="text-orange-700 font-bold text-lg">
              {user?.name || "Student"}
            </Text>
            <Text className="text-gray-700 text-sm mt-1">
              E.No: {user?.enroll || ""}
            </Text>
          </View>
        </View>
      </View>

      {/* Menu */}
      <View className="flex-1 bg-white">
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{ paddingHorizontal: 0 }}
          showsVerticalScrollIndicator={false}
        >
          <DrawerRow icon={imagePath.leave} label="Leave" onPress={() => router.push("/leave")} />
          <DrawerRow icon={imagePath.grievance} label="Grievance" onPress={() => router.push("/grievance")} />
          <DrawerRow icon={imagePath.vahicle_pass} label="Vahicle Pass" onPress={() => router.push("/vahicle_pass")} />
          <DrawerRow icon={imagePath.mess} label="Mess" onPress={() => router.push("/mess")} />
          <DrawerRow icon={imagePath.important_numbers} label="Important Numbers" onPress={() => router.push("/important_numbers")} />
          <DrawerRow icon={imagePath.events} label="Events" onPress={() => router.push("/events")} />
          <DrawerRow icon={imagePath.welcome_booklet} label="Welcome Booklet" onPress={() => router.push("/welcome_booklet")} />
          <DrawerRow icon={imagePath.face_photo} label="Face Photo" onPress={() => router.push("/face_photo")} />
          <DrawerRow icon={imagePath.gallery} label="Gallery" onPress={() => router.push("/gallery")} />
          <DrawerRow icon={imagePath.newsletter} label="Newsletter" onPress={() => router.push("/newsletter")} />
          <DrawerRow icon={imagePath.faculty_list} label="Faculty List" onPress={() => router.push("/faculty_list")} />
          <DrawerRow icon={imagePath.student_login} label="Student Login" onPress={() => router.push("/student_login")} />
          <DrawerRow icon={imagePath.sbi_verification} label="Sbi Verification" onPress={() => router.push("/sbi_verification")} />
        </DrawerContentScrollView>
      </View>

      {/* Footer */}
      <LinearGradient
        colors={["rgba(189, 203, 240, 1)", "rgba(230, 230, 230, 1)"]}
        locations={[0, 0.84]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="flex-row items-center justify-between px-5 h-[80px] border-t border-gray-200"
      >
        <View>
          <Text>Developed by</Text>
          <Text className="font-bold">Agaj Alam</Text>
          <Text>version 2.1.1</Text>
        </View>

        <Pressable onPress={handleNest}>
          <Image className="w-10 h-5" source={imagePath.next} />
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const DrawerNav = () => {
  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#2f2fa2",
        },
        headerShown: false,
      }}
    />
  );
};

export default DrawerNav;