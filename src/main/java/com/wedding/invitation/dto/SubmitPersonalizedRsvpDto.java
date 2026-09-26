package com.wedding.invitation.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class SubmitPersonalizedRsvpDto {

    @NotBlank(message = "RSVP status is required (ATTENDING or NOT_ATTENDING)")
    private String rsvpStatus;

    private List<String> attendingMembers;

    private String message;

    public SubmitPersonalizedRsvpDto() {
    }

    public SubmitPersonalizedRsvpDto(String rsvpStatus, List<String> attendingMembers, String message) {
        this.rsvpStatus = rsvpStatus;
        this.attendingMembers = attendingMembers;
        this.message = message;
    }

    public String getRsvpStatus() {
        return rsvpStatus;
    }

    public void setRsvpStatus(String rsvpStatus) {
        this.rsvpStatus = rsvpStatus;
    }

    public List<String> getAttendingMembers() {
        return attendingMembers;
    }

    public void setAttendingMembers(List<String> attendingMembers) {
        this.attendingMembers = attendingMembers;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
