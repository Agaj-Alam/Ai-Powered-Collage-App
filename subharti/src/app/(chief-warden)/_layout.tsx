import { Stack } from "expo-router/stack";
import React from "react";

export default function ChiefWardenLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
