package com.agaj.subhartiBackend.controllers;

import com.agaj.subhartiBackend.dto.LeaveRequestDTO;
import com.agaj.subhartiBackend.dto.LeaveResponseDTO;
import com.agaj.subhartiBackend.service.FileUploadService;
import com.agaj.subhartiBackend.service.LeaveService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyLeave(
            @RequestParam("leave") String leaveJson,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment) {
        try {
            String enrollment = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            LeaveRequestDTO request = mapper.readValue(leaveJson, LeaveRequestDTO.class);
            
            String attachmentPath = fileUploadService.saveFile(attachment);
            LeaveResponseDTO response = leaveService.applyLeave(request, enrollment, attachmentPath);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error applying leave: " + e.getMessage());
        }
    }

    @GetMapping("/my-leaves")
    public ResponseEntity<List<LeaveResponseDTO>> getMyLeaves() {
        String enrollment = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(leaveService.getStudentLeaves(enrollment));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveResponseDTO> getLeaveById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.getLeaveById(id));
    }
}
