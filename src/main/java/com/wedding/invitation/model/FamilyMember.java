package com.wedding.invitation.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "guest_family_members")
public class FamilyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private boolean attending = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_invitation_id")
    @JsonIgnore
    private GuestInvitation guestInvitation;

    public FamilyMember() {
    }

    public FamilyMember(String name) {
        this.name = name;
        this.attending = false;
    }

    public FamilyMember(String name, boolean attending) {
        this.name = name;
        this.attending = attending;
    }

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

    public boolean isAttending() {
        return attending;
    }

    public void setAttending(boolean attending) {
        this.attending = attending;
    }

    public GuestInvitation getGuestInvitation() {
        return guestInvitation;
    }

    public void setGuestInvitation(GuestInvitation guestInvitation) {
        this.guestInvitation = guestInvitation;
    }
}
