package com.agaj.subhartiBackend.service;

import com.agaj.subhartiBackend.dto.AuthResponseDTO;
import com.agaj.subhartiBackend.dto.LoginRequestDTO;
import com.agaj.subhartiBackend.dto.SignupRequestDTO;
import com.agaj.subhartiBackend.entity.Designation;
import com.agaj.subhartiBackend.entity.Role;
import com.agaj.subhartiBackend.entity.User;
import com.agaj.subhartiBackend.repository.UserRepository;
import com.agaj.subhartiBackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponseDTO login(LoginRequestDTO request) {
        String enrollment = request.getEnrollment().trim();
        String dob = request.getDob().trim();
        
        Optional<User> userOpt = userRepository.findByEnrollment(enrollment);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getDob().trim().equals(dob)) {
                // Validate role if requested
                if (request.getRole() != null && !user.getRole().name().equals(request.getRole())) {
                    return new AuthResponseDTO(null, "Role mismatch for this user", null);
                }
                
                Map<String, Object> claims = new HashMap<>();
                claims.put("role", user.getRole().name());
                claims.put("designation", user.getDesignation() != null ? user.getDesignation().name() : "NONE");
                
                String token = jwtUtil.generateToken(user.getEnrollment(), claims);
                return new AuthResponseDTO(token, "Login successful", user);
            }
        }
        
        return new AuthResponseDTO(null, "Invalid enrollment or DOB", null);
    }

    public User createUser(SignupRequestDTO request, String profileImagePath) {
        User user = new User();
        user.setEnrollment(request.getEnrollment());
        user.setDob(request.getDob());
        user.setName(request.getName());
        user.setRole(Role.valueOf(request.getRole()));
        user.setDesignation(request.getDesignation() != null ? Designation.valueOf(request.getDesignation()) : Designation.NONE);
        
        // Student fields
        user.setStudentId(request.getStudentId());
        user.setCourse(request.getCourse());
        user.setCollegeName(request.getCollegeName());
        user.setApplicationId(request.getApplicationId());
        user.setSpecialization(request.getSpecialization());
        user.setAdmissionSession(request.getAdmissionSession());
        user.setDateOfAdmission(request.getDateOfAdmission());
        user.setFatherName(request.getFatherName());
        user.setMotherName(request.getMotherName());
        user.setGender(request.getGender());
        user.setMobileNo(request.getMobileNo());
        user.setCastCategory(request.getCastCategory());
        user.setReligion(request.getReligion());
        user.setNationality(request.getNationality());
        user.setAdhaar(request.getAdhaar());
        user.setPermanentAddress(request.getPermanentAddress());
        user.setPincode(request.getPincode());
        user.setEmail(request.getEmail());
        user.setContactNo(request.getContactNo());
        user.setLocalAddress(request.getLocalAddress());
        user.setProfileImagePath(profileImagePath);
        
        return userRepository.save(user);
    }
}
