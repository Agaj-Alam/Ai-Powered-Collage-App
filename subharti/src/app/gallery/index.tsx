import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const index = () => {
  return (
    <>
    <Stack.Screen
        options={{
          title: "Gallery",
          headerTitleAlign: "center",
          headerShown: true,
        }}
      />
    </>
  )
}

export default index