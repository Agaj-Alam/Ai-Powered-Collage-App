package com.agaj.subhartiBackend.controllers;

import com.agaj.subhartiBackend.dto.ChatRequestDto;
import com.agaj.subhartiBackend.dto.ChatResponseDto;
import com.agaj.subhartiBackend.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ChatResponseDto> chat(
            @RequestBody ChatRequestDto requestDto) {

        ChatResponseDto response = chatService.processMessage(requestDto);
        return ResponseEntity.ok(response);
    }
}
