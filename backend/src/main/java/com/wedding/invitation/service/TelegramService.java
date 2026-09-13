package com.wedding.invitation.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class TelegramService {

    private static final Logger log = LoggerFactory.getLogger(TelegramService.class);
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    @Async
    public void sendNotification(String message, String botToken, String chatId) {
        if (botToken == null || botToken.isBlank() || chatId == null || chatId.isBlank()) {
            return;
        }

        try {
            String url = String.format("https://api.telegram.org/bot%s/sendMessage", botToken.trim());
            String jsonPayload = String.format(
                    "{\"chat_id\": \"%s\", \"text\": \"%s\", \"parse_mode\": \"HTML\"}",
                    chatId.trim(),
                    escapeJson(message)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(res -> {
                        if (res.statusCode() >= 300) {
                            log.warn("Telegram notification response: {} {}", res.statusCode(), res.body());
                        }
                    })
                    .exceptionally(ex -> {
                        log.warn("Failed to dispatch Telegram notification: {}", ex.getMessage());
                        return null;
                    });
        } catch (Exception e) {
            log.warn("Error preparing Telegram notification: {}", e.getMessage());
        }
    }

    private String escapeJson(String raw) {
        if (raw == null) return "";
        return raw.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
