//package com.agaj.subhartiBackend.service;
//
//import com.agaj.subhartiBackend.dto.ChatRequestDto;
//import com.agaj.subhartiBackend.dto.ChatResponseDto;
//import com.agaj.subhartiBackend.util.SimilarityUtils;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.Comparator;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class ChatService {
//
//    private final GeminiService geminiService;
//    private final EmbeddingService embeddingService;
//    private final VectorStoreService vectorStoreService;
//
//    public ChatResponseDto processMessage(ChatRequestDto requestDto) {
//
//        String question = requestDto.getMessage();
//
//        if (question == null || question.trim().isEmpty()) {
//            return new ChatResponseDto(
//                    "Please ask a valid question.",
//                    LocalDateTime.now()
//            );
//        }
//
//        // 🔥 Greeting detection (NO Gemini call)
//        if (isGreeting(question)) {
//            return new ChatResponseDto(
//                    "Hello! How can I help you regarding Subharti University?",
//                    LocalDateTime.now()
//            );
//        }
//
//        // 🔹 Generate embedding
//        List<Double> questionEmbedding =
//                embeddingService.generateEmbedding(question);
//
//        if (questionEmbedding == null || questionEmbedding.isEmpty()) {
//            return new ChatResponseDto(
//                    "Embedding generation failed.",
//                    LocalDateTime.now()
//            );
//        }
//
//        List<String> chunks = vectorStoreService.getChunks();
//        List<List<Double>> storedEmbeddings =
//                vectorStoreService.getEmbeddings();
//
//        if (storedEmbeddings == null || storedEmbeddings.isEmpty()) {
//            return new ChatResponseDto(
//                    "Knowledge base is still loading.",
//                    LocalDateTime.now()
//            );
//        }
//
//        List<Double> scores = new ArrayList<>();
//
//        for (int i = 0; i < storedEmbeddings.size(); i++) {
//
//            List<Double> chunkEmbedding = storedEmbeddings.get(i);
//
//            if (chunkEmbedding == null
//                    || chunkEmbedding.size() != questionEmbedding.size()) {
//                scores.add(0.0);
//                continue;
//            }
//
//            double similarity =
//                    SimilarityUtils.cosineSimilarity(
//                            questionEmbedding,
//                            chunkEmbedding
//                    );
//
//            scores.add(similarity);
//        }
//
//        List<Integer> sortedIndexes = new ArrayList<>();
//        for (int i = 0; i < scores.size(); i++) {
//            sortedIndexes.add(i);
//        }
//
//        sortedIndexes.sort(
//                Comparator.comparingDouble(scores::get).reversed()
//        );
//
//        double bestScore = scores.get(sortedIndexes.get(0));
//
//        System.out.println("Best similarity score: " + bestScore);
//
//        StringBuilder context = new StringBuilder();
//        int topK = Math.min(3, sortedIndexes.size());
//
//        for (int i = 0; i < topK; i++) {
//            context.append(chunks.get(sortedIndexes.get(i)))
//                    .append("\n\n");
//        }
//
//        // 🔥 STRONG MATCH → Direct PDF Answer (No Gemini)
//        if (bestScore > 0.65) {
//
//            return new ChatResponseDto(
//                    extractAnswerFromContext(context.toString()),
//                    LocalDateTime.now()
//            );
//        }
//
//        // ⚡ MEDIUM MATCH → Gemini refine
//        else if (bestScore > 0.40) {
//
//            String finalPrompt = """
//You are an AI assistant for Swami Vivekanand Subharti University.
//Follow these rules carefully:
//If the answer exists in the context, provide it clearly.
//If related information exists, use it.
//If unrelated, answer normally.
//
//Context:
//""" + context + """
//
//Question:
//""" + question + """
//""";
//
//            String aiReply = geminiService.askGemini(finalPrompt);
//            return new ChatResponseDto(aiReply, LocalDateTime.now());
//        }
//
//        // 🌍 LOW MATCH → Normal Gemini
//        else {
//
//            String aiReply = geminiService.askGemini(question);
//            return new ChatResponseDto(aiReply, LocalDateTime.now());
//        }
//    }
//
//    private boolean isGreeting(String question) {
//        String q = question.toLowerCase().trim();
//        return q.equals("hi") ||
//                q.equals("hello") ||
//                q.equals("hii") ||
//                q.equals("hey");
//    }
//
//    private String extractAnswerFromContext(String context) {
//
//        context = context.replaceAll("\\|", " ")
//                .replaceAll(" +", " ")
//                .trim();
//
//        return context.length() > 1000
//                ? context.substring(0, 1000)
//                : context;
//    }
//}




package com.agaj.subhartiBackend.service;

