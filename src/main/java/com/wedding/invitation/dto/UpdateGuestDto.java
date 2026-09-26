package com.wedding.invitation.dto;

import java.util.List;

public class UpdateGuestDto {

    private String name;
    private String type; // "FAMILY" or "INDIVIDUAL"
    private List<String> members;

    public UpdateGuestDto() {
    }

    public UpdateGuestDto(String name, String type, List<String> members) {
        this.name = name;
        this.type = type;
        this.members = members;
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
}
