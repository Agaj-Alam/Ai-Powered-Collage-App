package com.agaj.subhartiBackend.controllers;

import com.agaj.subhartiBackend.entity.Designation;
import com.agaj.subhartiBackend.entity.Role;
import com.agaj.subhartiBackend.entity.User;
import com.agaj.subhartiBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/authorities")
public class AuthorityController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/deans")
    public ResponseEntity<List<User>> getDeans() {
        return ResponseEntity.ok(userRepository.findByRoleAndDesignation(Role.FACULTY, Designation.DEAN));
    }

    @GetMapping("/wardens")
    public ResponseEntity<List<User>> getWardens() {
        return ResponseEntity.ok(userRepository.findByRoleAndDesignation(Role.GUARDIAN, Designation.WARDEN));
    }

    @GetMapping("/chief-wardens")
    public ResponseEntity<List<User>> getChiefWardens() {
        return ResponseEntity.ok(userRepository.findByRoleAndDesignation(Role.GUARDIAN, Designation.CHIEF_WARDEN));
    }
}
