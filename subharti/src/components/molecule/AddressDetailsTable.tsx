import { Text, View } from "react-native";
import { useSelector } from "react-redux";

const AddressDetailsTable = () => {
  const user = useSelector((state: any) => state.user);

  const permanetAddressData = [
    { Label: "Permanent\n Address", value: user.parmanent_address },
    { Label: "Pin Code", value: user.pincode },
    { Label: "Email Id", value: user.email },
    { Label: "Contact No", value: user.contact_no },
  ];

  const localAddressData = [
    { Label: "Local Address", value: user.local_address },
    { Label: "Pin Code", value: user.pincode },
    { Label: "Email Id", value: user.email },
    { Label: "Contact No", value: user.contact_no },
  ];

  return (
    <View>
      {/* permanent addrress */}
      <View className="mx-4 mt-6 border border-gray-300  overflow-hidden">
        {permanetAddressData.map((item, index) => (
          <View key={index} className="flex-row border-b border-gray-300">
            <Text className="w-1/3 p-3 text-gray-500 border-r border-gray-300">
              {item.Label}
            </Text>
            <Text className="w-2/3 p-3 font-semibold text-black">
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      {/* local Address */}
      <View className="mx-4 mt-3 border border-gray-300  overflow-hidden">
        {localAddressData.map((item, index) => (
          <View key={index} className="flex-row border-b border-gray-300">
            <Text className="w-1/3 p-3 text-gray-500 border-r border-gray-300">
              {item.Label}
            </Text>
            <Text className="w-2/3 p-3 font-semibold text-black">
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AddressDetailsTable;
