import { Text, View } from "react-native";
import { useSelector } from "react-redux";

const PersonalDetailsTable = () => {
  const user = useSelector((state: any) => state.user);

  const tableData = [
    { label: "Admission No", value: null},
    { label: "Father's Name", value: user.father_name },
    { label: "Mother's Name", value: user.mother_name },
    { label: "Enrollment No", value: user.enroll },
    { label: "Date of Birth", value: user.date_of_birth },
    { label: "Gender", value: user.gender },
    { label: "Mobile No", value: user.mobile_no },
    { label: "Cast Category", value: user.cast_category },
    { label: "Religion", value: user.religion },
    { label: "Nationality", value: user.nationality },
    { label: "Aadhaar No.", value: user.adhaar },
  ];

  return (
    <View className="mx-4 mt-6 border border-gray-300 rounded-lg overflow-hidden">
      {tableData.map((item, index) => (
        <View 
        key={index} 
        className="flex-row border-b border-gray-200">
          <Text className="w-1/3 p-3 text-gray-500 border-r border-gray-300">
            {item.label}
          </Text>
          <Text className="w-2/3 p-3 font-semibold text-black">
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default PersonalDetailsTable;
