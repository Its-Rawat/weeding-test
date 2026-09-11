package com.wedding.didi.service;

import com.wedding.didi.model.Rsvp;
import com.wedding.didi.repository.RsvpRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RsvpService {

    private final RsvpRepository rsvpRepository;

    public RsvpService(RsvpRepository rsvpRepository) {
        this.rsvpRepository = rsvpRepository;
    }

    public Rsvp saveRsvp(Rsvp rsvp) {
        // If an RSVP already exists with same email, update it
        if (rsvp.getEmail() != null && !rsvp.getEmail().trim().isEmpty()) {
            Optional<Rsvp> existing = rsvpRepository.findByEmailIgnoreCase(rsvp.getEmail().trim());
            if (existing.isPresent()) {
                Rsvp current = existing.get();
                if ("ATTENDING".equalsIgnoreCase(current.getAttendingStatus()) && "DECLINED".equalsIgnoreCase(rsvp.getAttendingStatus())) {
                    throw new IllegalArgumentException("Your RSVP has already been confirmed as Attending. Once accepted, reservations cannot be changed to Declined online. Please contact the wedding hospitality desk for assistance.");
                }
                current.setGuestName(rsvp.getGuestName());
                current.setPhone(rsvp.getPhone());
                current.setAttendingStatus(rsvp.getAttendingStatus());
                current.setGuestCount(rsvp.getGuestCount());
                current.setAttendingEvents(rsvp.getAttendingEvents());
                current.setDietaryPreference(rsvp.getDietaryPreference());
                current.setSongRequest(rsvp.getSongRequest());
                current.setBlessingMessage(rsvp.getBlessingMessage());
                current.setInviteCode(rsvp.getInviteCode());
                return rsvpRepository.save(current);
            }
        }
        return rsvpRepository.save(rsvp);
    }

    public List<Rsvp> getAllRsvps() {
        return rsvpRepository.findAllByOrderByCreatedAtDesc();
    }

    public Map<String, Object> getRsvpStats() {
        long total = rsvpRepository.count();
        long attending = rsvpRepository.countByAttendingStatus("ATTENDING");
        long declined = rsvpRepository.countByAttendingStatus("DECLINED");
        long totalGuests = rsvpRepository.sumAttendingGuestCount();
        long pureVeg = rsvpRepository.countByDietaryPreference("PURE_VEG");
        long jainVeg = rsvpRepository.countByDietaryPreference("JAIN_VEG");
        long nonVeg = rsvpRepository.countByDietaryPreference("NON_VEG");

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalResponses", total);
        stats.put("attendingResponses", attending);
        stats.put("declinedResponses", declined);
        stats.put("totalAttendingGuests", totalGuests);
        stats.put("pureVegCount", pureVeg);
        stats.put("jainVegCount", jainVeg);
        stats.put("nonVegCount", nonVeg);

        return stats;
    }
}
