package com.agaj.subhartiBackend.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String enrollment;
    private String dob;
    private String role;
}
