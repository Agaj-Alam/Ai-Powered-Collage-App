package com.agaj.subhartiBackend.config;

import com.agaj.subhartiBackend.entity.Designation;
import com.agaj.subhartiBackend.entity.Role;
import com.agaj.subhartiBackend.entity.User;
import com.agaj.subhartiBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Admin
            User admin = new User();
            admin.setEnrollment("ADMIN001");
            admin.setDob("01011990");
            admin.setName("System Admin");
            admin.setRole(Role.ADMIN);
            admin.setDesignation(Designation.NONE);
            userRepository.save(admin);

            // Deans
            createAuthority("DEAN001", "01011980", "Prof. Subhash Chandra Tiwari", Role.FACULTY, Designation.DEAN);
            createAuthority("DEAN002", "01011981", "Dr. MANOJ KAPIL", Role.FACULTY, Designation.DEAN);
            createAuthority("DEAN003", "01011982", "Dr. Ravindra Kumar Jain", Role.FACULTY, Designation.DEAN);

            // Warden
            createAuthority("WARDEN001", "01011985", "Mr. Bipul Kumar Singh", Role.GUARDIAN, Designation.WARDEN);

            // Chief Warden
            createAuthority("CW001", "01011986", "Mr. NARESH KUMAR", Role.GUARDIAN, Designation.CHIEF_WARDEN);

            // Sample Student
            User student = new User();
            student.setEnrollment("2201000000766");
            student.setDob("06042003");
            student.setName("AGAJ ALAM");
            student.setRole(Role.STUDENT);
            student.setDesignation(Designation.NONE);
            student.setStudentId("43069");
            student.setCourse("B.TECH");
            student.setCollegeName("SUBHARTI INSTITUTE OF TECHNOLOGY AND ENGINEERING");
            student.setApplicationId("HLA56552");
            student.setSpecialization("INFORMATION TECHNOLOGY");
            student.setAdmissionSession("2022-2026");
            userRepository.save(student);
            
            System.out.println("Initial data seeded successfully.");
        }
    }

    private void createAuthority(String enrollment, String dob, String name, Role role, Designation designation) {
        User user = new User();
        user.setEnrollment(enrollment);
        user.setDob(dob);
        user.setName(name);
        user.setRole(role);
        user.setDesignation(designation);
        userRepository.save(user);
    }
}
