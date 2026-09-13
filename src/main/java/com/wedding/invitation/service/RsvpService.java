package com.wedding.invitation.service;

import com.wedding.invitation.dto.RsvpDto;
import com.wedding.invitation.model.Rsvp;
import com.wedding.invitation.repository.RsvpRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
public class RsvpService {

    private final RsvpRepository rsvpRepository;
    private final ConfigService configService;
    private final TelegramService telegramService;

    public RsvpService(RsvpRepository rsvpRepository, ConfigService configService, TelegramService telegramService) {
        this.rsvpRepository = rsvpRepository;
        this.configService = configService;
        this.telegramService = telegramService;
    }

    public List<Rsvp> getAllRsvps() {
        return rsvpRepository.findAllByOrderByCreatedAtDesc();
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
    public Map<String, Object> saveOrUpdateRsvp(RsvpDto dto) {
        String cleanName = sanitize(dto.getGuestName());
        String cleanPhone = sanitize(dto.getPhone());
        String cleanMessage = sanitize(dto.getMessage());
        String attendance = dto.getAttendance() != null ? dto.getAttendance() : "hadir";
        Integer guestCount = dto.getGuestCount() != null ? dto.getGuestCount() : 1;

        Optional<Rsvp> existingOpt = rsvpRepository.findByGuestName(cleanName);
        Rsvp saved;
        String actionType;

        if (existingOpt.isPresent()) {
            Rsvp existing = existingOpt.get();
            existing.setPhone(cleanPhone);
            existing.setAttendance(attendance);
            existing.setGuestCount(guestCount);
            existing.setMessage(cleanMessage);
            existing.setCreatedAt(Instant.now().toString());
            saved = rsvpRepository.save(existing);
            actionType = "updated";
        } else {
            Rsvp newRsvp = new Rsvp(cleanName, cleanPhone, attendance, guestCount, cleanMessage);
            saved = rsvpRepository.save(newRsvp);
            actionType = "created";
        }

        // Telegram Notification
        try {
            Map<String, String> config = configService.getRawConfig();
            String botToken = config.get("TELEGRAM_BOT_TOKEN");
            String chatId = config.get("TELEGRAM_CHAT_ID");

            if (botToken != null && !botToken.isBlank() && chatId != null && !chatId.isBlank()) {
                String title = actionType.equals("created") ? "<b>NEW RSVP RECEIVED!</b>" : "<b>RSVP UPDATED!</b>";
                String notif = String.format(
                        "%s\n\n<b>Name:</b> %s\n<b>Status:</b> %s\n<b>Guests:</b> %s\n<b>Contact:</b> %s\n\n<b>Message:</b>\n<i>\"%s\"</i>",
                        title,
                        cleanName,
                        attendance.toUpperCase(),
                        attendance.equalsIgnoreCase("hadir") ? (guestCount + " Pax") : "-",
                        cleanPhone.isEmpty() ? "-" : cleanPhone,
                        cleanMessage.isEmpty() ? "-" : cleanMessage
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
    public void updateRsvp(Long id, Map<String, Object> data) {
        rsvpRepository.findById(id).ifPresent(r -> {
            if (data.containsKey("guest_name")) {
                r.setGuestName(sanitize(String.valueOf(data.get("guest_name"))));
            }
            if (data.containsKey("attendance")) {
                r.setAttendance(String.valueOf(data.get("attendance")));
            }
            if (data.containsKey("guest_count")) {
                try {
                    r.setGuestCount(Integer.parseInt(String.valueOf(data.get("guest_count"))));
                } catch (Exception ignored) {}
            }
            if (data.containsKey("phone")) {
                r.setPhone(sanitize(String.valueOf(data.get("phone"))));
            }
            if (data.containsKey("message")) {
                r.setMessage(sanitize(String.valueOf(data.get("message"))));
            }
            rsvpRepository.save(r);
        });
    }

    @Transactional
    public void deleteRsvps(List<Long> ids) {
        if (ids != null && !ids.isEmpty()) {
            rsvpRepository.deleteAllByIdIn(ids);
        }
    }

    public Map<String, Object> getStats() {
        List<Rsvp> all = rsvpRepository.findAll();
        long hadir = all.stream().filter(r -> "hadir".equalsIgnoreCase(r.getAttendance())).count();
        long ragu = all.stream().filter(r -> "ragu".equalsIgnoreCase(r.getAttendance())).count();
        long tidak = all.stream().filter(r -> "tidak_hadir".equalsIgnoreCase(r.getAttendance())).count();
        int guestCount = all.stream()
                .filter(r -> "hadir".equalsIgnoreCase(r.getAttendance()))
                .mapToInt(r -> r.getGuestCount() != null ? r.getGuestCount() : 1)
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", all.size());
        stats.put("hadir", hadir);
        stats.put("ragu", ragu);
        stats.put("tidak", tidak);
        stats.put("guestCount", guestCount);
        return stats;
    }
}
