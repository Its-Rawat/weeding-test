package com.wedding.invitation.controller;

import com.wedding.invitation.dto.LoginDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping
public class AuthController {

    public static final String COOKIE_NAME = "wedding_admin_auth";

    @Value("${wedding.admin.password:P@ssw0rd}")
    private String adminPassword;

    public static boolean isAuthenticated(HttpServletRequest request) {
        if (request.getCookies() == null) return false;
        return Arrays.stream(request.getCookies())
                .anyMatch(c -> COOKIE_NAME.equals(c.getName()) && "true".equals(c.getValue()));
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginDto body, HttpServletResponse response) {
        if (body != null && adminPassword.equals(body.getCredential())) {
            Cookie cookie = new Cookie(COOKIE_NAME, "true");
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(60 * 60 * 24); // 1 day
            response.addCookie(cookie);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("success", false, "error", "Invalid credential"));
    }

    @PostMapping("/api/auth/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie(COOKIE_NAME, "");
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/api/auth/status")
    public ResponseEntity<?> status(HttpServletRequest request) {
        return ResponseEntity.ok(Map.of("authenticated", isAuthenticated(request)));
    }
}
