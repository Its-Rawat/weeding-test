package com.wedding.didi.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invited_parties")
public class InvitedParty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique readable invitation code, e.g. "INV-8F3K92" or "INV-CX2026"
    @Column(unique = true)
    private String invitationCode;

    // SHA-256 hash of the cryptographically secure random token (never store raw token in DB)
    @Column(length = 64)
    private String tokenHash;

    // Usable token string (kept for admin retrieval of unused passes)
    @Column(length = 255)
    private String inviteToken;

    // Status: UNUSED or REGISTERED
    @Column(nullable = false)
    private String status = "UNUSED";

    // Primary email associated during registration
    @Column(unique = true)
    private String primaryEmail;

    @Column(nullable = false)
    private String familyName;

    @Column(nullable = false)
    private Integer allowedPartySize = 2; // e.g. 4 for family of 4

    private Integer confirmedHeadcount = 0;

    private String side; // "Bride's Side (Chandrika)" or "Groom's Side (Xudong)"

    private String assignedTable = "Table 1 - Lotus Pavilion";

    // Active session bearer token for authenticated requests
    private String authToken;

    // OTP for email login
    private String verificationCode;

    private LocalDateTime codeExpiresAt;

    private Boolean isVerified = false;

    private String rsvpStatus = "PENDING"; // PENDING, ATTENDING, DECLINED

    @Column(length = 1000)
    private String attendingMembers; // Summary names string for display / quick CSV

    @Column(length = 1000)
    private String dietaryDetails;

    private String allergies;

    private String songRequest;

    @Column(length = 1000)
    private String blessingMessage;

    private String passSerial; // e.g. "CX-VIP-101"

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime registeredAt;

    private LocalDateTime lastLoginAt;

    private LocalDateTime rsvpTimestamp;

    // Individual structured family members
    @OneToMany(mappedBy = "party", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<FamilyMember> members = new ArrayList<>();

    public InvitedParty() {}

    public InvitedParty(String primaryEmail, String familyName, Integer allowedPartySize, String side, String assignedTable, String passSerial) {
        this.primaryEmail = primaryEmail != null ? primaryEmail.toLowerCase().trim() : null;
        this.familyName = familyName;
        this.allowedPartySize = allowedPartySize != null ? allowedPartySize : 2;
        this.side = side;
        this.assignedTable = assignedTable;
        this.passSerial = passSerial;
        this.rsvpStatus = "PENDING";
        this.isVerified = primaryEmail != null;
        this.status = primaryEmail != null ? "REGISTERED" : "UNUSED";
        this.confirmedHeadcount = 0;
        this.createdAt = LocalDateTime.now();
    }

    public void addMember(FamilyMember member) {
        members.add(member);
        member.setParty(this);
    }

    public void removeMember(FamilyMember member) {
        members.remove(member);
        member.setParty(null);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInvitationCode() {
        return invitationCode;
    }

    public void setInvitationCode(String invitationCode) {
        this.invitationCode = invitationCode;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public void setTokenHash(String tokenHash) {
        this.tokenHash = tokenHash;
    }

    public String getInviteToken() {
        return inviteToken;
    }

    public void setInviteToken(String inviteToken) {
        this.inviteToken = inviteToken;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPrimaryEmail() {
        return primaryEmail;
    }

    public void setPrimaryEmail(String primaryEmail) {
        this.primaryEmail = primaryEmail != null ? primaryEmail.toLowerCase().trim() : null;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    public Integer getAllowedPartySize() {
        return allowedPartySize;
    }

    public void setAllowedPartySize(Integer allowedPartySize) {
        this.allowedPartySize = allowedPartySize;
    }

    public Integer getConfirmedHeadcount() {
        return confirmedHeadcount;
    }

    public void setConfirmedHeadcount(Integer confirmedHeadcount) {
        this.confirmedHeadcount = confirmedHeadcount;
    }

    public String getSide() {
        return side;
    }

    public void setSide(String side) {
        this.side = side;
    }

    public String getAssignedTable() {
        return assignedTable;
    }

    public void setAssignedTable(String assignedTable) {
        this.assignedTable = assignedTable;
    }

    public String getAuthToken() {
        return authToken;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public LocalDateTime getCodeExpiresAt() {
        return codeExpiresAt;
    }

    public void setCodeExpiresAt(LocalDateTime codeExpiresAt) {
        this.codeExpiresAt = codeExpiresAt;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean verified) {
        isVerified = verified;
    }

    public String getRsvpStatus() {
        return rsvpStatus;
    }

    public void setRsvpStatus(String rsvpStatus) {
        this.rsvpStatus = rsvpStatus;
    }

    public String getAttendingMembers() {
        return attendingMembers;
    }

    public void setAttendingMembers(String attendingMembers) {
        this.attendingMembers = attendingMembers;
    }

    public String getDietaryDetails() {
        return dietaryDetails;
    }

    public void setDietaryDetails(String dietaryDetails) {
        this.dietaryDetails = dietaryDetails;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getSongRequest() {
        return songRequest;
    }

    public void setSongRequest(String songRequest) {
        this.songRequest = songRequest;
    }

    public String getBlessingMessage() {
        return blessingMessage;
    }

    public void setBlessingMessage(String blessingMessage) {
        this.blessingMessage = blessingMessage;
    }

    public String getPassSerial() {
        return passSerial;
    }

    public void setPassSerial(String passSerial) {
        this.passSerial = passSerial;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }

    public void setLastLoginAt(LocalDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }

    public LocalDateTime getRsvpTimestamp() {
        return rsvpTimestamp;
    }

    public void setRsvpTimestamp(LocalDateTime rsvpTimestamp) {
        this.rsvpTimestamp = rsvpTimestamp;
    }

    public List<FamilyMember> getMembers() {
        return members;
    }

    public void setMembers(List<FamilyMember> members) {
        this.members = members;
    }
}
