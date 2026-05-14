package com.agaj.subhartiBackend.dto;

import com.agaj.subhartiBackend.entity.LeaveStatus;
import com.agaj.subhartiBackend.entity.User;
import lombok.Data;
import java.time.LocalDate;

@Data
public class LeaveResponseDTO {
    private Long id;
    private String applicationId;
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private LeaveStatus status;
    private String studentName;
    private String studentEnrollment;
    private String deanName;
    private String wardenName;
    private String chiefWardenName;
    private String deanRemarks;
    private String wardenRemarks;
    private String chiefWardenRemarks;
    private String attachmentUrl;
    private LocalDate appliedDate;
}
