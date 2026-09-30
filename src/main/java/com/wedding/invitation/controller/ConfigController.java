package com.wedding.invitation.controller;

import com.wedding.invitation.service.ConfigService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    private final ConfigService configService;

    public ConfigController(ConfigService configService) {
        this.configService = configService;
    }

    private boolean isAuthorized(HttpServletRequest request) {
        String adminKey = request.getHeader("X-Admin-Key");
        if ("wedding2027".equals(adminKey)) {
            return true;
        }
        return AuthController.isAuthenticated(request);
    }

    @GetMapping
    public ResponseEntity<Map<String, String>> getPublicConfig() {
        return ResponseEntity.ok(configService.getSafePublicConfig());
    }

    @GetMapping("/full")
    public ResponseEntity<?> getFullConfig(HttpServletRequest request) {
        if (!isAuthorized(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized"));
        }
        return ResponseEntity.ok(configService.getRawConfig());
    }

    @PostMapping
    public ResponseEntity<?> updateConfig(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        if (!isAuthorized(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized"));
        }
        configService.saveConfig(body);
        return ResponseEntity.ok(Map.of("success", true, "message", "Configuration updated successfully"));
    }
}
