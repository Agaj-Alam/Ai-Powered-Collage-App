package com.agaj.subhartiBackend.service;

import com.agaj.subhartiBackend.dto.LeaveRequestDTO;
import com.agaj.subhartiBackend.dto.LeaveResponseDTO;
import com.agaj.subhartiBackend.entity.Leave;
import com.agaj.subhartiBackend.entity.LeaveStatus;
import com.agaj.subhartiBackend.entity.LeaveType;
import com.agaj.subhartiBackend.entity.User;
import com.agaj.subhartiBackend.repository.LeaveRepository;
import com.agaj.subhartiBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LeaveService {

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private UserRepository userRepository;

    public LeaveResponseDTO applyLeave(LeaveRequestDTO request, String studentEnrollment, String attachmentPath) {
        User student = userRepository.findByEnrollment(studentEnrollment)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Leave leave = new Leave();
        leave.setApplicationId("HLA" + UUID.randomUUID().toString().substring(0, 5).toUpperCase());
        leave.setStudent(student);
        leave.setLeaveType(LeaveType.valueOf(request.getLeaveType()));
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setReason(request.getReason());
        leave.setStatus(LeaveStatus.PENDING_AT_DEAN);
        leave.setAppliedDate(LocalDate.now());
        leave.setAttachmentPath(attachmentPath);

        if (request.getDeanId() != null) leave.setDean(userRepository.findById(request.getDeanId()).orElse(null));
        if (request.getWardenId() != null) leave.setWarden(userRepository.findById(request.getWardenId()).orElse(null));
        if (request.getChiefWardenId() != null) leave.setChiefWarden(userRepository.findById(request.getChiefWardenId()).orElse(null));

        Leave savedLeave = leaveRepository.save(leave);
        return mapToDTO(savedLeave);
    }

    public LeaveResponseDTO getLeaveById(Long id) {
        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave not found with id: " + id));
        return mapToDTO(leave);
    }

    public List<LeaveResponseDTO> getStudentLeaves(String enrollment) {
        User student = userRepository.findByEnrollment(enrollment)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return leaveRepository.findByStudent(student).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // ==================== Dean actions ====================

    public void approveByDean(Long leaveId, String remarks) {
        Leave leave = leaveRepository.findById(leaveId).orElseThrow(() -> new RuntimeException("Leave not found"));
        if (leave.getStatus() != LeaveStatus.PENDING_AT_DEAN) {
            throw new RuntimeException("Leave is not pending at dean");
        }
        leave.setStatus(LeaveStatus.PENDING_AT_WARDEN);
        leave.setDeanRemarks(remarks);
        leaveRepository.save(leave);
    }

    public void rejectByDean(Long leaveId, String remarks) {
        Leave leave = leaveRepository.findById(leaveId).orElseThrow(() -> new RuntimeException("Leave not found"));
        if (leave.getStatus() != LeaveStatus.PENDING_AT_DEAN) {
            throw new RuntimeException("Leave is not pending at dean");
        }
        leave.setStatus(LeaveStatus.REJECTED_BY_DEAN);
        leave.setDeanRemarks(remarks);
        leaveRepository.save(leave);
    }

    public List<LeaveResponseDTO> getPendingForDean(String enrollment) {
        User dean = userRepository.findByEnrollment(enrollment).orElseThrow(() -> new RuntimeException("Dean not found"));
        return leaveRepository.findByDeanAndStatus(dean, LeaveStatus.PENDING_AT_DEAN).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<LeaveResponseDTO> getDeanHistory(String enrollment) {
        User dean = userRepository.findByEnrollment(enrollment).orElseThrow(() -> new RuntimeException("Dean not found"));
        return leaveRepository.findByDeanAndStatusNot(dean, LeaveStatus.PENDING_AT_DEAN).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // ==================== Warden actions ====================

    public void approveByWarden(Long leaveId, String remarks) {
        Leave leave = leaveRepository.findById(leaveId).orElseThrow(() -> new RuntimeException("Leave not found"));
        if (leave.getStatus() != LeaveStatus.PENDING_AT_WARDEN) {
            throw new RuntimeException("Leave is not pending at warden");
        }
        leave.setStatus(LeaveStatus.PENDING_AT_CHIEF_WARDEN);
        leave.setWardenRemarks(remarks);
        leaveRepository.save(leave);
    }

    public void rejectByWarden(Long leaveId, String remarks) {
        Leave leave = leaveRepository.findById(leaveId).orElseThrow(() -> new RuntimeException("Leave not found"));
        if (leave.getStatus() != LeaveStatus.PENDING_AT_WARDEN) {
            throw new RuntimeException("Leave is not pending at warden");
        }
        leave.setStatus(LeaveStatus.REJECTED_BY_WARDEN);
        leave.setWardenRemarks(remarks);
        leaveRepository.save(leave);
    }

    public List<LeaveResponseDTO> getPendingForWarden(String enrollment) {
        User warden = userRepository.findByEnrollment(enrollment).orElseThrow(() -> new RuntimeException("Warden not found"));
        return leaveRepository.findByWardenAndStatus(warden, LeaveStatus.PENDING_AT_WARDEN).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<LeaveResponseDTO> getWardenHistory(String enrollment) {
        User warden = userRepository.findByEnrollment(enrollment).orElseThrow(() -> new RuntimeException("Warden not found"));
        return leaveRepository.findByWardenAndStatusNot(warden, LeaveStatus.PENDING_AT_WARDEN).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // ==================== Chief Warden actions ====================

    public void approveByChiefWarden(Long leaveId, String remarks) {
        Leave leave = leaveRepository.findById(leaveId).orElseThrow(() -> new RuntimeException("Leave not found"));
        if (leave.getStatus() != LeaveStatus.PENDING_AT_CHIEF_WARDEN) {
            throw new RuntimeException("Leave is not pending at chief warden");
        }
        leave.setStatus(LeaveStatus.FULLY_APPROVED);
        leave.setChiefWardenRemarks(remarks);
        leaveRepository.save(leave);
    }

    public void rejectByChiefWarden(Long leaveId, String remarks) {
        Leave leave = leaveRepository.findById(leaveId).orElseThrow(() -> new RuntimeException("Leave not found"));
        if (leave.getStatus() != LeaveStatus.PENDING_AT_CHIEF_WARDEN) {
            throw new RuntimeException("Leave is not pending at chief warden");
        }
        leave.setStatus(LeaveStatus.REJECTED_BY_CHIEF_WARDEN);
        leave.setChiefWardenRemarks(remarks);
        leaveRepository.save(leave);
    }

    public List<LeaveResponseDTO> getPendingForChiefWarden(String enrollment) {
        User cw = userRepository.findByEnrollment(enrollment).orElseThrow(() -> new RuntimeException("Chief Warden not found"));
        return leaveRepository.findByChiefWardenAndStatus(cw, LeaveStatus.PENDING_AT_CHIEF_WARDEN).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<LeaveResponseDTO> getChiefWardenHistory(String enrollment) {
        User cw = userRepository.findByEnrollment(enrollment).orElseThrow(() -> new RuntimeException("Chief Warden not found"));
        return leaveRepository.findByChiefWardenAndStatusNot(cw, LeaveStatus.PENDING_AT_CHIEF_WARDEN).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // ==================== Warden's own leave ====================

    public LeaveResponseDTO applyWardenLeave(LeaveRequestDTO request, String wardenEnrollment, String attachmentPath) {
        User warden = userRepository.findByEnrollment(wardenEnrollment)
                .orElseThrow(() -> new RuntimeException("Warden not found"));

        Leave leave = new Leave();
        leave.setApplicationId("WLA" + UUID.randomUUID().toString().substring(0, 5).toUpperCase());
        leave.setStudent(warden); // warden is the applicant
        leave.setLeaveType(LeaveType.valueOf(request.getLeaveType()));
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setReason(request.getReason());
        leave.setStatus(LeaveStatus.PENDING_AT_CHIEF_WARDEN); // warden leaves go directly to CW
        leave.setAppliedDate(LocalDate.now());
        leave.setAttachmentPath(attachmentPath);

        if (request.getChiefWardenId() != null) leave.setChiefWarden(userRepository.findById(request.getChiefWardenId()).orElse(null));

        Leave savedLeave = leaveRepository.save(leave);
        return mapToDTO(savedLeave);
    }

    public List<LeaveResponseDTO> getWardenOwnLeaves(String enrollment) {
        User warden = userRepository.findByEnrollment(enrollment)
                .orElseThrow(() -> new RuntimeException("Warden not found"));
        return leaveRepository.findByStudent(warden).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // Pending warden leaves for chief-warden to approve
    public List<LeaveResponseDTO> getPendingWardenLeavesForCW() {
        // All leaves at PENDING_AT_CHIEF_WARDEN where the applicant is a GUARDIAN (warden)
        return leaveRepository.findByStatus(LeaveStatus.PENDING_AT_CHIEF_WARDEN).stream()
                .filter(l -> l.getStudent().getRole().name().equals("GUARDIAN"))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ==================== DTO mapper ====================

    private LeaveResponseDTO mapToDTO(Leave leave) {
        LeaveResponseDTO dto = new LeaveResponseDTO();
        dto.setId(leave.getId());
        dto.setApplicationId(leave.getApplicationId());
        dto.setLeaveType(leave.getLeaveType().name());
        dto.setStartDate(leave.getStartDate());
        dto.setEndDate(leave.getEndDate());
        dto.setReason(leave.getReason());
        dto.setStatus(leave.getStatus());
        dto.setStudentName(leave.getStudent().getName());
        dto.setStudentEnrollment(leave.getStudent().getEnrollment());
        dto.setDeanName(leave.getDean() != null ? leave.getDean().getName() : "N/A");
        dto.setWardenName(leave.getWarden() != null ? leave.getWarden().getName() : "N/A");
        dto.setChiefWardenName(leave.getChiefWarden() != null ? leave.getChiefWarden().getName() : "N/A");
        dto.setDeanRemarks(leave.getDeanRemarks());
        dto.setWardenRemarks(leave.getWardenRemarks());
        dto.setChiefWardenRemarks(leave.getChiefWardenRemarks());
        dto.setAttachmentUrl(leave.getAttachmentPath());
        dto.setAppliedDate(leave.getAppliedDate());
        return dto;
    }
}
