package com.wedding.invitation.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CreateGuestDto {

    @NotBlank(message = "Guest or family name is required")
    private String name;

    private String type; // "FAMILY" or "INDIVIDUAL" (defaults to FAMILY)

    private List<String> members; // optional list of family member names

    private List<String> allowedEvents; // optional list e.g. ["MEHENDI", "HALDI", "WEDDING", "RECEPTION"]

    public CreateGuestDto() {
    }

    public CreateGuestDto(String name, String type, List<String> members) {
        this.name = name;
        this.type = type;
        this.members = members;
    }

    public CreateGuestDto(String name, String type, List<String> members, List<String> allowedEvents) {
        this.name = name;
        this.type = type;
        this.members = members;
        this.allowedEvents = allowedEvents;
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

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) {
        this.members = members;
    }

    public List<String> getAllowedEvents() {
        return allowedEvents;
    }

    public void setAllowedEvents(List<String> allowedEvents) {
        this.allowedEvents = allowedEvents;
    }
}
