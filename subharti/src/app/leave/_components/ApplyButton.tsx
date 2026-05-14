import { View, Text,TouchableOpacity } from 'react-native'
import {Ionicons} from "@expo/vector-icons"
import React from 'react'
import { router } from 'expo-router'

const ApplyButton = () => {
  
  const applyLeave=()=>{
    router.push("/leave/ApplyLeave")
  }

  return (
    <View className="absolute bottom-6 right-6">
      <TouchableOpacity onPress={applyLeave} className="flex-row items-center bg-indigo-800 px-6 py-4 rounded-full shadow-lg">
        <Ionicons name="add" size={22} color="white" />
        <Text className="text-white font-semibold ml-2">
          Apply new
        </Text>
      </TouchableOpacity >
    </View>
  )
}

export default ApplyButton