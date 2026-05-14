package com.agaj.subhartiBackend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ChatResponseDto {
    private String reply;
    private LocalDateTime timestamp;

    public ChatResponseDto() {
    }

    public ChatResponseDto(String reply, LocalDateTime timestamp) {
        this.reply = reply;
        this.timestamp = timestamp;
    }
}
