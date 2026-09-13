package com.wedding.invitation.dto;

import jakarta.validation.constraints.NotBlank;

public class WishDto {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Message is required")
    private String message;

    public WishDto() {}

    public WishDto(String name, String message) {
        this.name = name;
        this.message = message;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
