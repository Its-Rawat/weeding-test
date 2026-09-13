package com.wedding.invitation.controller;

import com.wedding.invitation.dto.AdminActionDto;
import com.wedding.invitation.service.RsvpService;
import com.wedding.invitation.service.WishService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final RsvpService rsvpService;
    private final WishService wishService;

    public AdminController(RsvpService rsvpService, WishService wishService) {
        this.rsvpService = rsvpService;
        this.wishService = wishService;
    }

    @PostMapping
    public ResponseEntity<?> handleAdminAction(@RequestBody AdminActionDto body, HttpServletRequest request) {
        if (!AuthController.isAuthenticated(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized"));
        }

        if (body == null || body.getAction() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing action"));
        }

        List<Long> targetIds = new ArrayList<>();
        if (body.getIds() != null && !body.getIds().isEmpty()) {
            targetIds.addAll(body.getIds());
        } else if (body.getId() != null) {
            targetIds.add(body.getId());
        }

        String action = body.getAction();

        switch (action) {
            case "update_rsvp":
                if (body.getId() == null || body.getData() == null) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Missing id or data"));
                }
                rsvpService.updateRsvp(body.getId(), body.getData());
                return ResponseEntity.ok(Map.of("success", true));

            case "delete_rsvp":
                if (targetIds.isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("error", "No valid ID provided"));
                }
                rsvpService.deleteRsvps(targetIds);
                return ResponseEntity.ok(Map.of("success", true));

            case "update_wish":
                if (body.getId() == null || body.getData() == null) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Missing id or data"));
                }
                wishService.updateWish(body.getId(), body.getData());
                return ResponseEntity.ok(Map.of("success", true));

            case "delete_wish":
                if (targetIds.isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("error", "No valid ID provided"));
                }
                wishService.deleteWishes(targetIds);
                return ResponseEntity.ok(Map.of("success", true));

            default:
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid action"));
        }
    }
}
