import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./auth/authSlice";

const initialState = {
  name: null,
  student_id: null,
  enroll: null,
  course: null,
  college_name: null,
  application_id: null,
  specialization: null,
  admission_session: null,
  date_of_admission: null,
  father_name: null,
  mother_name: null,
  date_of_birth: null,
  gender: null,
  mobile_no: null,
  cast_category: null,
  religion: null,
  nationality: null,
  adhaar: null,
  parmanent_address: null,
  pincode: null,
  email: null,
  contact_no: null,
  local_address: null,
  profileImagePath: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      const u = action.payload.user;
      state.name = u.name;
      state.student_id = u.studentId;
      state.enroll = u.enrollment;
      state.course = u.course;
      state.college_name = u.collegeName;
      state.application_id = u.applicationId;
      state.specialization = u.specialization;
      state.admission_session = u.admissionSession;
      state.date_of_admission = u.dateOfAdmission;
      state.father_name = u.fatherName;
      state.mother_name = u.motherName;
      state.date_of_birth = u.dob;
      state.gender = u.gender;
      state.mobile_no = u.mobileNo;
      state.cast_category = u.castCategory;
      state.religion = u.religion;
      state.nationality = u.nationality;
      state.adhaar = u.adhaar;
      state.parmanent_address = u.permanentAddress;
      state.pincode = u.pincode;
      state.email = u.email;
      state.contact_no = u.contactNo;
      state.local_address = u.localAddress;
      state.profileImagePath = u.profileImagePath;
    });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
