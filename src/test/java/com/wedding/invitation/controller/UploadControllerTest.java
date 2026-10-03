package com.wedding.invitation.controller;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @AfterEach
    void cleanUpTestUploads() throws IOException {
        Path uploads = Paths.get("uploads");
        if (Files.exists(uploads)) {
            // Delete test files created
            try (var stream = Files.walk(uploads)) {
                stream.sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
            }
        }
    }

    @Test
    void testUploadUnauthorizedWithoutCookie() throws Exception {
        MockMultipartFile audioFile = new MockMultipartFile(
                "file", "song.mp3", "audio/mpeg", "mock mp3 audio bytes".getBytes()
        );

        mockMvc.perform(multipart("/api/upload/audio").file(audioFile))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testUploadAudioAuthorizedWithAdminCookie() throws Exception {
        Cookie authCookie = new Cookie(AuthController.COOKIE_NAME, "true");
        MockMultipartFile audioFile = new MockMultipartFile(
                "file", "celebration.mp3", "audio/mpeg", "mock mp3 audio content".getBytes()
        );

        mockMvc.perform(multipart("/api/upload/audio")
                        .file(audioFile)
                        .cookie(authCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.url").value(org.hamcrest.Matchers.startsWith("/uploads/audio/")))
                .andExpect(jsonPath("$.fileName").value("celebration.mp3"));
    }

    @Test
    void testUploadImageAuthorizedWithAdminHeader() throws Exception {
        MockMultipartFile imageFile = new MockMultipartFile(
                "file", "couple_photo.jpg", "image/jpeg", "mock jpeg image content".getBytes()
        );

        mockMvc.perform(multipart("/api/upload/image")
                        .file(imageFile)
                        .header("X-Admin-Key", "wedding2027"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.url").value(org.hamcrest.Matchers.startsWith("/uploads/images/")))
                .andExpect(jsonPath("$.fileName").value("couple_photo.jpg"));
    }

    @Test
    void testUploadInvalidFileExtension() throws Exception {
        Cookie authCookie = new Cookie(AuthController.COOKIE_NAME, "true");
        MockMultipartFile exeFile = new MockMultipartFile(
                "file", "malicious.exe", "application/octet-stream", "dummy bytes".getBytes()
        );

        mockMvc.perform(multipart("/api/upload/audio")
                        .file(exeFile)
                        .cookie(authCookie))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
