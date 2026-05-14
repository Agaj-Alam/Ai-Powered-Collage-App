import { Text, View } from "react-native";
import { useSelector } from "react-redux";

const CollegeDetailsTable = () => {
  const user = useSelector((state: any) => state.user);

  const collegeData = [
    { Label: "College Name", value: user.college_name },
    { Label: "Admission\nSession", value: user.admission_session },
    { Label: "Course", value: user.course },
    { Label: "Specialization", value: user.specialization },
    { Label: "Data of\nAdmission", value: user.date_of_admission },
    { Label: "Year-Sem", value: "-" },
    { Label: "College Name", value: null },
  ];

  return (
    <View className="mx-4 mt-6 border border-gray-300 overflow-hidden">
      {collegeData.map((item, index) => (
        <View key={index} className="flex-row border-b border-gray-300 ">
          <Text className="w-1/3 p-3 text-gray-500 border-r border-gray-300">
            {item.Label}
          </Text>
          <Text className="w-2/3 p-3 font-semibold text-black">
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default CollegeDetailsTable;
