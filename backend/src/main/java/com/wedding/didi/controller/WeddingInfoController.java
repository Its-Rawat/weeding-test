package com.wedding.didi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/wedding-info")
@CrossOrigin(origins = "*")
public class WeddingInfoController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getWeddingInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("brideName", "Chandrika");
        info.put("groomName", "Xudong");
        info.put("coupleTitle", "Chandrika & Xudong");
        info.put("monogram", "C & X");
        info.put("hostPrefix", "HOST:");
        info.put("hostName", "The Verma & Wang Families");
        info.put("weddingDate", "November 28, 2026");
        info.put("weddingDatesRange", "November 26 – 28, 2026");
        info.put("targetCountdownDate", "2026-11-28T18:00:00");
        info.put("eventCode", "CX2026");
        info.put("totalInvitedLimit", 100);
        info.put("locationCity", "Udaipur, Rajasthan, India");
        info.put("mainVenue", "The Oberoi Udaivilas, Haridas Ji Ki Magri, Udaipur");
        info.put("welcomeNote", "With joyful hearts and the blessings of our elders, we invite our closest family and friends to celebrate the union of Chandrika & Xudong.");
        info.put("tagline", "Two ancient cultures, two loving souls, one royal celebration in Udaipur.");
        info.put("rsvpDeadline", "November 10, 2026");
        info.put("hospitalityPhone", "+91 98765 43210");
        info.put("hospitalityEmail", "hospitality@chandrika-xudong.in");
        return ResponseEntity.ok(info);
    }
}
