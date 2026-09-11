package com.wedding.didi.controller;

import com.wedding.didi.model.WeddingEvent;
import com.wedding.didi.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<WeddingEvent>> getEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @PostMapping
    public ResponseEntity<WeddingEvent> createEvent(@RequestBody WeddingEvent event) {
        return ResponseEntity.ok(eventService.saveEvent(event));
    }
}
