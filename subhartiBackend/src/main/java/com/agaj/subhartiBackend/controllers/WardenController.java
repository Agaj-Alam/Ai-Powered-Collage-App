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
import java.util.Map;

@RestController
@RequestMapping("/api/warden")
public class WardenController {

    @Autowired
    private LeaveService leaveService;

    @Autowired
    private FileUploadService fileUploadService;

    @GetMapping("/pending")
    public ResponseEntity<List<LeaveResponseDTO>> getPending() {
        String enrollment = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(leaveService.getPendingForWarden(enrollment));
    }

    @GetMapping("/history")
    public ResponseEntity<List<LeaveResponseDTO>> getHistory() {
        String enrollment = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(leaveService.getWardenHistory(enrollment));
    }

    @GetMapping("/my-leaves")
    public ResponseEntity<List<LeaveResponseDTO>> getMyLeaves() {
        String enrollment = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(leaveService.getWardenOwnLeaves(enrollment));
    }

    @PostMapping("/apply-leave")
    public ResponseEntity<?> applyOwnLeave(
            @RequestParam("leave") String leaveJson,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment) {
        try {
            String enrollment = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            LeaveRequestDTO request = mapper.readValue(leaveJson, LeaveRequestDTO.class);

            String attachmentPath = fileUploadService.saveFile(attachment);
            LeaveResponseDTO response = leaveService.applyWardenLeave(request, enrollment, attachmentPath);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error applying warden leave: " + e.getMessage());
        }
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approve(@PathVariable Long id, @RequestBody Map<String, String> body) {
        leaveService.approveByWarden(id, body.get("remarks"));
        return ResponseEntity.ok(Map.of("message", "Leave approved by warden"));
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<?> reject(@PathVariable Long id, @RequestBody Map<String, String> body) {
        leaveService.rejectByWarden(id, body.get("remarks"));
        return ResponseEntity.ok(Map.of("message", "Leave rejected by warden"));
    }
}
