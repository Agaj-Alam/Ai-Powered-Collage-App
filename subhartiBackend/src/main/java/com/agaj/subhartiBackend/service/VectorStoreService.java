package com.agaj.subhartiBackend.service;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Getter
public class VectorStoreService {

    private final PdfLoaderService pdfLoaderService;
    private final EmbeddingService embeddingService;

    private final List<String> chunks = new ArrayList<>();
    private final List<List<Double>> embeddings = new ArrayList<>();

    @PostConstruct
    public void init() {
        System.out.println("Loading PDF and generating embeddings...");

        List<String> pdfChunks = pdfLoaderService.loadAndChunkPdf();

        for (String chunk : pdfChunks) {

            List<Double> embedding = embeddingService.generateEmbedding(chunk);

            if (embedding != null && !embedding.isEmpty()) {
                chunks.add(chunk);
                embeddings.add(embedding);
            } else {
                System.out.println("⚠️ Skipping empty embedding chunk");
            }
        }


        System.out.println("RAG system ready. Total chunks: " + chunks.size());
    }


}
