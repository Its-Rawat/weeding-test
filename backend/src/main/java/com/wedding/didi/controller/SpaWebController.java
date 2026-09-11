package com.wedding.didi.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaWebController {

    @GetMapping(value = { "/", "/invite/**" })
    public String forwardToSpa() {
        return "forward:/index.html";
    }
}