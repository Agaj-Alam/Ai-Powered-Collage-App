package com.agaj.subhartiBackend.repository;

import com.agaj.subhartiBackend.entity.Designation;
import com.agaj.subhartiBackend.entity.Role;
import com.agaj.subhartiBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEnrollment(String enrollment);
    List<User> findByRole(Role role);
    List<User> findByDesignation(Designation designation);
    List<User> findByRoleAndDesignation(Role role, Designation designation);
}
