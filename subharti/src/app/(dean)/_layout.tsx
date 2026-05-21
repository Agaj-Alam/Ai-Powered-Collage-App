import { Stack } from "expo-router/stack";
import React from "react";

export default function DeanLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
