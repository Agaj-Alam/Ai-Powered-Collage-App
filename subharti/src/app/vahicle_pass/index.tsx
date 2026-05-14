import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const index = () => {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Vehicle Pass",
          headerTitleAlign: "center",
          headerShown: true,
          headerStyle: { backgroundColor: '#3730a3' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      <View className='flex-1 bg-gray-100'>
        <View className='flex-row mx-3 my-3'>

          {/* My Pass Card */}
          <TouchableOpacity style={{ width: 120, height: 120 }} className=' rounded-2xl justify-center items-center bg-gray-200'>
            <Image
              className='w-18 h-16'
              resizeMode='contain'
              source={require("@/src/assets/images/applyImage.png")}
            />
            <Text className='mt-2 text-sm font-medium text-gray-800'>My Pass</Text>
          </TouchableOpacity>

          {/* Apply Card */}
          <TouchableOpacity  style={{ width: 120, height: 120 }} className=' rounded-2xl justify-center items-center bg-gray-200 ml-3'>
            <Image
              className='w-18 h-16'
              resizeMode='contain'
              source={require("@/src/assets/images/myPassImage.png")}
            />
            <Text className='mt-2 text-sm font-medium text-gray-800'>Apply</Text>
          </TouchableOpacity>

        </View>
      </View>
    </>
  )
}

export default index