package com.wedding.invitation.dto;

import java.util.List;

public class UpdateGuestEventsDto {

    private List<String> allowedEvents;

    public UpdateGuestEventsDto() {
    }

    public UpdateGuestEventsDto(List<String> allowedEvents) {
        this.allowedEvents = allowedEvents;
    }

    public List<String> getAllowedEvents() {
        return allowedEvents;
    }

    public void setAllowedEvents(List<String> allowedEvents) {
        this.allowedEvents = allowedEvents;
    }
}
