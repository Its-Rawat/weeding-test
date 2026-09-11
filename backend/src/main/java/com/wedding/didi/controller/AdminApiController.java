package com.wedding.didi.controller;

import com.wedding.didi.model.FamilyMember;
import com.wedding.didi.model.InvitedParty;
import com.wedding.didi.service.AuthService;
import com.wedding.didi.service.EmailNotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/admin/passes", "/api/admin/users"})
@CrossOrigin(origins = "*")
public class AdminApiController {

    private final AuthService authService;
    private final EmailNotificationService emailNotificationService;

    public AdminApiController(AuthService authService, EmailNotificationService emailNotificationService) {
        this.authService = authService;
        this.emailNotificationService = emailNotificationService;
    }

    private boolean isAuthorized(String headerSecret, String querySecret) {
        String secret = headerSecret;
        if (secret == null || secret.trim().isEmpty()) {
            secret = querySecret;
        }
        return authService.verifyAdminSecret(secret);
    }

    private ResponseEntity<?> unauthorizedResponse() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
            "error", "Forbidden",
            "message", "Access denied. A valid Admin Secret Key is required. Provide 'X-Admin-Secret' header or '?secret=...' parameter."
        ));
    }

    /**
     * GET /api/admin/passes
     * Comprehensive admin endpoint returning summary stats, all available unused passes with tokens, and all registered used passes.
     */
    @GetMapping
    public ResponseEntity<?> getAllPassesOverview(
        @RequestHeader(value = "X-Admin-Secret", required = false) String headerSecret,
        @RequestParam(value = "secret", required = false) String querySecret
    ) {
        if (!isAuthorized(headerSecret, querySecret)) {
            return unauthorizedResponse();
        }

        return ResponseEntity.ok(authService.getAdminPassesOverview());
    }

    /**
     * GET /api/admin/passes/unused
     * Returns all available unused tokens & passes that can be distributed to guests.
     */
    @GetMapping("/unused")
    public ResponseEntity<?> getUnusedPasses(
        @RequestHeader(value = "X-Admin-Secret", required = false) String headerSecret,
        @RequestParam(value = "secret", required = false) String querySecret
    ) {
        if (!isAuthorized(headerSecret, querySecret)) {
            return unauthorizedResponse();
        }

        return ResponseEntity.ok(Map.of(
            "count", authService.getUnusedPassesDetailed().size(),
            "unusedPasses", authService.getUnusedPassesDetailed()
        ));
    }

    /**
     * GET /api/admin/passes/used
     * Returns all registered/claimed passes with guest details and RSVPs.
     */
    @GetMapping("/used")
    public ResponseEntity<?> getUsedPasses(
        @RequestHeader(value = "X-Admin-Secret", required = false) String headerSecret,
        @RequestParam(value = "secret", required = false) String querySecret
    ) {
        if (!isAuthorized(headerSecret, querySecret)) {
            return unauthorizedResponse();
        }

        return ResponseEntity.ok(Map.of(
            "count", authService.getUsedPassesDetailed().size(),
            "usedPasses", authService.getUsedPassesDetailed()
        ));
    }

    /**
     * POST /api/admin/passes/create
     * Creates a new invitation pass programmatically.
     */
    @PostMapping("/create")
    public ResponseEntity<?> createPass(
        @RequestHeader(value = "X-Admin-Secret", required = false) String headerSecret,
        @RequestParam(value = "secret", required = false) String querySecret,
        @RequestBody Map<String, Object> payload
    ) {
        if (!isAuthorized(headerSecret, querySecret)) {
            return unauthorizedResponse();
        }

        try {
            Map<String, Object> created = authService.createAdminInvitation(payload);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/admin/passes/test-email
     * Test endpoint to trigger a sample absence notification to adi2002rawat@gmail.com.
     */
    @PostMapping("/test-email")
    public ResponseEntity<?> testEmailNotification(
        @RequestHeader(value = "X-Admin-Secret", required = false) String headerSecret,
        @RequestParam(value = "secret", required = false) String querySecret
    ) {
        if (!isAuthorized(headerSecret, querySecret)) {
            return unauthorizedResponse();
        }

        InvitedParty sampleParty = new InvitedParty();
        sampleParty.setFamilyName("Rawat Family (Test)");
        sampleParty.setPrimaryEmail("rawat.family@example.com");
        sampleParty.setPassSerial("CX-VIP-TEST");
        sampleParty.setAssignedTable("Table 1 - Royal Lotus");
        sampleParty.setAllowedPartySize(4);
        sampleParty.setConfirmedHeadcount(3);
        sampleParty.setRsvpStatus("ATTENDING");
        sampleParty.setSongRequest("Gallan Goodiyaan");
        sampleParty.setBlessingMessage("Heartiest congratulations to Chandrika & Xudong!");

        FamilyMember absent = new FamilyMember("Aditya Rawat", "Brother", false, "PURE_VEG", "None", "Testing Absence Notification Dispatch", sampleParty);
        FamilyMember coming1 = new FamilyMember("Col. & Mrs. Rawat", "Parents", true, "PURE_VEG", "Nut-free", null, sampleParty);
        FamilyMember coming2 = new FamilyMember("Ananya Rawat", "Sister", true, "PURE_VEG", "None", null, sampleParty);

        emailNotificationService.sendAbsenceNotification(sampleParty, List.of(absent), List.of(coming1, coming2));

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Test absence email notification queued for dispatch to adi2002rawat@gmail.com",
            "recipient", "adi2002rawat@gmail.com"
        ));
    }

    /**
     * PUT /api/admin/passes/{id}
     * Updates pass details such as familyName, allowedPartySize, assignedTable, side, rsvpStatus, confirmedHeadcount.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePass(
        @PathVariable("id") Long id,
        @RequestHeader(value = "X-Admin-Secret", required = false) String headerSecret,
        @RequestParam(value = "secret", required = false) String querySecret,
        @RequestBody Map<String, Object> payload
    ) {
        if (!isAuthorized(headerSecret, querySecret)) {
            return unauthorizedResponse();
        }

        try {
            Map<String, Object> updated = authService.updateAdminInvitation(id, payload);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/admin/passes/{id}/reset
     * Resets a pass back to UNUSED state, clearing out claimed emails, auth tokens, and RSVP statuses.
     */
    @PostMapping("/{id}/reset")
    public ResponseEntity<?> resetPass(
        @PathVariable("id") Long id,
        @RequestHeader(value = "X-Admin-Secret", required = false) String headerSecret,
        @RequestParam(value = "secret", required = false) String querySecret
    ) {
        if (!isAuthorized(headerSecret, querySecret)) {
            return unauthorizedResponse();
        }

        try {
            Map<String, Object> reset = authService.resetAdminInvitation(id);
            return ResponseEntity.ok(reset);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/admin/users/{identifier} or DELETE /api/admin/passes/{identifier}
     * Permanently deletes a user / pass by numeric ID, email, or invitation code.
     * Example: DELETE /api/admin/users/1
     * Example: DELETE /api/admin/users/rawat.family@example.com
     * Example: DELETE /api/admin/users/INV-RAWAT1
     */
    @DeleteMapping({"/{identifier:.+}", "/delete/{identifier:.+}"})
    public ResponseEntity<?> deleteUserByIdentifier(
        @PathVariable("identifier") String identifier,
        @RequestHeader(value = "X-Admin-Secret", required = false) String headerSecret,
        @RequestParam(value = "secret", required = false) String querySecret
    ) {
        if (!isAuthorized(headerSecret, querySecret)) {
            return unauthorizedResponse();
        }

        try {
            Map<String, Object> deleted = authService.deleteUserOrParty(identifier);
            return ResponseEntity.ok(deleted);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/admin/users or DELETE /api/admin/passes
     * Deletes user / pass flexibly via query parameters (?email=... or ?id=...) or JSON body ({"email": "..."}).
     */
    @DeleteMapping
    public ResponseEntity<?> deleteUserFlexible(
        @RequestHeader(value = "X-Admin-Secret", required = false) String headerSecret,
        @RequestParam(value = "secret", required = false) String querySecret,
        @RequestParam(value = "email", required = false) String emailParam,
        @RequestParam(value = "id", required = false) String idParam,
        @RequestParam(value = "identifier", required = false) String identifierParam,
        @RequestBody(required = false) Map<String, Object> body
    ) {
        if (!isAuthorized(headerSecret, querySecret)) {
            return unauthorizedResponse();
        }

        String target = null;
        if (identifierParam != null && !identifierParam.trim().isEmpty()) {
            target = identifierParam.trim();
        } else if (emailParam != null && !emailParam.trim().isEmpty()) {
            target = emailParam.trim();
        } else if (idParam != null && !idParam.trim().isEmpty()) {
            target = idParam.trim();
        } else if (body != null) {
            if (body.get("email") != null) {
                target = body.get("email").toString().trim();
            } else if (body.get("id") != null) {
                target = body.get("id").toString().trim();
            } else if (body.get("identifier") != null) {
                target = body.get("identifier").toString().trim();
            }
        }

        if (target == null || target.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "User identifier missing. Provide 'email', 'id', or 'identifier' via URL path (e.g. /api/admin/users/{email}), query param (?email=...), or JSON body ({\"email\": \"...\"})."
            ));
        }

        try {
            Map<String, Object> deleted = authService.deleteUserOrParty(target);
            return ResponseEntity.ok(deleted);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
