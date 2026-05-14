package com.agaj.subhartiBackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiRequestDto {
    private String question;

    public AiRequestDto() {}

    public AiRequestDto(String question) {
        this.question = question;
    }

}
