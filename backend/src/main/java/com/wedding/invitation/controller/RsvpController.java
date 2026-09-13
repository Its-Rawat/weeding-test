package com.wedding.invitation.controller;

import com.wedding.invitation.dto.RsvpDto;
import com.wedding.invitation.model.Rsvp;
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

    public RsvpController(RsvpService rsvpService) {
        this.rsvpService = rsvpService;
    }

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
}
