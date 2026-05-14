package com.agaj.subhartiBackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiResponseDto {
    private String question;
    private String answer;

    public AiResponseDto() {}
}
