package com.wedding.invitation.controller;

import com.wedding.invitation.model.Rsvp;
import com.wedding.invitation.model.Wish;
import com.wedding.invitation.service.RsvpService;
import com.wedding.invitation.service.WishService;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.StringWriter;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ExportController {

    private final RsvpService rsvpService;
    private final WishService wishService;

    public ExportController(RsvpService rsvpService, WishService wishService) {
        this.rsvpService = rsvpService;
        this.wishService = wishService;
    }

    @GetMapping("/export-rsvp")
    public ResponseEntity<String> exportRsvp() {
        try {
            List<Rsvp> rsvps = rsvpService.getAllRsvps();
            StringWriter writer = new StringWriter();
            CSVFormat format = CSVFormat.DEFAULT.builder()
                    .setHeader("Guest Name", "Phone", "Attendance", "Number of Guests", "Message", "Submitted At")
                    .build();

            try (CSVPrinter printer = new CSVPrinter(writer, format)) {
                for (Rsvp r : rsvps) {
                    printer.printRecord(
                            r.getGuestName(),
                            r.getPhone() != null && !r.getPhone().isBlank() ? "'" + r.getPhone() : "-",
                            r.getAttendance(),
                            r.getGuestCount(),
                            r.getMessage() != null ? r.getMessage() : "",
                            r.getCreatedAt()
                    );
                }
            }

            String filename = "wedding-rsvp-" + LocalDate.now() + ".csv";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                    .body(writer.toString());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to export RSVP data");
        }
    }

    @GetMapping("/export-wishes")
    public ResponseEntity<String> exportWishes() {
        try {
            List<Wish> wishes = wishService.getAllWishes();
            StringWriter writer = new StringWriter();
            CSVFormat format = CSVFormat.DEFAULT.builder()
                    .setHeader("Sender Name", "Message", "Submitted At")
                    .build();

            try (CSVPrinter printer = new CSVPrinter(writer, format)) {
                for (Wish w : wishes) {
                    printer.printRecord(
                            w.getName(),
                            w.getMessage() != null ? w.getMessage() : "",
                            w.getCreatedAt()
                    );
                }
            }

            String filename = "wedding-wishes-" + LocalDate.now() + ".csv";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                    .body(writer.toString());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to export Wishes data");
        }
    }
}
