package com.wedding.invitation.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private static final Set<String> ALLOWED_AUDIO_EXTENSIONS = Set.of("mp3", "wav", "m4a", "aac", "ogg", "flac");
    private static final Set<String> ALLOWED_IMAGE_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp", "gif", "svg");

    private boolean isAuthorized(HttpServletRequest request) {
        String adminKey = request.getHeader("X-Admin-Key");
        if ("wedding2027".equals(adminKey)) {
            return true;
        }
        return AuthController.isAuthenticated(request);
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT);
    }

    private String sanitizeFilename(String filename) {
        if (filename == null) return "file";
        String clean = StringUtils.cleanPath(filename).replaceAll("[^a-zA-Z0-9._-]", "_");
        if (clean.length() > 60) {
            String ext = getFileExtension(clean);
            clean = clean.substring(0, 50) + (ext.isEmpty() ? "" : "." + ext);
        }
        return clean;
    }

    private ResponseEntity<?> handleFileUpload(MultipartFile file, String subDir, Set<String> allowedExtensions) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Please provide a valid file"));
        }

        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);

        if (!allowedExtensions.contains(extension)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Invalid file extension '." + extension + "'. Allowed: " + allowedExtensions
            ));
        }

        try {
            Path targetDir = Paths.get("uploads", subDir).toAbsolutePath().normalize();
            Files.createDirectories(targetDir);

            String sanitized = sanitizeFilename(originalFilename);
            String uniqueName = System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + "_" + sanitized;
            Path destination = targetDir.resolve(uniqueName);

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            String publicUrl = "/uploads/" + subDir + "/" + uniqueName;

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("success", true);
            result.put("url", publicUrl);
            result.put("fileName", originalFilename);
            result.put("storedName", uniqueName);
            result.put("size", file.getSize());
            result.put("type", subDir);

            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Failed to save file: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/audio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAudio(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        if (!isAuthorized(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }
        return handleFileUpload(file, "audio", ALLOWED_AUDIO_EXTENSIONS);
    }

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        if (!isAuthorized(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }
        return handleFileUpload(file, "images", ALLOWED_IMAGE_EXTENSIONS);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadGeneric(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        if (!isAuthorized(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }
        String ext = getFileExtension(file.getOriginalFilename());
        if (ALLOWED_AUDIO_EXTENSIONS.contains(ext)) {
            return handleFileUpload(file, "audio", ALLOWED_AUDIO_EXTENSIONS);
        } else if (ALLOWED_IMAGE_EXTENSIONS.contains(ext)) {
            return handleFileUpload(file, "images", ALLOWED_IMAGE_EXTENSIONS);
        }
        return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Unsupported file type '." + ext + "'."
        ));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteFile(@RequestParam(value = "url", required = false) String urlParam,
                                        @RequestBody(required = false) Map<String, String> body,
                                        HttpServletRequest request) {
        if (!isAuthorized(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }

        String targetUrl = urlParam;
        if ((targetUrl == null || targetUrl.isBlank()) && body != null) {
            targetUrl = body.get("url");
        }

        if (targetUrl == null || !targetUrl.startsWith("/uploads/")) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Invalid upload URL"));
        }

        try {
            String relative = targetUrl.substring("/uploads/".length());
            Path filePath = Paths.get("uploads", relative).toAbsolutePath().normalize();
            Path rootUploads = Paths.get("uploads").toAbsolutePath().normalize();

            // Prevent path traversal
            if (!filePath.startsWith(rootUploads)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Illegal path access"));
            }

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                return ResponseEntity.ok(Map.of("success", true, "message", "File deleted successfully"));
            } else {
                return ResponseEntity.ok(Map.of("success", true, "message", "File not found or already deleted"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Failed to delete file: " + e.getMessage()));
        }
    }
}
