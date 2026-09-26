package com.wedding.invitation.dto;

import java.util.List;

public class PublicInvitationDto {

    private String name;
    private String type;
    private String status;
    private String rsvpStatus;
    private List<PublicMemberDto> members;
    private String message;

    public static class PublicMemberDto {
        private String name;
        private boolean attending;

        public PublicMemberDto() {
        }

        public PublicMemberDto(String name, boolean attending) {
            this.name = name;
            this.attending = attending;
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

    public PublicInvitationDto() {
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

    public List<PublicMemberDto> getMembers() {
        return members;
    }

    public void setMembers(List<PublicMemberDto> members) {
        this.members = members;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
