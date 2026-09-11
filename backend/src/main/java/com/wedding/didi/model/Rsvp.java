package com.wedding.didi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "rsvps")
public class Rsvp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Guest name is required")
    @Column(nullable = false)
    private String guestName;

    private String email;

    private String phone;

    @Column(nullable = false)
    private String attendingStatus; // ATTENDING or DECLINED

    private Integer guestCount = 1;

    @Column(length = 500)
    private String attendingEvents; // e.g. "Mehendi, Haldi, Sangeet, Phere, Reception"

    private String dietaryPreference = "PURE_VEG"; // PURE_VEG, JAIN_VEG, NON_VEG

    private String songRequest;

    @Column(length = 1000)
    private String blessingMessage;

    private String inviteCode;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Rsvp() {}

    public Rsvp(String guestName, String email, String phone, String attendingStatus, 
                Integer guestCount, String attendingEvents, String dietaryPreference, 
                String songRequest, String blessingMessage, String inviteCode) {
        this.guestName = guestName;
        this.email = email;
        this.phone = phone;
        this.attendingStatus = attendingStatus;
        this.guestCount = guestCount != null ? guestCount : 1;
        this.attendingEvents = attendingEvents;
        this.dietaryPreference = dietaryPreference != null ? dietaryPreference : "PURE_VEG";
        this.songRequest = songRequest;
        this.blessingMessage = blessingMessage;
        this.inviteCode = inviteCode;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    public void onPrePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAttendingStatus() {
        return attendingStatus;
    }

    public void setAttendingStatus(String attendingStatus) {
        this.attendingStatus = attendingStatus;
    }

    public Integer getGuestCount() {
        return guestCount;
    }

    public void setGuestCount(Integer guestCount) {
        this.guestCount = guestCount;
    }

    public String getAttendingEvents() {
        return attendingEvents;
    }

    public void setAttendingEvents(String attendingEvents) {
        this.attendingEvents = attendingEvents;
    }

    public String getDietaryPreference() {
        return dietaryPreference;
    }

    public void setDietaryPreference(String dietaryPreference) {
        this.dietaryPreference = dietaryPreference;
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

    public String getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