import com.agaj.subhartiBackend.dto.ChatRequestDto;
import com.agaj.subhartiBackend.dto.ChatResponseDto;
import com.agaj.subhartiBackend.util.SimilarityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final GeminiService geminiService;
    private final EmbeddingService embeddingService;
    private final VectorStoreService vectorStoreService;

    public ChatResponseDto processMessage(ChatRequestDto requestDto) {

        String question = requestDto.getMessage();

        // ✅ 1. Validate input
        if (question == null || question.trim().isEmpty()) {
            return new ChatResponseDto(
                    "Please ask a valid question.",
                    LocalDateTime.now()
            );
        }

        // ✅ 2. Greeting detection (NO Gemini call)
        if (isGreeting(question)) {
            return new ChatResponseDto(
                    "Hello! How can I help you regarding Subharti University?",
                    LocalDateTime.now()
            );
        }

        // 🔹 3. Generate embedding
        List<Double> questionEmbedding =
                embeddingService.generateEmbedding(question);

        if (questionEmbedding == null || questionEmbedding.isEmpty()) {
            return new ChatResponseDto(
                    "Embedding generation failed.",
                    LocalDateTime.now()
            );
        }

        // 🔹 4. Load stored data
        List<String> chunks = vectorStoreService.getChunks();
        List<List<Double>> storedEmbeddings =
                vectorStoreService.getEmbeddings();

        if (storedEmbeddings == null || storedEmbeddings.isEmpty()) {
            return new ChatResponseDto(
                    "Knowledge base is still loading.",
                    LocalDateTime.now()
            );
        }

        // 🔹 5. Calculate similarity scores
        List<Double> scores = new ArrayList<>();

        for (int i = 0; i < storedEmbeddings.size(); i++) {

            List<Double> chunkEmbedding = storedEmbeddings.get(i);

            if (chunkEmbedding == null
                    || chunkEmbedding.size() != questionEmbedding.size()) {
                scores.add(0.0);
                continue;
            }

            double similarity =
                    SimilarityUtils.cosineSimilarity(
                            questionEmbedding,
                            chunkEmbedding
                    );

            scores.add(similarity);
        }

        // 🔹 6. Sort indexes based on similarity
        List<Integer> sortedIndexes = new ArrayList<>();
        for (int i = 0; i < scores.size(); i++) {
            sortedIndexes.add(i);
        }

        sortedIndexes.sort(
                Comparator.comparingDouble(scores::get).reversed()
        );

        double bestScore = scores.get(sortedIndexes.get(0));

        System.out.println("Best similarity score: " + bestScore);

        // 🔹 7. Build context
        StringBuilder context = new StringBuilder();
        int topK = Math.min(3, sortedIndexes.size());

        for (int i = 0; i < topK; i++) {
            context.append(chunks.get(sortedIndexes.get(i)))
                    .append("\n\n");
        }

        // 🔥 8. STRONG MATCH → Direct answer (NO Gemini)
        if (bestScore > 0.65) {

            return new ChatResponseDto(
                    extractAnswerFromContext(context.toString()),
                    LocalDateTime.now()
            );
        }

        // ⚡ 9. MEDIUM MATCH → Gemini refine
        else if (bestScore > 0.40) {

            String finalPrompt = """
You are an AI assistant for Swami Vivekanand Subharti University.
Follow these rules carefully:
If the answer exists in the context, provide it clearly.
If related information exists, use it.
If unrelated, answer normally.

Context:
""" + context + """

Question:
""" + question + """
""";

            String aiReply = safeGeminiCall(finalPrompt);
            return new ChatResponseDto(aiReply, LocalDateTime.now());
        }

        // 🌍 10. LOW MATCH → Normal Gemini
        else {

            String aiReply = safeGeminiCall(question);
            return new ChatResponseDto(aiReply, LocalDateTime.now());
        }
    }

    // ✅ 🔥 SAFE GEMINI CALL (NEW METHOD)
    private String safeGeminiCall(String prompt) {
        try {
            String response = geminiService.askGemini(prompt);

            if (response == null ||
                    response.contains("Error") ||
                    response.contains("busy")) {

                return "AI is temporarily facing overload. Please try again later.";
            }

            return response;

        } catch (Exception e) {
            e.printStackTrace();
            return "Something went wrong while processing your request.";
        }
    }

    // ✅ Greeting detection
    private boolean isGreeting(String question) {
        String q = question.toLowerCase().trim();
        return q.equals("hi") ||
                q.equals("hello") ||
                q.equals("hii") ||
                q.equals("hey");
    }

    // ✅ Extract clean answer
    private String extractAnswerFromContext(String context) {

        context = context.replaceAll("\\|", " ")
                .replaceAll(" +", " ")
                .trim();

        return context.length() > 1000
                ? context.substring(0, 1000)
                : context;
    }
}