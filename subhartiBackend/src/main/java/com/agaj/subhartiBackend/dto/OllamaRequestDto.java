package com.agaj.subhartiBackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
public class OllamaRequestDto {
    private String model;
    private String prompt;
    private boolean stream = false;

    public OllamaRequestDto(String model, String prompt) {
        this.model = model;
        this.prompt = prompt;
    }

}
