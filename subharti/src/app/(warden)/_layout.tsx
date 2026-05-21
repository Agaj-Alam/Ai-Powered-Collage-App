import { Stack } from "expo-router/stack";
import React from "react";

export default function WardenLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
