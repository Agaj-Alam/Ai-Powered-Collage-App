//package com.agaj.subhartiBackend.service;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.*;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.*;
//
//@Service
//public class GeminiService {
//
//    @Value("${gemini.api.key}")
//    private String apiKey;
//
//    private final String baseUrl =
//            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";
//
//    private final RestTemplate restTemplate = new RestTemplate();
//
//    public String askGemini(String prompt) {
//
//        String fullUrl = baseUrl + apiKey;
//
//        System.out.println("Calling URL: " + fullUrl);
//
//        Map<String, Object> textPart = new HashMap<>();
//        textPart.put("text", prompt);
//
//        Map<String, Object> content = new HashMap<>();
//        content.put("parts", List.of(textPart));
//
//        Map<String, Object> requestBody = new HashMap<>();
//        requestBody.put("contents", List.of(content));
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        HttpEntity<Map<String, Object>> entity =
//                new HttpEntity<>(requestBody, headers);
//
//        try {
//            ResponseEntity<Map> response =
//                    restTemplate.postForEntity(fullUrl, entity, Map.class);
//
//            List candidates = (List) response.getBody().get("candidates");
//            Map firstCandidate = (Map) candidates.get(0);
//            Map contentMap = (Map) firstCandidate.get("content");
//            List parts = (List) contentMap.get("parts");
//            Map firstPart = (Map) parts.get(0);
//
//            return firstPart.get("text").toString();
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "Gemini API Error: " + e.getMessage();
//        }
//    }
//}






package com.agaj.subhartiBackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String baseUrl =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    private final RestTemplate restTemplate = new RestTemplate();

    public String askGemini(String prompt) {

        String fullUrl = baseUrl + apiKey;

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(requestBody, headers);

        // 🔥 RETRY LOGIC (NEW)
        for (int i = 0; i < 3; i++) {
            try {

                ResponseEntity<Map> response =
                        restTemplate.postForEntity(fullUrl, entity, Map.class);

                List candidates = (List) response.getBody().get("candidates");
                Map firstCandidate = (Map) candidates.get(0);
                Map contentMap = (Map) firstCandidate.get("content");
                List parts = (List) contentMap.get("parts");
                Map firstPart = (Map) parts.get(0);

                return firstPart.get("text").toString();

            } catch (HttpServerErrorException e) {

                // 🔥 503 HANDLE (NEW)
                if (e.getStatusCode().value() == 503) {
                    System.out.println("Gemini busy... retrying");

                    try {
                        Thread.sleep(2000); // wait 2 sec
                    } catch (InterruptedException ex) {
                        Thread.currentThread().interrupt();
                    }

                } else {
                    return "Server error: " + e.getMessage();
                }

            } catch (Exception e) {
                e.printStackTrace();
                return "Gemini API Error: " + e.getMessage();
            }
        }

        // 🔥 FINAL FALLBACK (NEW)
        return "AI is busy right now, please try again later 🙏";
    }
}