package com.wedding.didi.controller;

import com.wedding.didi.model.InvitedParty;
import com.wedding.didi.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // =========================================================================
    // 1. INVITATION PASS VALIDATION & SINGLE-USE REGISTRATION
    // =========================================================================

    @PostMapping("/invitation/validate")
    public ResponseEntity<?> validateInvitation(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null || token.trim().isEmpty()) {
            token = body.get("code");
        }
        Map<String, Object> result = authService.validateInvitation(token);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/invitation/register")
    public ResponseEntity<?> registerInvitation(@RequestBody Map<String, String> body) {
        try {
            String token = body.get("token");
            if (token == null || token.trim().isEmpty()) {
                token = body.get("code");
            }
            String email = body.get("email");
            String guestName = body.get("primaryGuestName");

            Map<String, Object> result = authService.registerInvitation(token, email, guestName);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // =========================================================================
    // 2. RETURNING GUEST EMAIL OTP LOGIN
    // =========================================================================

    @PostMapping("/lookup")
    public ResponseEntity<?> lookupEmail(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Optional<InvitedParty> partyOpt = authService.lookupEmail(email);
        if (partyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "success", false,
                "message", "This email address was not found on the private invitation list. Please contact the wedding hospitality desk for assistance."
            ));
        }

        InvitedParty party = partyOpt.get();
        return ResponseEntity.ok(Map.of(
            "success", true,
            "email", party.getPrimaryEmail(),
            "familyName", party.getFamilyName(),
            "allowedPartySize", party.getAllowedPartySize(),
            "status", party.getStatus(),
            "side", party.getSide(),
            "assignedTable", party.getAssignedTable(),
            "rsvpStatus", party.getRsvpStatus(),
            "isVerified", party.getIsVerified(),
            "passSerial", party.getPassSerial()
        ));
    }

    @PostMapping("/send-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            Map<String, Object> result = authService.generateAndSendCode(email);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String code = body.get("code");
            Map<String, Object> result = authService.verifyCode(email, code);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // =========================================================================
    // 3. CURRENT AUTHENTICATED USER SESSION (/api/auth/me)
    // =========================================================================

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("authenticated", false, "message", "No session token provided."));
        }

        Optional<InvitedParty> partyOpt = authService.authenticateSession(authHeader);
        if (partyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("authenticated", false, "message", "Session token is invalid or expired."));
        }

        return ResponseEntity.ok(Map.of(
            "authenticated", true,
            "party", partyOpt.get()
        ));
    }

    // =========================================================================
    // 4. RSVP & FAMILY MEMBERS SUBMISSION
    // =========================================================================

    @PostMapping({"/family-rsvp", "/rsvp"})
    public ResponseEntity<?> submitFamilyRsvp(@RequestBody Map<String, Object> payload) {
        try {
            String email = (String) payload.get("primaryEmail");
            InvitedParty updated = authService.submitFamilyRsvp(email, payload);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // =========================================================================
    // 5. ADMIN MANIFEST & INVITATION GENERATION
    // =========================================================================

    @PostMapping("/admin/invitations")
    public ResponseEntity<?> createAdminInvitation(@RequestBody Map<String, Object> payload) {
        try {
            Map<String, Object> created = authService.createAdminInvitation(payload);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/admin/invitations")
    public ResponseEntity<List<InvitedParty>> getAdminInvitations(@RequestParam(value = "status", required = false) String status) {
        return ResponseEntity.ok(authService.getPartiesByStatus(status));
    }

    @GetMapping({"/master-list"})
    public ResponseEntity<List<InvitedParty>> getMasterList() {
        return ResponseEntity.ok(authService.getAllParties());
    }

    @GetMapping({"/stats", "/admin/stats"})
    public ResponseEntity<Map<String, Object>> getMasterStats() {
        return ResponseEntity.ok(authService.getMasterStats());
    }
}
