package com.wedding.invitation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wedding.invitation.dto.CreateGuestDto;
import com.wedding.invitation.dto.SubmitPersonalizedRsvpDto;
import com.wedding.invitation.dto.UpdateGuestEventsDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class GuestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGuestCelebrationsLifecycle() throws Exception {
        // 1. Create a guest family with specific celebrations (Wedding & Reception only)
        CreateGuestDto createDto = new CreateGuestDto();
        createDto.setName("Rawat Royal Family");
        createDto.setType("FAMILY");
        createDto.setMembers(List.of("Aditya Rawat", "Meena Rawat"));
        createDto.setAllowedEvents(List.of("WEDDING", "RECEPTION"));

        MvcResult createResult = mockMvc.perform(post("/api/guests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.allowedEvents", hasSize(2)))
                .andExpect(jsonPath("$.allowedEvents", hasItems("WEDDING", "RECEPTION")))
                .andReturn();

        String responseBody = createResult.getResponse().getContentAsString();
        Long guestId = objectMapper.readTree(responseBody).get("id").asLong();
        String token = objectMapper.readTree(responseBody).get("token").asText();
        assertNotNull(token);

        // 2. Fetch public invitation by token and verify only allowed celebrations are returned
        mockMvc.perform(get("/api/rsvp/" + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Rawat Royal Family"))
                .andExpect(jsonPath("$.allowedEvents", hasSize(2)))
                .andExpect(jsonPath("$.allowedEvents", hasItems("WEDDING", "RECEPTION")));

        // 3. Update celebrations via PATCH /api/guests/{id}/events to include Haldi too
        UpdateGuestEventsDto eventsDto = new UpdateGuestEventsDto();
        eventsDto.setAllowedEvents(List.of("HALDI", "WEDDING", "RECEPTION"));

        mockMvc.perform(patch("/api/guests/" + guestId + "/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(eventsDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.allowedEvents", hasSize(3)))
                .andExpect(jsonPath("$.allowedEvents", hasItems("HALDI", "WEDDING", "RECEPTION")));

        // 4. Verify public invitation reflects the updated celebrations
        mockMvc.perform(get("/api/rsvp/" + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.allowedEvents", hasSize(3)))
                .andExpect(jsonPath("$.allowedEvents", hasItems("HALDI", "WEDDING", "RECEPTION")));

        // 5. Submit personalized RSVP
        SubmitPersonalizedRsvpDto rsvpDto = new SubmitPersonalizedRsvpDto();
        rsvpDto.setRsvpStatus("ATTENDING");
        rsvpDto.setAttendingMembers(List.of("Aditya Rawat"));
        rsvpDto.setMessage("Joyfully celebrating with Chandrika & Xudong!");

        mockMvc.perform(post("/api/rsvp/" + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rsvpDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.attendingCount").value(1));
    }
}
