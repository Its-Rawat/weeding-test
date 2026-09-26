package com.wedding.invitation.controller;

import com.wedding.invitation.dto.PublicInvitationDto;
import com.wedding.invitation.dto.RsvpDto;
import com.wedding.invitation.dto.SubmitPersonalizedRsvpDto;
import com.wedding.invitation.model.Rsvp;
import com.wedding.invitation.service.GuestService;
import com.wedding.invitation.service.RsvpService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rsvp")
public class RsvpController {

    private final RsvpService rsvpService;
    private final GuestService guestService;

    public RsvpController(RsvpService rsvpService, GuestService guestService) {
        this.rsvpService = rsvpService;
        this.guestService = guestService;
    }

    // ==========================================
    // 1. Existing General / Open RSVP Endpoints
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Rsvp>> getAllRsvps() {
        return ResponseEntity.ok(rsvpService.getAllRsvps());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitRsvp(@Valid @RequestBody RsvpDto dto) {
        Map<String, Object> result = rsvpService.saveOrUpdateRsvp(dto);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(rsvpService.getStats());
    }

    // ==========================================
    // 2. Personalized Token-Based RSVP Endpoints
    // ==========================================

    /**
     * GET /api/rsvp/{token} (or /api/rsvp/token/{token})
     * Read token, return personalized guest/family invitation details.
     */
    @GetMapping({"/token/{token}", "/{token:[a-zA-Z0-9]{8,32}}"})
    public ResponseEntity<PublicInvitationDto> getPersonalizedInvitation(@PathVariable String token) {
        return ResponseEntity.ok(guestService.getPublicInvitation(token));
    }

    /**
     * POST /api/rsvp/{token} (or /api/rsvp/token/{token})
     * Submit personalized RSVP with member attendance checkboxes and message.
     */
    @PostMapping({"/token/{token}", "/{token:[a-zA-Z0-9]{8,32}}"})
    public ResponseEntity<Map<String, Object>> submitPersonalizedRsvp(
            @PathVariable String token,
            @Valid @RequestBody SubmitPersonalizedRsvpDto dto) {
        return ResponseEntity.ok(guestService.submitRsvp(token, dto));
    }
}
