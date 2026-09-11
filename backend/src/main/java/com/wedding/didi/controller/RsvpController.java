package com.wedding.didi.controller;

import com.wedding.didi.model.Rsvp;
import com.wedding.didi.service.RsvpService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rsvp")
@CrossOrigin(origins = "*")
public class RsvpController {

    private final RsvpService rsvpService;

    public RsvpController(RsvpService rsvpService) {
        this.rsvpService = rsvpService;
    }

    @PostMapping
    public ResponseEntity<?> submitRsvp(@Valid @RequestBody Rsvp rsvp) {
        try {
            Rsvp saved = rsvpService.saveRsvp(rsvp);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Rsvp>> getAllRsvps() {
        return ResponseEntity.ok(rsvpService.getAllRsvps());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(rsvpService.getRsvpStats());
    }
}
