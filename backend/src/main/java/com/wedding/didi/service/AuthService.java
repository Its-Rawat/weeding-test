package com.wedding.didi.service;

import com.wedding.didi.model.FamilyMember;
import com.wedding.didi.model.InvitedParty;
import com.wedding.didi.repository.FamilyMemberRepository;
import com.wedding.didi.repository.InvitedPartyRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AuthService {

    private final InvitedPartyRepository invitedPartyRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final EmailNotificationService emailNotificationService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${admin.secret.key:AdityaWeddingAdmin2026}")
    private String adminSecretKey;

    public AuthService(InvitedPartyRepository invitedPartyRepository,
                       FamilyMemberRepository familyMemberRepository,
                       EmailNotificationService emailNotificationService) {
        this.invitedPartyRepository = invitedPartyRepository;
        this.familyMemberRepository = familyMemberRepository;
        this.emailNotificationService = emailNotificationService;
    }

    // =========================================================================
    // 1. CRYPTOGRAPHIC TOKEN GENERATION & HASHING
    // =========================================================================

    /**
     * Generates a cryptographically secure random token (32 bytes / 64 hex chars).
     */
    public String generateSecureToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    /**
     * Computes the SHA-256 hash of a raw token string for secure database storage.
     */
    public String hashToken(String rawToken) {
        if (rawToken == null) return null;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(rawToken.trim().getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedhash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }

    /**
     * Generates a readable unique Invitation Code (e.g. "INV-8F3K92").
     */
    public String generateInvitationCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder sb = new StringBuilder("INV-");
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(secureRandom.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private String obfuscateEmail(String email) {
        if (email == null || !email.contains("@")) return "registered guest";
        int atIndex = email.indexOf('@');
        String namePart = email.substring(0, atIndex);
        String domainPart = email.substring(atIndex);
        if (namePart.length() <= 2) {
            return namePart.charAt(0) + "***" + domainPart;
        }
        return namePart.charAt(0) + "***" + namePart.charAt(namePart.length() - 1) + domainPart;
    }

    // =========================================================================
    // 2. INVITATION VALIDATION & SINGLE-USE REGISTRATION
    // =========================================================================

    /**
     * Validates an invitation by raw token (or invitation code).
     */
    public Map<String, Object> validateInvitation(String tokenOrCode) {
        if (tokenOrCode == null || tokenOrCode.trim().isEmpty()) {
            return Map.of("valid", false, "status", "INVALID", "message", "Invitation link is missing or malformed.");
        }

        String input = tokenOrCode.trim();
        String tokenHash = hashToken(input);

        // Try lookup by token hash first, then by invitation code
        Optional<InvitedParty> partyOpt = invitedPartyRepository.findByTokenHash(tokenHash);
        if (partyOpt.isEmpty()) {
            partyOpt = invitedPartyRepository.findByInvitationCodeIgnoreCase(input);
        }

        if (partyOpt.isEmpty()) {
            return Map.of(
                "valid", false,
                "status", "INVALID",
                "message", "This invitation link is invalid or no longer available."
            );
        }

        InvitedParty party = partyOpt.get();

        // Check if already registered
        if ("REGISTERED".equalsIgnoreCase(party.getStatus())) {
            Map<String, Object> res = new HashMap<>();
            res.put("valid", false);
            res.put("status", "ALREADY_REGISTERED");
            res.put("invitationCode", party.getInvitationCode());
            res.put("familyName", party.getFamilyName());
            res.put("registeredEmailObfuscated", obfuscateEmail(party.getPrimaryEmail()));
            res.put("message", "This invitation has already been registered. Please sign in using your registered email address (" + obfuscateEmail(party.getPrimaryEmail()) + ").");
            return res;
        }

        // Unused & valid!
        Map<String, Object> res = new HashMap<>();
        res.put("valid", true);
        res.put("status", "UNUSED");
        res.put("invitationId", party.getId());
        res.put("invitationCode", party.getInvitationCode());
        res.put("familyName", party.getFamilyName());
        res.put("allowedPartySize", party.getAllowedPartySize());
        res.put("side", party.getSide());
        res.put("assignedTable", party.getAssignedTable());
        res.put("passSerial", party.getPassSerial());
        res.put("message", "Invitation verified. Welcome, " + party.getFamilyName() + "!");
        return res;
    }

    /**
     * Atomically registers an unused invitation pass with an email address.
     * Enforces single-use rule at the database transaction level.
     */
    @Transactional
    public Map<String, Object> registerInvitation(String tokenOrCode, String email, String primaryGuestName) {
        if (email == null || email.trim().isEmpty() || !email.contains("@")) {
            throw new IllegalArgumentException("A valid email address is required for registration.");
        }

        String cleanEmail = email.trim().toLowerCase();

        // 1. Prevent email duplication: check if email is already claimed on another invitation
        Optional<InvitedParty> existingEmailParty = invitedPartyRepository.findByPrimaryEmailIgnoreCase(cleanEmail);

        // 2. Find target invitation
        String input = tokenOrCode.trim();
        String tokenHash = hashToken(input);
        Optional<InvitedParty> partyOpt = invitedPartyRepository.findByTokenHash(tokenHash);
        if (partyOpt.isEmpty()) {
            partyOpt = invitedPartyRepository.findByInvitationCodeIgnoreCase(input);
        }

        if (partyOpt.isEmpty()) {
            throw new IllegalArgumentException("This invitation pass is invalid or no longer available.");
        }

        InvitedParty party = partyOpt.get();

        if (existingEmailParty.isPresent() && !existingEmailParty.get().getId().equals(party.getId())) {
            throw new IllegalArgumentException("This email address (" + cleanEmail + ") is already associated with another wedding invitation pass.");
        }

        if ("REGISTERED".equalsIgnoreCase(party.getStatus())) {
            throw new IllegalArgumentException("This invitation has already been registered. Please sign in with your registered email.");
        }

        // 3. Atomically claim the invitation (DB concurrency protection)
        String sessionAuthToken = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();

        int rowsClaimed = invitedPartyRepository.claimInvitationAtomically(
            party.getId(),
            cleanEmail,
            sessionAuthToken,
            now
        );

        if (rowsClaimed == 0) {
            throw new IllegalStateException("This invitation pass was just claimed by another session. Duplicate registration is not permitted.");
        }

        // 4. Update memory entity and initialize default primary member
        party.setStatus("REGISTERED");
        party.setPrimaryEmail(cleanEmail);
        party.setAuthToken(sessionAuthToken);
        party.setRegisteredAt(now);
        party.setLastLoginAt(now);
        party.setIsVerified(true);

        // The Primary Invitee name is designated by the wedding hosts and cannot be changed
        // Preserve party.getFamilyName() as immutable

        // Create initial primary member if members list is empty
        if (party.getMembers().isEmpty()) {
            FamilyMember primaryMember = new FamilyMember(
                party.getFamilyName(),
                "Primary Guest",
                true,
                "PURE_VEG",
                "",
                party
            );
            party.addMember(primaryMember);
            familyMemberRepository.save(primaryMember);
        }

        invitedPartyRepository.save(party);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("authToken", sessionAuthToken);
        response.put("party", party);
        response.put("message", "Invitation successfully registered for " + party.getFamilyName() + "!");
        return response;
    }

    // =========================================================================
    // 3. RETURNING GUEST EMAIL OTP LOGIN
    // =========================================================================

    public static String fixCommonEmailDomainTypos(String email) {
        if (email == null) return null;
        String clean = email.trim().toLowerCase();
        int atIdx = clean.lastIndexOf('@');
        if (atIdx == -1) return clean;

        String user = clean.substring(0, atIdx);
        String domain = clean.substring(atIdx + 1);

        switch (domain) {
            case "gamil.com":
            case "gmial.com":
            case "gmai.com":
            case "gmaill.com":
            case "gmal.com":
            case "gemail.com":
            case "gmail.co":
                domain = "gmail.com";
                break;
            case "yaho.com":
            case "yahooo.com":
            case "yhaoo.com":
                domain = "yahoo.com";
                break;
            case "hotmial.com":
            case "hotmaill.com":
            case "homail.com":
                domain = "hotmail.com";
                break;
            case "outlok.com":
            case "outloo.com":
                domain = "outlook.com";
                break;
            case "iclud.com":
            case "icoud.com":
                domain = "icloud.com";
                break;
            default:
                break;
        }

        return user + "@" + domain;
    }

    public Optional<InvitedParty> lookupEmail(String email) {
        if (email == null) return Optional.empty();
        String clean = email.trim().toLowerCase();
        Optional<InvitedParty> party = invitedPartyRepository.findByPrimaryEmailIgnoreCase(clean);
        if (party.isPresent()) {
            return party;
        }

        // Check common domain typo variations (e.g. gamil.com -> gmail.com)
        String fixed = fixCommonEmailDomainTypos(clean);
        if (!fixed.equals(clean)) {
            return invitedPartyRepository.findByPrimaryEmailIgnoreCase(fixed);
        }
        return Optional.empty();
    }

    public Map<String, Object> generateAndSendCode(String email) {
        Optional<InvitedParty> partyOpt = lookupEmail(email);
        if (partyOpt.isEmpty()) {
            throw new IllegalArgumentException("This email address is not registered on the private invitation list.");
        }

        InvitedParty party = partyOpt.get();
        if (!"REGISTERED".equalsIgnoreCase(party.getStatus())) {
            throw new IllegalArgumentException("This invitation pass has not yet been registered. Please use your unique invitation link first.");
        }

        // Generate secure 6-digit numeric OTP
        int randomPin = 100000 + secureRandom.nextInt(900000);
        String code = String.valueOf(randomPin);

        party.setVerificationCode(code);
        party.setCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        invitedPartyRepository.save(party);

        System.out.println("=================================================");
        System.out.println(" [WEDDING OTP DISPATCHED] To: " + party.getPrimaryEmail());
        System.out.println(" Guest: " + party.getFamilyName() + " | Code: " + code);
        System.out.println("=================================================");

        // Dispatch real Gmail message if SMTP credentials are configured
        if (emailNotificationService != null && party.getPrimaryEmail() != null) {
            emailNotificationService.sendOtpEmail(party.getPrimaryEmail(), party.getFamilyName(), code);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("email", party.getPrimaryEmail());
        response.put("familyName", party.getFamilyName());
        response.put("allowedPartySize", party.getAllowedPartySize());
        response.put("assignedTable", party.getAssignedTable());
        response.put("demoCode", code); // Pre-filled for development testing
        response.put("message", "A 6-digit verification code has been generated for " + party.getFamilyName() + ".");
        return response;
    }

    public Map<String, Object> verifyCode(String email, String code) {
        Optional<InvitedParty> partyOpt = lookupEmail(email);
        if (partyOpt.isEmpty()) {
            throw new IllegalArgumentException("Email is not registered.");
        }

        InvitedParty party = partyOpt.get();
        if (party.getVerificationCode() == null || !party.getVerificationCode().equals(code.trim())) {
            throw new IllegalArgumentException("Invalid verification code. Please check and try again.");
        }

        if (party.getCodeExpiresAt() != null && LocalDateTime.now().isAfter(party.getCodeExpiresAt())) {
            throw new IllegalArgumentException("Verification code has expired. Please request a new code.");
        }

        String sessionAuthToken = UUID.randomUUID().toString();
        party.setIsVerified(true);
        party.setAuthToken(sessionAuthToken);
        party.setLastLoginAt(LocalDateTime.now());
        invitedPartyRepository.save(party);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("verified", true);
        response.put("authToken", sessionAuthToken);
        response.put("party", party);
        return response;
    }

    // =========================================================================
    // 4. SESSION AUTHENTICATION & PROFILE RESOLUTION
    // =========================================================================

    public Optional<InvitedParty> authenticateSession(String bearerToken) {
        if (bearerToken == null || bearerToken.trim().isEmpty()) {
            return Optional.empty();
        }

        String token = bearerToken.trim();
        if (token.toLowerCase().startsWith("bearer ")) {
            token = token.substring(7).trim();
        }

        return invitedPartyRepository.findByAuthToken(token);
    }

    // =========================================================================
    // 5. RSVP & FAMILY MEMBERS MANAGEMENT
    // =========================================================================

    @Transactional
    public InvitedParty submitFamilyRsvp(String email, Map<String, Object> payload) {
        Optional<InvitedParty> partyOpt = lookupEmail(email);
        if (partyOpt.isEmpty()) {
            throw new IllegalArgumentException("Invited party not found.");
        }

        InvitedParty party = partyOpt.get();
        String currentStatus = party.getRsvpStatus();
        String status = (String) payload.getOrDefault("rsvpStatus", "ATTENDING");

        // Once an RSVP has been accepted (ATTENDING), it can never be declined online
        if ("ATTENDING".equalsIgnoreCase(currentStatus) && "DECLINED".equalsIgnoreCase(status)) {
            throw new IllegalArgumentException("Your RSVP has already been confirmed as Attending. Once accepted, reservations cannot be changed to Declined online. Please contact the wedding hospitality desk for assistance.");
        }

        party.setRsvpStatus(status);

        if ("ATTENDING".equalsIgnoreCase(status)) {
            int requestedHeadcount = 1;
            if (payload.get("confirmedHeadcount") != null) {
                requestedHeadcount = Integer.parseInt(payload.get("confirmedHeadcount").toString());
            }

            // Strictly enforce family quota!
            if (requestedHeadcount > party.getAllowedPartySize()) {
                throw new IllegalArgumentException("Requested headcount (" + requestedHeadcount + ") exceeds your family's reserved limit (" + party.getAllowedPartySize() + ").");
            }

            party.setConfirmedHeadcount(requestedHeadcount);
            party.setAttendingMembers((String) payload.get("attendingMembers"));
            party.setDietaryDetails((String) payload.get("dietaryDetails"));
            party.setAllergies((String) payload.get("allergies"));
            party.setSongRequest((String) payload.get("songRequest"));
            party.setBlessingMessage((String) payload.get("blessingMessage"));

            List<FamilyMember> absentMembers = new ArrayList<>();
            List<FamilyMember> attendingMembers = new ArrayList<>();

            // Synchronize structured family members if provided
            if (payload.containsKey("members") && payload.get("members") instanceof List) {
                List<?> rawMembers = (List<?>) payload.get("members");
                party.getMembers().clear();

                for (Object item : rawMembers) {
                    if (item instanceof Map<?, ?> m) {
                        Object nameObj = m.get("name");
                        String name = nameObj != null ? nameObj.toString() : null;
                        if (name != null && !name.trim().isEmpty()) {
                            Object relObj = m.get("relationship");
                            String rel = relObj != null ? relObj.toString() : "Family Member";

                            Object attObj = m.get("isAttending");
                            Boolean attending = attObj != null ? Boolean.parseBoolean(attObj.toString()) : true;

                            Object dietObj = m.get("dietaryPreference");
                            String diet = dietObj != null ? dietObj.toString() : "PURE_VEG";

                            Object allObj = m.get("allergyNotes");
                            String allergy = allObj != null ? allObj.toString() : "";

                            Object reasonObj = m.get("absenceReason");
                            String absenceReason = reasonObj != null ? reasonObj.toString() : "";

                            FamilyMember fm = new FamilyMember(name.trim(), rel, attending, diet, allergy, absenceReason, party);
                            party.addMember(fm);

                            if (Boolean.FALSE.equals(attending)) {
                                absentMembers.add(fm);
                            } else {
                                attendingMembers.add(fm);
                            }
                        }
                    }
                }
            }

            // Sync confirmed headcount and attending members list from structured members if present
            if (payload.containsKey("members") && payload.get("members") instanceof List) {
                party.setConfirmedHeadcount(attendingMembers.size());
                String attendingNames = attendingMembers.stream()
                    .map(FamilyMember::getName)
                    .reduce((a, b) -> a + ", " + b)
                    .orElse("No members attending");
                party.setAttendingMembers(attendingNames);
            }

            // If any family member is not coming, dispatch email notification to adi2002rawat@gmail.com!
            if (!absentMembers.isEmpty() && emailNotificationService != null) {
                emailNotificationService.sendAbsenceNotification(party, absentMembers, attendingMembers);
            }
        } else {
            party.setConfirmedHeadcount(0);
            if (emailNotificationService != null) {
                FamilyMember primary = new FamilyMember(party.getFamilyName(), "Primary Family Party", false, "NONE", "", "Entire family party declined RSVP", party);
                emailNotificationService.sendAbsenceNotification(party, List.of(primary), List.of());
            }
        }

        party.setRsvpTimestamp(LocalDateTime.now());
        return invitedPartyRepository.save(party);
    }

    // =========================================================================
    // 6. ADMIN INVITATION CREATION & MANIFEST MANAGEMENT
    // =========================================================================

    /**
     * Creates a new unique invitation pass.
     * Generates a raw cryptographic token and stores its SHA-256 hash in the database.
     * Returns the raw token only to the admin for URL/QR generation.
     */
    @Transactional
    public Map<String, Object> createAdminInvitation(Map<String, Object> payload) {
        String familyName = (String) payload.get("familyName");
        if (familyName == null || familyName.trim().isEmpty()) {
            throw new IllegalArgumentException("Family / Guest name is required.");
        }

        int allowedSeats = 2;
        if (payload.get("allowedPartySize") != null) {
            allowedSeats = Integer.parseInt(payload.get("allowedPartySize").toString());
        }

        String side = (String) payload.getOrDefault("side", "Bride's Side (Chandrika)");
        String assignedTable = (String) payload.getOrDefault("assignedTable", "Table 1 - Royal Lotus");

        // Generate unique invitation code and raw cryptographic token
        String invitationCode = generateInvitationCode();
        String rawToken = generateSecureToken();
        String tokenHash = hashToken(rawToken);

        long currentCount = invitedPartyRepository.count();
        String passSerial = (String) payload.getOrDefault("passSerial", "CX-VIP-" + (100 + currentCount + 1));

        InvitedParty party = new InvitedParty();
        party.setInvitationCode(invitationCode);
        party.setTokenHash(tokenHash);
        party.setInviteToken(rawToken); // Stored so admin can retrieve and distribute unused tokens
        party.setStatus("UNUSED");
        party.setFamilyName(familyName.trim());
        party.setAllowedPartySize(allowedSeats);
        party.setConfirmedHeadcount(0);
        party.setSide(side);
        party.setAssignedTable(assignedTable);
        party.setPassSerial(passSerial);
        party.setRsvpStatus("PENDING");
        party.setIsVerified(false);
        party.setCreatedAt(LocalDateTime.now());

        // Pre-create initial family member slot
        FamilyMember primary = new FamilyMember(familyName.trim(), "Primary Guest", true, "PURE_VEG", "", party);
        party.addMember(primary);

        InvitedParty saved = invitedPartyRepository.save(party);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("id", saved.getId());
        res.put("invitationCode", invitationCode);
        res.put("rawToken", rawToken); // Raw token provided to generate the unique link & QR code
        res.put("invitationUrl", "/invite/" + rawToken);
        res.put("familyName", saved.getFamilyName());
        res.put("allowedPartySize", saved.getAllowedPartySize());
        res.put("status", saved.getStatus());
        res.put("passSerial", saved.getPassSerial());
        res.put("side", saved.getSide());
        res.put("assignedTable", saved.getAssignedTable());
        res.put("message", "Invitation pass successfully created for " + saved.getFamilyName() + ".");

        return res;
    }

    public boolean verifyAdminSecret(String providedSecret) {
        if (providedSecret == null || providedSecret.trim().isEmpty()) {
            return false;
        }
        String clean = providedSecret.trim();
        if ("AdityaWeddingAdmin2026".equals(clean)
                || "AdityaWeddingAdmin2026!#".equals(clean)
                || "AdityaWeddingAdmin2026!".equals(clean)
                || "AdityaWeddingAdmin2026!%23".equals(clean)) {
            return true;
        }
        return adminSecretKey != null && clean.equals(adminSecretKey.trim());
    }

    /**
     * Admin-only method to get full passes breakdown: summary, available unused passes, and registered used passes.
     */
    public Map<String, Object> getAdminPassesOverview() {
        Map<String, Object> result = new HashMap<>();
        result.put("summary", getMasterStats());
        result.put("unusedPasses", getUnusedPassesDetailed());
        result.put("usedPasses", getUsedPassesDetailed());
        return result;
    }

    public List<Map<String, Object>> getUnusedPassesDetailed() {
        List<InvitedParty> unused = invitedPartyRepository.findByStatusOrderByCreatedAtDesc("UNUSED");
        List<Map<String, Object>> list = new ArrayList<>();

        for (InvitedParty p : unused) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", p.getId());
            item.put("invitationCode", p.getInvitationCode());
            String token = p.getInviteToken() != null ? p.getInviteToken() : "";
            item.put("inviteToken", token);
            item.put("invitationUrl", "/invite/" + token);
            item.put("familyName", p.getFamilyName());
            item.put("allowedPartySize", p.getAllowedPartySize());
            item.put("side", p.getSide());
            item.put("assignedTable", p.getAssignedTable());
            item.put("passSerial", p.getPassSerial());
            item.put("status", "UNUSED");
            item.put("createdAt", p.getCreatedAt());
            list.add(item);
        }
        return list;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getUsedPassesDetailed() {
        List<InvitedParty> registered = invitedPartyRepository.findByStatusOrderByCreatedAtDesc("REGISTERED");
        List<Map<String, Object>> list = new ArrayList<>();

        for (InvitedParty p : registered) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", p.getId());
            item.put("invitationCode", p.getInvitationCode());
            item.put("primaryEmail", p.getPrimaryEmail());
            item.put("familyName", p.getFamilyName());
            int allowed = p.getAllowedPartySize() != null ? p.getAllowedPartySize() : 2;
            int confirmed = p.getConfirmedHeadcount() != null ? p.getConfirmedHeadcount() : 0;
            item.put("allowedPartySize", allowed);
            item.put("confirmedHeadcount", confirmed);
            item.put("peopleAttending", confirmed);
            item.put("peopleNotAttending", Math.max(0, allowed - confirmed));
            item.put("rsvpStatus", p.getRsvpStatus());
            item.put("attendingMembers", p.getAttendingMembers());
            item.put("dietaryDetails", p.getDietaryDetails());
            item.put("allergies", p.getAllergies());
            item.put("songRequest", p.getSongRequest());
            item.put("blessingMessage", p.getBlessingMessage());
            item.put("side", p.getSide());
            item.put("assignedTable", p.getAssignedTable());
            item.put("passSerial", p.getPassSerial());
            item.put("status", "REGISTERED");
            item.put("registeredAt", p.getRegisteredAt());
            item.put("lastLoginAt", p.getLastLoginAt());

            if (p.getMembers() != null && !p.getMembers().isEmpty()) {
                List<Map<String, Object>> membersList = new ArrayList<>();
                for (FamilyMember m : p.getMembers()) {
                    Map<String, Object> mObj = new HashMap<>();
                    mObj.put("name", m.getName());
                    mObj.put("relationship", m.getRelationship());
                    mObj.put("isAttending", m.getIsAttending() != null ? m.getIsAttending() : true);
                    mObj.put("absenceReason", m.getAbsenceReason());
                    mObj.put("dietaryPreference", m.getDietaryPreference());
                    mObj.put("allergyNotes", m.getAllergyNotes());
                    membersList.add(mObj);
                }
                item.put("members", membersList);
            }

            list.add(item);
        }
        return list;
    }

    public List<InvitedParty> getAllParties() {
        return invitedPartyRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<InvitedParty> getPartiesByStatus(String status) {
        if ("ALL".equalsIgnoreCase(status) || status == null) {
            return invitedPartyRepository.findAllByOrderByCreatedAtDesc();
        }
        return invitedPartyRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getMasterStats() {
        List<InvitedParty> allParties = invitedPartyRepository.findAll();

        long totalParties = allParties.size();
        long totalAllowedSeats = 0;
        long totalPeopleAttending = 0;
        long totalPeopleNotAttending = 0;
        long totalPeoplePending = 0;

        long registeredParties = 0;
        long unusedParties = 0;
        long attendingParties = 0;
        long declinedParties = 0;
        long pendingParties = 0;

        long absentFamilyMembersCount = 0;
        long declinedPartyGuestsCount = 0;

        for (InvitedParty p : allParties) {
            int allowed = p.getAllowedPartySize() != null ? p.getAllowedPartySize() : 2;
            totalAllowedSeats += allowed;

            String status = p.getStatus();
            if ("REGISTERED".equalsIgnoreCase(status)) {
                registeredParties++;
            } else {
                unusedParties++;
            }

            String rsvp = p.getRsvpStatus();
            if ("ATTENDING".equalsIgnoreCase(rsvp)) {
                attendingParties++;
                int confirmed = p.getConfirmedHeadcount() != null ? p.getConfirmedHeadcount() : 0;
                totalPeopleAttending += confirmed;

                int notAttendingFromParty = Math.max(0, allowed - confirmed);
                totalPeopleNotAttending += notAttendingFromParty;

                if (p.getMembers() != null) {
                    for (FamilyMember fm : p.getMembers()) {
                        if (Boolean.FALSE.equals(fm.getIsAttending())) {
                            absentFamilyMembersCount++;
                        }
                    }
                }
            } else if ("DECLINED".equalsIgnoreCase(rsvp)) {
                declinedParties++;
                totalPeopleNotAttending += allowed;
                declinedPartyGuestsCount += allowed;
            } else {
                pendingParties++;
                totalPeoplePending += allowed;
            }
        }

        Map<String, Object> stats = new HashMap<>();
        // Party-level counts
        stats.put("totalParties", totalParties);
        stats.put("registeredParties", registeredParties);
        stats.put("unusedParties", unusedParties);
        stats.put("attendingParties", attendingParties);
        stats.put("declinedParties", declinedParties);
        stats.put("pendingParties", pendingParties);

        // People-level headcount counts (Total Attending after subtracting Not Attending)
        stats.put("totalAllowedSeats", totalAllowedSeats);
        stats.put("totalPeopleAttending", totalPeopleAttending);
        stats.put("totalPeopleNotAttending", totalPeopleNotAttending);
        stats.put("totalPeoplePending", totalPeoplePending);
        stats.put("confirmedHeadcount", totalPeopleAttending); // Legacy & UI compatibility
        stats.put("remainingSeats", Math.max(0, 100 - totalPeopleAttending));
        stats.put("absentFamilyMembersCount", absentFamilyMembersCount);
        stats.put("declinedPartyGuestsCount", declinedPartyGuestsCount);

        return stats;
    }

    @Transactional
    public Map<String, Object> updateAdminInvitation(Long partyId, Map<String, Object> payload) {
        InvitedParty party = invitedPartyRepository.findById(partyId)
                .orElseThrow(() -> new IllegalArgumentException("Pass not found with ID: " + partyId));

        if (payload.containsKey("familyName") && payload.get("familyName") != null) {
            party.setFamilyName(((String) payload.get("familyName")).trim());
        }
        if (payload.containsKey("allowedPartySize") && payload.get("allowedPartySize") != null) {
            party.setAllowedPartySize(Integer.parseInt(payload.get("allowedPartySize").toString()));
        }
        if (payload.containsKey("assignedTable") && payload.get("assignedTable") != null) {
            party.setAssignedTable((String) payload.get("assignedTable"));
        }
        if (payload.containsKey("side") && payload.get("side") != null) {
            party.setSide((String) payload.get("side"));
        }
        if (payload.containsKey("rsvpStatus") && payload.get("rsvpStatus") != null) {
            party.setRsvpStatus((String) payload.get("rsvpStatus"));
        }
        if (payload.containsKey("confirmedHeadcount") && payload.get("confirmedHeadcount") != null) {
            party.setConfirmedHeadcount(Integer.parseInt(payload.get("confirmedHeadcount").toString()));
        }

        InvitedParty saved = invitedPartyRepository.save(party);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Pass ID " + partyId + " (" + saved.getFamilyName() + ") successfully updated.");
        res.put("id", saved.getId());
        res.put("familyName", saved.getFamilyName());
        res.put("allowedPartySize", saved.getAllowedPartySize());
        res.put("confirmedHeadcount", saved.getConfirmedHeadcount());
        res.put("assignedTable", saved.getAssignedTable());
        res.put("side", saved.getSide());
        res.put("rsvpStatus", saved.getRsvpStatus());
        return res;
    }

    @Transactional
    public Map<String, Object> resetAdminInvitation(Long partyId) {
        InvitedParty party = invitedPartyRepository.findById(partyId)
                .orElseThrow(() -> new IllegalArgumentException("Pass not found with ID: " + partyId));

        party.setStatus("UNUSED");
        party.setPrimaryEmail(null);
        party.setAuthToken(null);
        party.setVerificationCode(null);
        party.setCodeExpiresAt(null);
        party.setIsVerified(false);
        party.setRsvpStatus("PENDING");
        party.setConfirmedHeadcount(0);
        party.setAttendingMembers(null);
        party.setDietaryDetails(null);
        party.setAllergies(null);
        party.setSongRequest(null);
        party.setBlessingMessage(null);

        InvitedParty saved = invitedPartyRepository.save(party);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Pass ID " + partyId + " (" + saved.getFamilyName() + ") reset to UNUSED state.");
        res.put("id", saved.getId());
        res.put("invitationCode", saved.getInvitationCode());
        res.put("rawToken", saved.getInviteToken());
        res.put("invitationUrl", "/invite/" + saved.getInviteToken());
        return res;
    }

    @Transactional
    public Map<String, Object> deleteAdminInvitation(Long partyId) {
        InvitedParty party = invitedPartyRepository.findById(partyId)
                .orElseThrow(() -> new IllegalArgumentException("Pass not found with ID: " + partyId));

        String name = party.getFamilyName();
        invitedPartyRepository.delete(party);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Pass ID " + partyId + " (" + name + ") has been permanently deleted.");
        return res;
    }
}
