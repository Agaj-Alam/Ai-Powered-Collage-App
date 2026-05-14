package com.agaj.subhartiBackend.dto;

import lombok.Data;

@Data
public class SignupRequestDTO {
    private String enrollment;
    private String dob;
    private String name;
    private String role;
    private String designation;
    
    // Student fields
    private String studentId;
    private String course;
    private String collegeName;
    private String applicationId;
    private String specialization;
    private String admissionSession;
    private String dateOfAdmission;
    private String fatherName;
    private String motherName;
    private String gender;
    private String mobileNo;
    private String castCategory;
    private String religion;
    private String nationality;
    private String adhaar;
    private String permanentAddress;
    private String pincode;
    private String email;
    private String contactNo;
    private String localAddress;
}
