package com.wedding.invitation.service;

import com.wedding.invitation.dto.WishDto;
import com.wedding.invitation.model.Wish;
import com.wedding.invitation.repository.WishRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
public class WishService {

    private final WishRepository wishRepository;
    private final ConfigService configService;
    private final TelegramService telegramService;

    public WishService(WishRepository wishRepository, ConfigService configService, TelegramService telegramService) {
        this.wishRepository = wishRepository;
        this.configService = configService;
        this.telegramService = telegramService;
    }

    public List<Wish> getAllWishes() {
        return wishRepository.findAllByOrderByCreatedAtDesc();
    }

    private String sanitize(String str) {
        if (str == null) return "";
        return str.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#039;")
                .trim();
    }

    @Transactional
    public Map<String, Object> saveOrUpdateWish(WishDto dto) {
        String cleanName = sanitize(dto.getName());
        String cleanMessage = sanitize(dto.getMessage());

        Optional<Wish> existingOpt = wishRepository.findByName(cleanName);
        Wish saved;
        String actionType;

        if (existingOpt.isPresent()) {
            Wish existing = existingOpt.get();
            existing.setMessage(cleanMessage);
            existing.setCreatedAt(Instant.now().toString());
            saved = wishRepository.save(existing);
            actionType = "updated";
        } else {
            Wish newWish = new Wish(cleanName, cleanMessage);
            saved = wishRepository.save(newWish);
            actionType = "created";
        }

        // Telegram Notification
        try {
            Map<String, String> config = configService.getRawConfig();
            String botToken = config.get("TELEGRAM_BOT_TOKEN");
            String chatId = config.get("TELEGRAM_CHAT_ID");

            if (botToken != null && !botToken.isBlank() && chatId != null && !chatId.isBlank()) {
                String title = actionType.equals("created") ? "<b>NEW WEDDING WISH RECEIVED!</b>" : "<b>WEDDING WISH UPDATED!</b>";
                String notif = String.format(
                        "%s\n\n<b>From:</b> %s\n\n<i>\"%s\"</i>",
                        title,
                        cleanName,
                        cleanMessage
                );
                telegramService.sendNotification(notif, botToken, chatId);
            }
        } catch (Exception ignored) {}

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("id", saved.getId());
        response.put("action", actionType);
        return response;
    }

    @Transactional
    public void updateWish(Long id, Map<String, Object> data) {
        wishRepository.findById(id).ifPresent(w -> {
            if (data.containsKey("name")) {
                w.setName(sanitize(String.valueOf(data.get("name"))));
            }
            if (data.containsKey("message")) {
                w.setMessage(sanitize(String.valueOf(data.get("message"))));
            }
            wishRepository.save(w);
        });
    }

    @Transactional
    public void deleteWishes(List<Long> ids) {
        if (ids != null && !ids.isEmpty()) {
            wishRepository.deleteAllByIdIn(ids);
        }
    }
}
