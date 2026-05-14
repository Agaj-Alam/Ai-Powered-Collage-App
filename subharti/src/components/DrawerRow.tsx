import { View, Text ,TouchableOpacity,Image} from 'react-native'
import React from 'react'

type Props={
  icon:any;
  label:string,
  onPress:()=>void;
};

const DrawerRow = ({icon,label,onPress}: Props) => {
  return (
    <TouchableOpacity
    onPress={onPress}
    className='flex-row items-center px-5 py-4'
    >
      <Image source={icon} className='w-6 h-6'/>
      <Text className='ml-4 text-base text-black'>{label}</Text>
    </TouchableOpacity>
  )
}

export default DrawerRow