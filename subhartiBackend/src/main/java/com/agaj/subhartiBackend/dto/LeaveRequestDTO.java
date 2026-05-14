package com.agaj.subhartiBackend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class LeaveRequestDTO {
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private Long deanId;
    private Long wardenId;
    private Long chiefWardenId;
}
