package com.wedding.invitation.controller;

import com.wedding.invitation.dto.*;
import com.wedding.invitation.service.GuestService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    private final GuestService guestService;

    public GuestController(GuestService guestService) {
        this.guestService = guestService;
    }

    /**
     * POST /api/guests
     * Add a new guest or family. Automatically generates a unique random RSVP token.
     * Example:
     * {
     *   "name": "Sharma Family",
     *   "type": "FAMILY",
     *   "members": ["Rajesh Sharma", "Sunita Sharma", "Rahul Sharma"]
     * }
     */
    @PostMapping
    public ResponseEntity<GuestResponseDto> createGuest(
            @Valid @RequestBody CreateGuestDto dto,
            HttpServletRequest request) {
        GuestResponseDto response = guestService.createGuest(dto, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/guests/{id}
     * Returns the guest/family information and their unique RSVP link.
     */
    @GetMapping("/{id}")
    public ResponseEntity<GuestResponseDto> getGuestById(
            @PathVariable Long id,
            HttpServletRequest request) {
        GuestResponseDto response = guestService.getGuestById(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/guests
     * Returns all registered guests/families with token links and current RSVP state.
     */
    @GetMapping
    public ResponseEntity<List<GuestResponseDto>> getAllGuests(HttpServletRequest request) {
        List<GuestResponseDto> list = guestService.getAllGuests(request);
        return ResponseEntity.ok(list);
    }

    /**
     * PUT /api/guests/{id}
     * Update guest information and family members.
     */
    @PutMapping("/{id}")
    public ResponseEntity<GuestResponseDto> updateGuest(
            @PathVariable Long id,
            @RequestBody UpdateGuestDto dto,
            HttpServletRequest request) {
        GuestResponseDto response = guestService.updateGuest(id, dto, request);
        return ResponseEntity.ok(response);
    }

    /**
     * PATCH /api/guests/{id}/status
     * Disable/enable invitation without deleting:
     * { "status": "INACTIVE" } or { "status": "ACTIVE" }
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<GuestResponseDto> updateGuestStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateGuestStatusDto dto,
            HttpServletRequest request) {
        GuestResponseDto response = guestService.updateGuestStatus(id, dto.getStatus(), request);
        return ResponseEntity.ok(response);
    }

    /**
     * PATCH /api/guests/{id}/events
     * Enable/disable specific celebrations for a guest or family:
     * { "allowedEvents": ["MEHENDI", "HALDI", "WEDDING", "RECEPTION"] }
     * or:
     * { "allowedEvents": ["WEDDING", "RECEPTION"] }
     * or:
     * { "allowedEvents": ["RECEPTION"] }
     */
    @PatchMapping("/{id}/events")
    public ResponseEntity<GuestResponseDto> updateGuestEvents(
            @PathVariable Long id,
            @RequestBody UpdateGuestEventsDto dto,
            HttpServletRequest request) {
        GuestResponseDto response = guestService.updateGuestEvents(id, dto, request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/guests/bulk
     * Bulk create multiple guests/families at once from Excel/JSON import.
     */
    @PostMapping("/bulk")
    public ResponseEntity<List<GuestResponseDto>> createGuestsBulk(
            @RequestBody List<CreateGuestDto> dtos,
            HttpServletRequest request) {
        List<GuestResponseDto> response = guestService.createGuestsBulk(dtos, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * DELETE /api/guests/{id}
     * Delete an invitation and its associated members.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGuest(@PathVariable Long id) {
        guestService.deleteGuest(id);
        return ResponseEntity.noContent().build();
    }
}
