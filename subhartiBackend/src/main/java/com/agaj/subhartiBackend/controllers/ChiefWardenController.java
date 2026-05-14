package com.agaj.subhartiBackend.controllers;

import com.agaj.subhartiBackend.dto.LeaveResponseDTO;
import com.agaj.subhartiBackend.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chief-warden")
public class ChiefWardenController {

    @Autowired
    private LeaveService leaveService;

    @GetMapping("/pending")
    public ResponseEntity<List<LeaveResponseDTO>> getPending() {
        String enrollment = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(leaveService.getPendingForChiefWarden(enrollment));
    }

    @GetMapping("/history")
    public ResponseEntity<List<LeaveResponseDTO>> getHistory() {
        String enrollment = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(leaveService.getChiefWardenHistory(enrollment));
    }

    @GetMapping("/warden-leaves")
    public ResponseEntity<List<LeaveResponseDTO>> getWardenLeaves() {
        return ResponseEntity.ok(leaveService.getPendingWardenLeavesForCW());
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approve(@PathVariable Long id, @RequestBody Map<String, String> body) {
        leaveService.approveByChiefWarden(id, body.get("remarks"));
        return ResponseEntity.ok(Map.of("message", "Leave fully approved"));
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<?> reject(@PathVariable Long id, @RequestBody Map<String, String> body) {
        leaveService.rejectByChiefWarden(id, body.get("remarks"));
        return ResponseEntity.ok(Map.of("message", "Leave rejected by chief warden"));
    }
}
