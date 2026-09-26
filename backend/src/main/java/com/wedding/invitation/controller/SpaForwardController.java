package com.wedding.invitation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping(value = {"/admin", "/qrcode", "/admin/**", "/qrcode/**", "/rsvp", "/rsvp/**"})
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
