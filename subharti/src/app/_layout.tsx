// import { Stack } from "expo-router/stack";
// import { ActivityIndicator, View } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Provider, useSelector } from "react-redux";
// import "../../globals.css";
// import ChatBubble from "../components/ChatBoatComponents/ChatBubble";
// import { store } from "../redux/store";

// function RootNavigator() {
//   const user = useSelector((state: any) => state.auth.user);

//   if (user === undefined) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <Stack
//       screenOptions={{
//         headerStyle: {
//           backgroundColor: "#2f2fa2", // 🔵 blue header
//         },
//         headerTintColor: "#fff",
//         headerTitleStyle: {
//           // fontWeight: "600",
//         },
//         headerShown: false,
//       }}
//     >
//       {!user ? (
//         <Stack.Screen name="(auth)/login" />
//       ) : (
//         <Stack.Screen name="(main)/(drawer)" />
//       )}
//     </Stack>
//   );
// }

// export default function RootLayout() {
//   return (


//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Provider store={store}>
//         <View className="flex-1">
//           <RootNavigator />
//           <ChatBubble />
//         </View>
//       </Provider>
//     </GestureHandlerRootView>
//   );
// }





import { Stack } from "expo-router/stack";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useSelector } from "react-redux";
import "../../globals.css";
import ChatBubble from "../components/ChatBoatComponents/ChatBubble";
import { store } from "../redux/store";

function RootNavigator() {
  const { token } = useSelector((state: any) => state.auth); // ✅ CHANGED

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#2f2fa2",
        },
        headerTintColor: "#fff",
        headerShown: false,
      }}
    >
      {!token ? (
        <Stack.Screen name="(auth)/login" />
      ) : (
        <>
          <Stack.Screen name="(main)/(drawer)" />
          <Stack.Screen name="(admin)" />
          <Stack.Screen name="(dean)" />
          <Stack.Screen name="(warden)" />
          <Stack.Screen name="(chief-warden)" />
          <Stack.Screen name="(alumni)" />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <View className="flex-1">
          <RootNavigator />
          <ChatBubble />
        </View>
      </Provider>
    </GestureHandlerRootView>
  );
}