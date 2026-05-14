package com.agaj.subhartiBackend.util;

import java.util.List;

public class SimilarityUtils {

    public static double cosineSimilarity(List<Double> v1, List<Double> v2) {

        if (v1 == null || v2 == null) return 0.0;
        if (v1.isEmpty() || v2.isEmpty()) return 0.0;
        if (v1.size() != v2.size()) return 0.0;

        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;

        for (int i = 0; i < v1.size(); i++) {
            dotProduct += v1.get(i) * v2.get(i);
            norm1 += v1.get(i) * v1.get(i);
            norm2 += v2.get(i) * v2.get(i);
        }

        double denominator = Math.sqrt(norm1) * Math.sqrt(norm2);

        if (denominator == 0) return 0.0;

        return dotProduct / denominator;
    }
}
