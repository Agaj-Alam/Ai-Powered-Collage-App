package com.agaj.subhartiBackend.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class ChatRequestDto {
    private String message;

    public ChatRequestDto() {
    }

    public ChatRequestDto(String message) {
        this.message = message;
    }
}
