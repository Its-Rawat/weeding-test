package com.wedding.didi.repository;

import com.wedding.didi.model.Rsvp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RsvpRepository extends JpaRepository<Rsvp, Long> {
    List<Rsvp> findAllByOrderByCreatedAtDesc();
    
    Optional<Rsvp> findByEmailIgnoreCase(String email);
    
    Optional<Rsvp> findByGuestNameIgnoreCase(String guestName);
    
    long countByAttendingStatus(String attendingStatus);

    @Query("SELECT COALESCE(SUM(r.guestCount), 0) FROM Rsvp r WHERE r.attendingStatus = 'ATTENDING'")
    long sumAttendingGuestCount();

    @Query("SELECT COUNT(r) FROM Rsvp r WHERE r.dietaryPreference = :diet AND r.attendingStatus = 'ATTENDING'")
    long countByDietaryPreference(String diet);
}
