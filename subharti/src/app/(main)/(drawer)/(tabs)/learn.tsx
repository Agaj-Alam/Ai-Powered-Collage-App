import { View, Text, Image } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import imagePath from '@/src/constraints/imagePath';
import ProfileDetails from '@/src/components/atoms/ProfileDetails';

const learn = () => {
  const user=useSelector((state:any)=>state.user);

  return (
    <View className='flex-1 bg-white '>

     <ProfileDetails/>

      <Text className='self-center text-gray-600 mt-10 text-lg '>No new lectures are available</Text>

      <View className='bg-indigo-800 mt-7 rounded-lg ml-3 mr-3'>
        <Text className='py-3 text-white self-center text-lg'>View My Learnings</Text>
      </View>
    </View>
  )
}

export default learn