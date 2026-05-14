package com.agaj.subhartiBackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "leaves")
@Data
public class Leave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String applicationId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Enumerated(EnumType.STRING)
    private LeaveType leaveType;

    @Column(columnDefinition = "DATE")
    private LocalDate startDate;
    @Column(columnDefinition = "DATE")
    private LocalDate endDate;
    private String reason;

    @Enumerated(EnumType.STRING)
    private LeaveStatus status;

    @ManyToOne
    @JoinColumn(name = "dean_id")
    private User dean;

    @ManyToOne
    @JoinColumn(name = "warden_id")
    private User warden;

    @ManyToOne
    @JoinColumn(name = "chief_warden_id")
    private User chiefWarden;

    private String deanRemarks;
    private String wardenRemarks;
    private String chiefWardenRemarks;

    private String attachmentPath;

    @Column(nullable = false, columnDefinition = "DATE")
    private LocalDate appliedDate;
}
