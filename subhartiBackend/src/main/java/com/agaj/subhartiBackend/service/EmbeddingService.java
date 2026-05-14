package com.agaj.subhartiBackend.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmbeddingService {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String OLLAMA_EMBED_URL =
            "http://localhost:11434/api/embeddings";

    public List<Double> generateEmbedding(String text) {

        Map<String, Object> request = new HashMap<>();
        request.put("model", "nomic-embed-text:v1.5");
        request.put("prompt", text);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(OLLAMA_EMBED_URL, request, Map.class);

        Object embeddingObj = response.getBody().get("embedding");

        if (embeddingObj == null) {
            System.out.println("Embedding response: " + response.getBody());
            return new ArrayList<>();
        }

        List<?> rawList = (List<?>) embeddingObj;

        List<Double> embedding = new ArrayList<>();

        for (Object obj : rawList) {
            embedding.add(((Number) obj).doubleValue());
        }

        return embedding;
    }

}
