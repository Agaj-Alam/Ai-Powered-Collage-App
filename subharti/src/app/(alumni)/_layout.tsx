import { Stack } from "expo-router/stack";
import React from "react";

export default function AlumniLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#2f2fa2" },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
      }}
    />
  );
}
