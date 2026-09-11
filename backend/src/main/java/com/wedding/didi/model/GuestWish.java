package com.wedding.didi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "guest_wishes")
public class GuestWish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Your name is required")
    @Column(nullable = false)
    private String senderName;

    private String relation = "Friend & Well-wisher";

    @NotBlank(message = "A blessing message is required")
    @Column(nullable = false, length = 1000)
    private String message;

    private LocalDateTime createdAt = LocalDateTime.now();

    public GuestWish() {}

    public GuestWish(String senderName, String relation, String message) {
        this.senderName = senderName;
        this.relation = relation != null ? relation : "Friend & Well-wisher";
        this.message = message;
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

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getRelation() {
        return relation;
    }

    public void setRelation(String relation) {
        this.relation = relation;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
