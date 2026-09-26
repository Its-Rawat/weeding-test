package com.wedding.invitation.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "guest_invitations", indexes = {
    @Index(name = "idx_guest_token", columnList = "token", unique = true)
})
public class GuestInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GuestType type = GuestType.FAMILY;

    @Column(nullable = false, unique = true, length = 64)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvitationStatus status = InvitationStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RsvpState rsvpStatus = RsvpState.PENDING;

    @OneToMany(mappedBy = "guestInvitation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<FamilyMember> members = new ArrayList<>();

    @Column(length = 2000)
    private String message;

    private LocalDateTime respondedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public GuestInvitation() {
    }

    public GuestInvitation(String name, GuestType type, String token) {
        this.name = name;
        this.type = type != null ? type : GuestType.FAMILY;
        this.token = token;
        this.status = InvitationStatus.ACTIVE;
        this.rsvpStatus = RsvpState.PENDING;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void addMember(FamilyMember member) {
        members.add(member);
        member.setGuestInvitation(this);
    }

    public void removeMember(FamilyMember member) {
        members.remove(member);
        member.setGuestInvitation(null);
    }

    public void clearMembers() {
        for (FamilyMember m : new ArrayList<>(members)) {
            removeMember(m);
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public GuestType getType() {
        return type;
    }

    public void setType(GuestType type) {
        this.type = type;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public InvitationStatus getStatus() {
        return status;
    }

    public void setStatus(InvitationStatus status) {
        this.status = status;
    }

    public RsvpState getRsvpStatus() {
        return rsvpStatus;
    }

    public void setRsvpStatus(RsvpState rsvpStatus) {
        this.rsvpStatus = rsvpStatus;
    }

    public List<FamilyMember> getMembers() {
        return members;
    }

    public void setMembers(List<FamilyMember> members) {
        this.members = members;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
