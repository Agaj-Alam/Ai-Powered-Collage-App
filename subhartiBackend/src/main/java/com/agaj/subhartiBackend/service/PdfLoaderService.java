package com.agaj.subhartiBackend.service;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
public class PdfLoaderService {

    public List<String> loadAndChunkPdf() {

        List<String> chunks = new ArrayList<>();

        try {

            File folder = new File("src/main/resources/pdfs");
            File[] pdfFiles = folder.listFiles((dir, name) -> name.endsWith(".pdf"));

            if (pdfFiles == null) {
                System.out.println("No PDF files found.");
                return chunks;
            }

            for (File file : pdfFiles) {

                System.out.println("Reading PDF: " + file.getName());

                PDDocument document = PDDocument.load(file);
                PDFTextStripper stripper = new PDFTextStripper();
                String text = stripper.getText(document);

                // 🔥 If scanned PDF → OCR
                if (text == null || text.trim().isEmpty()) {

                    System.out.println("Image-based PDF detected. Running OCR...");

                    PDFRenderer renderer = new PDFRenderer(document);

                    ITesseract tesseract = new Tesseract();
                    tesseract.setDatapath("C:\\Program Files\\Tesseract-OCR\\tessdata");
                    tesseract.setLanguage("eng");

                    StringBuilder ocrText = new StringBuilder();

                    for (int i = 0; i < document.getNumberOfPages(); i++) {

                        BufferedImage image =
                                renderer.renderImageWithDPI(i, 300);

                        try {
                            String pageText = tesseract.doOCR(image);
                            ocrText.append(pageText).append("\n");
                        } catch (TesseractException e) {
                            e.printStackTrace();
                        }
                    }

                    text = ocrText.toString();
                }

                document.close();

                // 🔹 Clean text
                text = text.replaceAll("\\r", "")
                        .replaceAll("\\t", " ")
                        .replaceAll(" +", " ")
                        .trim();

                // 🔥 IMPORTANT: Larger chunk size for fee table
                int maxChunkLength = 1500;

                StringBuilder currentChunk = new StringBuilder();

                for (String line : text.split("\n")) {

                    if (currentChunk.length() + line.length() > maxChunkLength) {
                        chunks.add(currentChunk.toString().trim());
                        currentChunk = new StringBuilder();
                    }

                    currentChunk.append(line).append("\n");
                }

                if (!currentChunk.isEmpty()) {
                    chunks.add(currentChunk.toString().trim());
                }

            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("Total chunks created: " + chunks.size());

        return chunks;
    }
}
