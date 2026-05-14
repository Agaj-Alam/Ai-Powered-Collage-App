package com.agaj.subhartiBackend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String enrollment;

    @Column(nullable = false)
    private String dob;

    private String name;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private Designation designation;

    // Student specific fields
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
    private String profileImagePath;
}
