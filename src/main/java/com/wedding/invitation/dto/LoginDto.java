package com.wedding.invitation.dto;

public class LoginDto {

    private String action;
    private String credential;

    public LoginDto() {}

    public LoginDto(String action, String credential) {
        this.action = action;
        this.credential = credential;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getCredential() {
        return credential;
    }

    public void setCredential(String credential) {
        this.credential = credential;
    }
}
