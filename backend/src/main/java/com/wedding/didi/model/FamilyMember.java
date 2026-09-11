package com.wedding.didi.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "family_members")
public class FamilyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String relationship = "Family Member"; // Self, Spouse, Child, Parent, Sibling, Guest

    private Boolean isAttending = true;

    private String dietaryPreference = "PURE_VEG"; // PURE_VEG, JAIN_VEG, NON_VEG

    private String allergyNotes;

    private String absenceReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "party_id", nullable = false)
    @JsonBackReference
    private InvitedParty party;

    private LocalDateTime createdAt = LocalDateTime.now();

    public FamilyMember() {}

    public FamilyMember(String name, String relationship, Boolean isAttending, String dietaryPreference, String allergyNotes, InvitedParty party) {
        this(name, relationship, isAttending, dietaryPreference, allergyNotes, null, party);
    }

    public FamilyMember(String name, String relationship, Boolean isAttending, String dietaryPreference, String allergyNotes, String absenceReason, InvitedParty party) {
        this.name = name;
        this.relationship = relationship != null ? relationship : "Family Member";
        this.isAttending = isAttending != null ? isAttending : true;
        this.dietaryPreference = dietaryPreference != null ? dietaryPreference : "PURE_VEG";
        this.allergyNotes = allergyNotes;
        this.absenceReason = absenceReason;
        this.party = party;
        this.createdAt = LocalDateTime.now();
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

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public Boolean getIsAttending() {
        return isAttending;
    }

    public void setIsAttending(Boolean attending) {
        isAttending = attending;
    }

    public String getDietaryPreference() {
        return dietaryPreference;
    }

    public void setDietaryPreference(String dietaryPreference) {
        this.dietaryPreference = dietaryPreference;
    }

    public String getAllergyNotes() {
        return allergyNotes;
    }

    public void setAllergyNotes(String allergyNotes) {
        this.allergyNotes = allergyNotes;
    }

    public String getAbsenceReason() {
        return absenceReason;
    }

    public void setAbsenceReason(String absenceReason) {
        this.absenceReason = absenceReason;
    }

    public InvitedParty getParty() {
        return party;
    }

    public void setParty(InvitedParty party) {
        this.party = party;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
