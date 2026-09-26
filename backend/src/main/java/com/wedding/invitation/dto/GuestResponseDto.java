package com.wedding.invitation.dto;

import java.time.LocalDateTime;
import java.util.List;

public class GuestResponseDto {

    private Long id;
    private String name;
    private String type;
    private String token;
    private String rsvpLink;
    private String status;
    private String rsvpStatus;
    private List<MemberDto> members;
    private String message;
    private List<String> allowedEvents;
    private LocalDateTime respondedAt;
    private LocalDateTime createdAt;

    public static class MemberDto {
        private Long id;
        private String name;
        private boolean attending;

        public MemberDto() {
        }

        public MemberDto(Long id, String name, boolean attending) {
            this.id = id;
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
    }

    public GuestResponseDto() {
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRsvpLink() {
        return rsvpLink;
    }

    public void setRsvpLink(String rsvpLink) {
        this.rsvpLink = rsvpLink;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRsvpStatus() {
        return rsvpStatus;
    }

    public void setRsvpStatus(String rsvpStatus) {
        this.rsvpStatus = rsvpStatus;
    }

    public List<MemberDto> getMembers() {
        return members;
    }

    public void setMembers(List<MemberDto> members) {
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

    public List<String> getAllowedEvents() {
        return allowedEvents;
    }

    public void setAllowedEvents(List<String> allowedEvents) {
        this.allowedEvents = allowedEvents;
    }
}
