package com.agaj.subhartiBackend.repository;

import com.agaj.subhartiBackend.entity.Leave;
import com.agaj.subhartiBackend.entity.LeaveStatus;
import com.agaj.subhartiBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {
    List<Leave> findByStudent(User student);
    List<Leave> findByStatus(LeaveStatus status);
    List<Leave> findByDeanAndStatus(User dean, LeaveStatus status);
    List<Leave> findByWardenAndStatus(User warden, LeaveStatus status);
    List<Leave> findByChiefWardenAndStatus(User chiefWarden, LeaveStatus status);
    
    // For history — all leaves assigned to this authority (regardless of status)
    List<Leave> findByDean(User dean);
    List<Leave> findByWarden(User warden);
    List<Leave> findByChiefWarden(User chiefWarden);
    
    // For history excluding a specific status
    List<Leave> findByDeanAndStatusNot(User dean, LeaveStatus status);
    List<Leave> findByWardenAndStatusNot(User warden, LeaveStatus status);
    List<Leave> findByChiefWardenAndStatusNot(User chiefWarden, LeaveStatus status);
}
