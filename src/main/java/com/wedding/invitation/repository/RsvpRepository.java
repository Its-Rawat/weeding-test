package com.wedding.invitation.repository;

import com.wedding.invitation.model.Rsvp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RsvpRepository extends JpaRepository<Rsvp, Long> {

    List<Rsvp> findAllByOrderByCreatedAtDesc();

    Optional<Rsvp> findByGuestName(String guestName);

    @Modifying
    @Query("DELETE FROM Rsvp r WHERE r.id IN :ids")
    void deleteAllByIdIn(@Param("ids") List<Long> ids);
}
