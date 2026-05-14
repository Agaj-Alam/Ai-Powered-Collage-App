package com.agaj.subhartiBackend.service;

import com.agaj.subhartiBackend.dto.AiRequestDto;
import com.agaj.subhartiBackend.dto.AiResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AiClientService {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String OLLAMA_URL = "http://localhost:11434/api/generate";

    public String askQuestion(String question) {

        Map<String, Object> request = new HashMap<>();
        request.put("model", "qwen3:0.6b");
        request.put("prompt", question);
        request.put("stream", false);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(OLLAMA_URL, request, Map.class);

        return response.getBody().get("response").toString();
    }
}
