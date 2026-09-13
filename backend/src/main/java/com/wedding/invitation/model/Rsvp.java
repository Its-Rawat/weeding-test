package com.wedding.invitation.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "rsvps")
public class Rsvp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "guest_name", nullable = false)
    @JsonProperty("guest_name")
    private String guestName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "attendance")
    private String attendance = "hadir";

    @Column(name = "guest_count")
    @JsonProperty("guest_count")
    private Integer guestCount = 1;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "created_at")
    @JsonProperty("created_at")
    private String createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now().toString();
        }
    }

    public Rsvp() {}

    public Rsvp(String guestName, String phone, String attendance, Integer guestCount, String message) {
        this.guestName = guestName;
        this.phone = phone;
        this.attendance = attendance != null ? attendance : "hadir";
        this.guestCount = guestCount != null ? guestCount : 1;
        this.message = message;
        this.createdAt = Instant.now().toString();
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAttendance() {
        return attendance;
    }

    public void setAttendance(String attendance) {
        this.attendance = attendance;
    }

    public Integer getGuestCount() {
        return guestCount;
    }

    public void setGuestCount(Integer guestCount) {
        this.guestCount = guestCount;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
