package com.wedding.invitation.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateGuestStatusDto {

    @NotBlank(message = "Status is required (ACTIVE or INACTIVE)")
    private String status;

    public UpdateGuestStatusDto() {
    }

    public UpdateGuestStatusDto(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
