package com.wedding.invitation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wedding.invitation.dto.RsvpDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class RsvpControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testSubmitAndGetRsvp() throws Exception {
        RsvpDto dto = new RsvpDto();
        dto.setGuestName("Alice Smith");
        dto.setPhone("+123456789");
        dto.setAttendance("hadir");
        dto.setGuestCount(2);
        dto.setMessage("Warmest congratulations Chandrika & Xudong!");

        mockMvc.perform(post("/api/rsvp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.action").value("created"));

        mockMvc.perform(get("/api/rsvp"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.guest_name == 'Alice Smith')]").exists());
    }
}
