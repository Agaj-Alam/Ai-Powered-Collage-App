import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const index = () => {
  return (
     <>
    <Stack.Screen
        options={{
          title: "Subharti Mess Details",
          headerTitleAlign: "center",
          headerShown: true,
        }}
      />

      <View className='flex-1 justify-center items-center'>
        <View className=' w-10 h-10 rounded-full border'/>
        <Text className='text-2xl font-semibold mt-7' >No data found</Text>
      </View>
    </>
  )
}

export default index